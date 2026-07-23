package com.axelfrache.listle.controller

import com.axelfrache.listle.dto.response.CategoryResponse
import com.axelfrache.listle.dto.response.CategoryDetailResponse
import com.axelfrache.listle.dto.response.DailyCategoryResponse
import com.axelfrache.listle.service.CategoryService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/categories")
class CategoryController(private val categoryService: CategoryService) {

    @GetMapping
    fun getAllCategories(): ResponseEntity<List<CategoryResponse>> {
        return ResponseEntity.ok(categoryService.getAllCategories())
    }

    @GetMapping("/daily")
    fun getDailyCategory(): ResponseEntity<DailyCategoryResponse> {
        return ResponseEntity.ok(categoryService.getDailyCategory())
    }

    @GetMapping("/{slug}")
    fun getCategoryBySlug(@PathVariable slug: String): ResponseEntity<CategoryDetailResponse> {
        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug))
    }
}
