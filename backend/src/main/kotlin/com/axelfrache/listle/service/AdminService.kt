package com.axelfrache.listle.service

import com.axelfrache.listle.dto.response.AdminCategoryResponse
import com.axelfrache.listle.dto.response.ScheduleItemResponse
import com.axelfrache.listle.repository.CategoryRepository
import com.axelfrache.listle.repository.CategoryWordRepository
import com.axelfrache.listle.repository.DailyCategoryRepository
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class AdminService(
    private val categoryRepository: CategoryRepository,
    private val categoryWordRepository: CategoryWordRepository,
    private val dailyCategoryRepository: DailyCategoryRepository
) {
    fun getSchedule(days: Int): List<ScheduleItemResponse> {
        val horizon = days.coerceIn(1, 60)
        val active = categoryRepository.findByIsActiveTrueOrderBySlugAsc()
        if (active.isEmpty()) return emptyList()

        val today = LocalDate.now()
        return (0 until horizon).map { offset ->
            val date = today.plusDays(offset.toLong())
            val existing = dailyCategoryRepository.findById(date).orElse(null)
            val category = if (existing != null) {
                categoryRepository.findById(existing.categoryId).orElse(null)
            } else {
                val index = Math.floorMod(date.toEpochDay(), active.size.toLong()).toInt()
                active[index]
            }
            val wordCount = category?.id?.let { categoryWordRepository.countByCategoryId(it) } ?: 0L
            ScheduleItemResponse(
                date = date.toString(),
                slug = category?.slug ?: "?",
                name = category?.name ?: "?",
                wordCount = wordCount,
                frozen = existing != null
            )
        }
    }

    fun getCategoriesOverview(): List<AdminCategoryResponse> {
        return categoryRepository.findAll()
            .sortedBy { it.slug }
            .map { category ->
                val source = category.sourceType?.let { type ->
                    if (category.sourceRef != null) "$type:${category.sourceRef}" else type
                }
                AdminCategoryResponse(
                    slug = category.slug,
                    name = category.name,
                    difficulty = category.difficulty,
                    active = category.isActive,
                    source = source,
                    wordCount = category.id?.let { categoryWordRepository.countByCategoryId(it) } ?: 0L
                )
            }
    }
}
