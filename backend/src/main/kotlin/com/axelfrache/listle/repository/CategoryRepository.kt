package com.axelfrache.listle.repository

import com.axelfrache.listle.entity.Category
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepository : JpaRepository<Category, String> {
    fun findBySlug(slug: String): Category?
}
