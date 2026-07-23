package com.axelfrache.daydash.service

import com.axelfrache.daydash.entity.Category
import com.axelfrache.daydash.entity.DailyCategory
import com.axelfrache.daydash.exception.ResourceNotFoundException
import com.axelfrache.daydash.repository.CategoryRepository
import com.axelfrache.daydash.repository.DailyCategoryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.MessageDigest
import java.time.LocalDate

@Service
class DailyCategoryResolverService(
    private val dailyCategoryRepository: DailyCategoryRepository,
    private val categoryRepository: CategoryRepository,
) {
    @Transactional
    fun getOrCreateDailyCategory(date: LocalDate = LocalDate.now()): DailyCategory {
        val existing = dailyCategoryRepository.findById(date).orElse(null)
        if (existing != null) {
            return existing
        }

        val activeCategories = activeCategoriesInRotationOrder()
        if (activeCategories.isEmpty()) {
            throw ResourceNotFoundException("Aucune catégorie active disponible")
        }

        val index = Math.floorMod(date.toEpochDay(), activeCategories.size.toLong()).toInt()
        val chosenCategory = activeCategories[index]
        val chosenCategoryId = chosenCategory.id ?: throw ResourceNotFoundException("Identifiant de catégorie manquant")

        return dailyCategoryRepository.save(
            DailyCategory(
                date = date,
                categoryId = chosenCategoryId,
            ),
        )
    }

    fun resolveCategoryForDate(date: LocalDate = LocalDate.now()): Category {
        val dailyCategory = getOrCreateDailyCategory(date)
        return categoryRepository
            .findById(dailyCategory.categoryId)
            .orElseThrow { ResourceNotFoundException("Catégorie introuvable pour la rotation quotidienne") }
    }

    fun activeCategoriesInRotationOrder(): List<Category> =
        categoryRepository
            .findByIsActiveTrueOrderBySlugAsc()
            .sortedBy { rotationKey(it.slug) }

    private fun rotationKey(slug: String): String {
        val digest = MessageDigest.getInstance("MD5").digest("$ROTATION_SEED$slug".toByteArray())
        return digest.joinToString("") { "%02x".format(it) }
    }

    companion object {
        private const val ROTATION_SEED = "daydash-v1:"
    }
}
