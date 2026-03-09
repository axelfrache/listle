package com.axelfrache.listle.dto.response

data class CategoryResponse(
    val slug: String,
    val name: String
)

data class DailyCategoryResponse(
    val date: String,
    val category: CategoryResponse
)

data class CategoryDetailResponse(
    val slug: String,
    val name: String,
    val difficulty: Int,
    val isActive: Boolean
)
