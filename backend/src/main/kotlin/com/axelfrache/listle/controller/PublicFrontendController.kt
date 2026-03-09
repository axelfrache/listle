package com.axelfrache.listle.controller

import com.axelfrache.listle.dto.request.PublicFinalizeGameRequest
import com.axelfrache.listle.dto.request.PublicWordEvaluationRequest
import com.axelfrache.listle.dto.response.PublicCategoryResponse
import com.axelfrache.listle.dto.response.PublicDashboardResponse
import com.axelfrache.listle.dto.response.PublicGameResultResponse
import com.axelfrache.listle.dto.response.PublicLeaderboardEntryResponse
import com.axelfrache.listle.dto.response.PublicUserProfileResponse
import com.axelfrache.listle.dto.response.PublicUserStatsResponse
import com.axelfrache.listle.dto.response.PublicWordSubmissionResultResponse
import com.axelfrache.listle.service.PublicFrontendService
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
    private val publicFrontendService: PublicFrontendService
) {
    @GetMapping("/categories/daily")
    fun getDailyCategory(): ResponseEntity<PublicCategoryResponse> {
        return ResponseEntity.ok(publicFrontendService.getDailyCategory())
    }

    @GetMapping("/leaderboard")
    fun getLeaderboard(
        @RequestParam(defaultValue = "daily") window: String
    ): ResponseEntity<List<PublicLeaderboardEntryResponse>> {
        return ResponseEntity.ok(publicFrontendService.getLeaderboard(window))
    }

    @GetMapping("/stats")
    fun getStats(): ResponseEntity<PublicUserStatsResponse> {
        return ResponseEntity.ok(publicFrontendService.getStats())
    }

    @GetMapping("/profile")
    fun getProfile(): ResponseEntity<PublicUserProfileResponse> {
        return ResponseEntity.ok(publicFrontendService.getProfile())
    }

    @GetMapping("/dashboard")
    fun getDashboard(): ResponseEntity<PublicDashboardResponse> {
        return ResponseEntity.ok(publicFrontendService.getDashboard())
    }

    @PostMapping("/games/evaluate")
    fun evaluateWord(
        @RequestBody request: PublicWordEvaluationRequest
    ): ResponseEntity<PublicWordSubmissionResultResponse> {
        return ResponseEntity.ok(publicFrontendService.evaluateWord(request))
    }

    @PostMapping("/games/finalize")
    fun finalizeGame(
        @RequestBody request: PublicFinalizeGameRequest
    ): ResponseEntity<PublicGameResultResponse> {
        return ResponseEntity.ok(publicFrontendService.finalizeGame(request))
    }
}
