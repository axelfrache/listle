package com.axelfrache.daydash.controller

import com.axelfrache.daydash.dto.response.CategoryDetailResponse
import com.axelfrache.daydash.dto.response.CategoryResponse
import com.axelfrache.daydash.dto.response.DailyCategoryResponse
import com.axelfrache.daydash.service.CategoryService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/categories")
class CategoryController(
    private val categoryService: CategoryService,
) {
    @GetMapping
    fun getAllCategories(): ResponseEntity<List<CategoryResponse>> = ResponseEntity.ok(categoryService.getAllCategories())

    @GetMapping("/daily")
    fun getDailyCategory(): ResponseEntity<DailyCategoryResponse> = ResponseEntity.ok(categoryService.getDailyCategory())

    @GetMapping("/{slug}")
    fun getCategoryBySlug(
        @PathVariable slug: String,
    ): ResponseEntity<CategoryDetailResponse> = ResponseEntity.ok(categoryService.getCategoryBySlug(slug))
}
