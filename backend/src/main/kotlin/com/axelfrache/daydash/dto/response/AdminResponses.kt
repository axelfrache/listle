package com.axelfrache.daydash.dto.response

data class CategorySyncResponse(
    val slug: String,
    val source: String,
    val fetched: Int,
    val added: Int,
    val skipped: Int,
    val totalWords: Long,
    val error: String? = null,
)

data class CategorySyncAllResponse(
    val synced: Int,
    val failed: Int,
    val results: List<CategorySyncResponse>,
)

data class ScheduleItemResponse(
    val date: String,
    val slug: String,
    val name: String,
    val wordCount: Long,
    val frozen: Boolean,
)

data class AdminCategoryResponse(
    val slug: String,
    val name: String,
    val difficulty: Int,
    val active: Boolean,
    val source: String?,
    val wordCount: Long,
)
