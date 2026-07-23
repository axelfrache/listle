package com.axelfrache.daydash.controller

import com.axelfrache.daydash.dto.response.AdminCategoryResponse
import com.axelfrache.daydash.dto.response.CategorySyncAllResponse
import com.axelfrache.daydash.dto.response.CategorySyncResponse
import com.axelfrache.daydash.dto.response.ScheduleItemResponse
import com.axelfrache.daydash.service.AdminService
import com.axelfrache.daydash.service.CategoryWordImportService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/admin")
class AdminController(
    private val categoryWordImportService: CategoryWordImportService,
    private val adminService: AdminService,
) {
    @GetMapping("/schedule")
    fun getSchedule(
        @RequestParam(required = false, defaultValue = "14") days: Int,
    ): ResponseEntity<List<ScheduleItemResponse>> = ResponseEntity.ok(adminService.getSchedule(days))

    @GetMapping("/categories")
    fun getCategories(): ResponseEntity<List<AdminCategoryResponse>> = ResponseEntity.ok(adminService.getCategoriesOverview())

    @PostMapping("/categories/{slug}/sync")
    fun syncCategory(
        @PathVariable slug: String,
        @RequestParam(required = false) minSitelinks: Int?,
    ): ResponseEntity<CategorySyncResponse> = ResponseEntity.ok(categoryWordImportService.syncCategory(slug, minSitelinks))

    @PostMapping("/categories/sync-all")
    fun syncAllCategories(): ResponseEntity<CategorySyncAllResponse> = ResponseEntity.ok(categoryWordImportService.syncAllConfigured())
}
