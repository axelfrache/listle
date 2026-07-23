package com.axelfrache.daydash.service

import com.axelfrache.daydash.dto.response.CategoryDetailResponse
import com.axelfrache.daydash.dto.response.CategoryResponse
import com.axelfrache.daydash.dto.response.DailyCategoryResponse
import com.axelfrache.daydash.exception.ResourceNotFoundException
import com.axelfrache.daydash.repository.CategoryRepository
import org.springframework.stereotype.Service

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val dailyCategoryResolverService: DailyCategoryResolverService,
) {
    fun getAllCategories(): List<CategoryResponse> =
        categoryRepository.findAll().map {
            CategoryResponse(slug = it.slug, name = it.name)
        }

    fun getCategoryBySlug(slug: String): CategoryDetailResponse {
        val category =
            categoryRepository.findBySlug(slug)
                ?: throw ResourceNotFoundException("Catégorie introuvable")

        return CategoryDetailResponse(
            slug = category.slug,
            name = category.name,
            difficulty = category.difficulty,
            isActive = category.isActive,
        )
    }

    fun getDailyCategory(): DailyCategoryResponse {
        val dailyCategory = dailyCategoryResolverService.getOrCreateDailyCategory()
        val category =
            categoryRepository
                .findById(dailyCategory.categoryId)
                .orElseThrow { ResourceNotFoundException("Catégorie introuvable") }

        return DailyCategoryResponse(
            date = dailyCategory.date.toString(),
            category = CategoryResponse(slug = category.slug, name = category.name),
        )
    }
}
