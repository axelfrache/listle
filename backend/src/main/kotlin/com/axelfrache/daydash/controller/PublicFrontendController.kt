package com.axelfrache.daydash.controller

import com.axelfrache.daydash.dto.request.PublicFinalizeGameRequest
import com.axelfrache.daydash.dto.request.PublicWordEvaluationRequest
import com.axelfrache.daydash.dto.response.PublicCategoryResponse
import com.axelfrache.daydash.dto.response.PublicDashboardResponse
import com.axelfrache.daydash.dto.response.PublicGameResultResponse
import com.axelfrache.daydash.dto.response.PublicLeaderboardEntryResponse
import com.axelfrache.daydash.dto.response.PublicUserProfileResponse
import com.axelfrache.daydash.dto.response.PublicUserStatsResponse
import com.axelfrache.daydash.dto.response.PublicWordSubmissionResultResponse
import com.axelfrache.daydash.service.PublicFrontendService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/public")
class PublicFrontendController(
    private val publicFrontendService: PublicFrontendService,
) {
    @GetMapping("/categories/daily")
    fun getDailyCategory(): ResponseEntity<PublicCategoryResponse> = ResponseEntity.ok(publicFrontendService.getDailyCategory())

    @GetMapping("/leaderboard")
    fun getLeaderboard(
        @RequestParam(defaultValue = "daily") window: String,
    ): ResponseEntity<List<PublicLeaderboardEntryResponse>> = ResponseEntity.ok(publicFrontendService.getLeaderboard(window))

    @GetMapping("/stats")
    fun getStats(): ResponseEntity<PublicUserStatsResponse> = ResponseEntity.ok(publicFrontendService.getStats())

    @GetMapping("/profile")
    fun getProfile(): ResponseEntity<PublicUserProfileResponse> = ResponseEntity.ok(publicFrontendService.getProfile())

    @GetMapping("/dashboard")
    fun getDashboard(): ResponseEntity<PublicDashboardResponse> = ResponseEntity.ok(publicFrontendService.getDashboard())

    @PostMapping("/games/evaluate")
    fun evaluateWord(
        @RequestBody request: PublicWordEvaluationRequest,
    ): ResponseEntity<PublicWordSubmissionResultResponse> = ResponseEntity.ok(publicFrontendService.evaluateWord(request))

    @PostMapping("/games/finalize")
    fun finalizeGame(
        @RequestBody request: PublicFinalizeGameRequest,
    ): ResponseEntity<PublicGameResultResponse> = ResponseEntity.ok(publicFrontendService.finalizeGame(request))
}
