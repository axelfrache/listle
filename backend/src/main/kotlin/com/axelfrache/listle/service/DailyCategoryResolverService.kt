package com.axelfrache.listle.service

import com.axelfrache.listle.entity.Category
import com.axelfrache.listle.entity.DailyCategory
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.CategoryRepository
import com.axelfrache.listle.repository.DailyCategoryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
class DailyCategoryResolverService(
    private val dailyCategoryRepository: DailyCategoryRepository,
    private val categoryRepository: CategoryRepository
) {
    @Transactional
    fun getOrCreateDailyCategory(date: LocalDate = LocalDate.now()): DailyCategory {
        val existing = dailyCategoryRepository.findById(date).orElse(null)
        if (existing != null) {
            return existing
        }

        val activeCategories = categoryRepository.findByIsActiveTrueOrderBySlugAsc()
        if (activeCategories.isEmpty()) {
            throw ResourceNotFoundException("Aucune catégorie active disponible")
        }

        val index = Math.floorMod(date.toEpochDay(), activeCategories.size.toLong()).toInt()
        val chosenCategory = activeCategories[index]
        val chosenCategoryId = chosenCategory.id ?: throw ResourceNotFoundException("Identifiant de catégorie manquant")

        return dailyCategoryRepository.save(
            DailyCategory(
                date = date,
                categoryId = chosenCategoryId
            )
        )
    }

    fun resolveCategoryForDate(date: LocalDate = LocalDate.now()): Category {
        val dailyCategory = getOrCreateDailyCategory(date)
        return categoryRepository.findById(dailyCategory.categoryId)
            .orElseThrow { ResourceNotFoundException("Catégorie introuvable pour la rotation quotidienne") }
    }
}
