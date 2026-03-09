package com.axelfrache.listle.repository

import com.axelfrache.listle.entity.CategoryWord
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoryWordRepository : JpaRepository<CategoryWord, String> {
    fun existsByCategoryIdAndNormalizedLabel(categoryId: String, normalizedLabel: String): Boolean
    fun countByCategoryId(categoryId: String): Long
    fun findByCategoryIdOrderByLabelAsc(categoryId: String): List<CategoryWord>
}
