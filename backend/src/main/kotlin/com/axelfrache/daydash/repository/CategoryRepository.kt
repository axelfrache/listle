package com.axelfrache.daydash.repository

import com.axelfrache.daydash.entity.Category
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepository : JpaRepository<Category, String> {
    fun findBySlug(slug: String): Category?

    fun findByIsActiveTrueOrderBySlugAsc(): List<Category>

    fun findBySourceTypeOrderBySlugAsc(sourceType: String): List<Category>
}
