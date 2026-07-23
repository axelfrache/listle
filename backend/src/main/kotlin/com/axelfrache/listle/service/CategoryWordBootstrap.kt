package com.axelfrache.listle.service

import com.axelfrache.listle.repository.CategoryRepository
import com.axelfrache.listle.repository.CategoryWordRepository
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@ConditionalOnProperty(name = ["listle.wordsync.enabled"], havingValue = "true", matchIfMissing = true)
class CategoryWordBootstrap {
    private val logger = LoggerFactory.getLogger(CategoryWordBootstrap::class.java)

    @Bean
    fun bootstrapEmptyCategories(
        categoryRepository: CategoryRepository,
        categoryWordRepository: CategoryWordRepository,
        importService: CategoryWordImportService
    ): ApplicationRunner = ApplicationRunner {
        val empty = categoryRepository.findBySourceTypeOrderBySlugAsc("WIKIDATA")
            .filter { category -> category.id?.let { categoryWordRepository.countByCategoryId(it) == 0L } ?: false }

        if (empty.isEmpty()) return@ApplicationRunner
        logger.info("Bootstrap : {} catégorie(s) Wikidata vide(s) à peupler", empty.size)

        for (category in empty) {
            try {
                val result = importService.syncCategory(category.slug)
                logger.info("Bootstrap '{}' : {} mots importés", category.slug, result.added)
            } catch (ex: Exception) {
                logger.warn("Bootstrap échoué pour '{}': {}", category.slug, ex.message)
            }
        }
    }
}
