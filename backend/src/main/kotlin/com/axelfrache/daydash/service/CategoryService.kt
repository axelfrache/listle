package com.axelfrache.listle.service

import com.axelfrache.listle.dto.response.CategoryResponse
import com.axelfrache.listle.dto.response.CategoryDetailResponse
import com.axelfrache.listle.dto.response.DailyCategoryResponse
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.CategoryRepository
import org.springframework.stereotype.Service

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val dailyCategoryResolverService: DailyCategoryResolverService
) {
    fun getAllCategories(): List<CategoryResponse> {
        return categoryRepository.findAll().map {
            CategoryResponse(slug = it.slug, name = it.name)
        }
    }

    fun getCategoryBySlug(slug: String): CategoryDetailResponse {
        val category = categoryRepository.findBySlug(slug)
            ?: throw ResourceNotFoundException("Catégorie introuvable")

        return CategoryDetailResponse(
            slug = category.slug,
            name = category.name,
            difficulty = category.difficulty,
            isActive = category.isActive
        )
    }

    fun getDailyCategory(): DailyCategoryResponse {
        val dailyCategory = dailyCategoryResolverService.getOrCreateDailyCategory()
        val category = categoryRepository.findById(dailyCategory.categoryId)
            .orElseThrow { ResourceNotFoundException("Catégorie introuvable") }

        return DailyCategoryResponse(
            date = dailyCategory.date.toString(),
            category = CategoryResponse(slug = category.slug, name = category.name)
        )
    }
}
