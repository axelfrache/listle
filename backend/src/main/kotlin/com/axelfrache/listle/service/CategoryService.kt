package com.axelfrache.listle.service

import com.axelfrache.listle.dto.response.CategoryResponse
import com.axelfrache.listle.dto.response.CategoryDetailResponse
import com.axelfrache.listle.dto.response.DailyCategoryResponse
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.CategoryRepository
import com.axelfrache.listle.repository.DailyCategoryRepository
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val dailyCategoryRepository: DailyCategoryRepository
) {
    fun getAllCategories(): List<CategoryResponse> {
        return categoryRepository.findAll().map {
            CategoryResponse(slug = it.slug, name = it.name)
        }
    }

    fun getCategoryBySlug(slug: String): CategoryDetailResponse {
        val category = categoryRepository.findBySlug(slug)
            ?: throw ResourceNotFoundException("Category not found")

        return CategoryDetailResponse(
            slug = category.slug,
            name = category.name,
            difficulty = category.difficulty,
            isActive = category.isActive
        )
    }

    fun getDailyCategory(): DailyCategoryResponse {
        val today = LocalDate.now()
        val dailyCategory = dailyCategoryRepository.findById(today)
            .orElseThrow { ResourceNotFoundException("No daily category set for today") }
        
        val category = categoryRepository.findById(dailyCategory.categoryId)
            .orElseThrow { ResourceNotFoundException("Category not found") }

        return DailyCategoryResponse(
            date = today.toString(),
            category = CategoryResponse(slug = category.slug, name = category.name)
        )
    }
}
