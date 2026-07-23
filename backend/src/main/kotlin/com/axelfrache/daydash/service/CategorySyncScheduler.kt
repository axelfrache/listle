package com.axelfrache.daydash.service

import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
@ConditionalOnProperty(name = ["daydash.wordsync.enabled"], havingValue = "true", matchIfMissing = true)
class CategorySyncScheduler(
    private val categoryWordImportService: CategoryWordImportService,
) {
    private val logger = LoggerFactory.getLogger(CategorySyncScheduler::class.java)

    @Scheduled(cron = "\${daydash.wordsync.cron:0 0 4 * * MON}", zone = "Europe/Paris")
    fun refreshCategoryWords() {
        logger.info("Démarrage du rafraîchissement hebdomadaire des mots (Wikidata)")
        val result = categoryWordImportService.syncAllConfigured()
        logger.info(
            "Rafraîchissement terminé : {} catégories synchronisées, {} en échec",
            result.synced,
            result.failed,
        )
    }
}
