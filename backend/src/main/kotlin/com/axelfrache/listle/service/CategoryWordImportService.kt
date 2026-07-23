package com.axelfrache.listle.service

import com.axelfrache.listle.dto.response.CategorySyncAllResponse
import com.axelfrache.listle.dto.response.CategorySyncResponse
import com.axelfrache.listle.entity.CategoryWord
import com.axelfrache.listle.exception.GameLogicException
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.CategoryRepository
import com.axelfrache.listle.repository.CategoryWordRepository
import com.axelfrache.listle.util.WordNormalizer
import com.fasterxml.jackson.databind.JsonNode
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestClient

@Service
class CategoryWordImportService(
    private val categoryRepository: CategoryRepository,
    private val categoryWordRepository: CategoryWordRepository
) {
    private val logger = LoggerFactory.getLogger(CategoryWordImportService::class.java)

    private val wikidataClient: RestClient = RestClient.builder()
        .baseUrl(WIKIDATA_SPARQL_ENDPOINT)
        .defaultHeader("Accept", "application/sparql-results+json")
        .defaultHeader("User-Agent", USER_AGENT)
        .build()

    @Transactional
    fun syncCategory(slug: String, minSitelinks: Int? = null): CategorySyncResponse {
        val category = categoryRepository.findBySlug(slug)
            ?: throw ResourceNotFoundException("Catégorie introuvable")
        val categoryId = category.id
            ?: throw ResourceNotFoundException("Identifiant de catégorie manquant")

        val sourceRef = category.sourceRef
        if (category.sourceType != "WIKIDATA" || sourceRef.isNullOrBlank()) {
            throw GameLogicException("La catégorie '$slug' n'a pas de source Wikidata configurée")
        }

        val effectiveThreshold = minSitelinks ?: category.sourceMinSitelinks ?: DEFAULT_MIN_SITELINKS
        val labels = fetchWikidataLabels(sourceRef, effectiveThreshold)

        val existing = categoryWordRepository.findByCategoryIdOrderByLabelAsc(categoryId)
            .map { it.normalizedLabel }
            .toMutableSet()

        var added = 0
        var skipped = 0
        val toSave = mutableListOf<CategoryWord>()

        for (rawLabel in labels) {
            val label = rawLabel.trim()
            if (!isAcceptableLabel(label)) {
                skipped++
                continue
            }
            val normalized = WordNormalizer.normalize(label)
            if (normalized.isBlank() || normalized in existing) {
                skipped++
                continue
            }
            existing.add(normalized)
            toSave.add(
                CategoryWord(
                    categoryId = categoryId,
                    label = label,
                    normalizedLabel = normalized
                )
            )
            added++
        }

        categoryWordRepository.saveAll(toSave)
        val total = categoryWordRepository.countByCategoryId(categoryId)
        logger.info("Sync catégorie '{}' : {} labels reçus, {} ajoutés, {} ignorés, {} au total", slug, labels.size, added, skipped, total)

        return CategorySyncResponse(
            slug = slug,
            source = "wikidata:${category.sourceRef}",
            fetched = labels.size,
            added = added,
            skipped = skipped,
            totalWords = total
        )
    }

    fun syncAllConfigured(): CategorySyncAllResponse {
        val categories = categoryRepository.findBySourceTypeOrderBySlugAsc("WIKIDATA")
        val results = mutableListOf<CategorySyncResponse>()

        for ((index, category) in categories.withIndex()) {
            try {
                results.add(syncCategory(category.slug))
            } catch (ex: Exception) {
                logger.warn("Sync échouée pour la catégorie '{}': {}", category.slug, ex.message)
                results.add(
                    CategorySyncResponse(
                        slug = category.slug,
                        source = "wikidata:${category.sourceRef}",
                        fetched = 0,
                        added = 0,
                        skipped = 0,
                        totalWords = category.id?.let { categoryWordRepository.countByCategoryId(it) } ?: 0,
                        error = ex.message ?: ex.javaClass.simpleName
                    )
                )
            }
            if (index < categories.size - 1) {
                Thread.sleep(THROTTLE_MS)
            }
        }

        val failed = results.count { it.error != null }
        return CategorySyncAllResponse(
            synced = results.size - failed,
            failed = failed,
            results = results
        )
    }

    private fun fetchWikidataLabels(qid: String, minSitelinks: Int): List<String> {
        require(qid.matches(QID_PATTERN)) { "QID Wikidata invalide: $qid" }

        val query = """
            SELECT DISTINCT ?label WHERE {
              ?item (wdt:P31|wdt:P279)/wdt:P279* wd:$qid .
              ?item wikibase:sitelinks ?sl .
              FILTER(?sl >= $minSitelinks)
              ?article schema:about ?item ; schema:isPartOf <https://fr.wikipedia.org/> .
              { ?item rdfs:label ?label . FILTER(LANG(?label) = "fr") }
              UNION
              { ?item skos:altLabel ?label . FILTER(LANG(?label) = "fr") }
            }
        """.trimIndent()

        val response = try {
            wikidataClient.get()
                .uri { it.queryParam("query", query).build() }
                .retrieve()
                .body(JsonNode::class.java)
        } catch (ex: Exception) {
            logger.error("Échec de l'appel Wikidata pour {}: {}", qid, ex.message)
            throw GameLogicException("Impossible de contacter Wikidata: ${ex.message}")
        } ?: return emptyList()

        return response.path("results").path("bindings")
            .mapNotNull { it.path("label").path("value").asText(null) }
    }

    private fun isAcceptableLabel(label: String): Boolean {
        if (label.length < 2) return false
        if (label.contains('(') || label.contains(')')) return false
        if (label.contains(" sect.")) return false
        if (WIKI_NAMESPACE_PATTERN.containsMatchIn(label)) return false
        return true
    }

    companion object {
        private const val WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"
        private const val USER_AGENT = "ListleGame/0.1 (https://github.com/axelfrache/listle; axelfrache@gmail.com)"
        private const val DEFAULT_MIN_SITELINKS = 25
        private const val THROTTLE_MS = 1500L
        private val QID_PATTERN = Regex("^Q\\d+$")
        private val WIKI_NAMESPACE_PATTERN = Regex("^(Modèle|Wikipédia|Catégorie|Aide|Portail|Utilisateur|Projet|Fichier):")
    }
}
