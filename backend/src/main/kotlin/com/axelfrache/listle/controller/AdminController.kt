package com.axelfrache.listle.controller

import com.axelfrache.listle.dto.response.AdminCategoryResponse
import com.axelfrache.listle.dto.response.CategorySyncAllResponse
import com.axelfrache.listle.dto.response.CategorySyncResponse
import com.axelfrache.listle.dto.response.ScheduleItemResponse
import com.axelfrache.listle.service.AdminService
import com.axelfrache.listle.service.CategoryWordImportService
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
    private val adminService: AdminService
) {

    @GetMapping("/schedule")
    fun getSchedule(
        @RequestParam(required = false, defaultValue = "14") days: Int
    ): ResponseEntity<List<ScheduleItemResponse>> {
        return ResponseEntity.ok(adminService.getSchedule(days))
    }

    @GetMapping("/categories")
    fun getCategories(): ResponseEntity<List<AdminCategoryResponse>> {
        return ResponseEntity.ok(adminService.getCategoriesOverview())
    }

    @PostMapping("/categories/{slug}/sync")
    fun syncCategory(
        @PathVariable slug: String,
        @RequestParam(required = false) minSitelinks: Int?
    ): ResponseEntity<CategorySyncResponse> {
        return ResponseEntity.ok(categoryWordImportService.syncCategory(slug, minSitelinks))
    }

    @PostMapping("/categories/sync-all")
    fun syncAllCategories(): ResponseEntity<CategorySyncAllResponse> {
        return ResponseEntity.ok(categoryWordImportService.syncAllConfigured())
    }
}
