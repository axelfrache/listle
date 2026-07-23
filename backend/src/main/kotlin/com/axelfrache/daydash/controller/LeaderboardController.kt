package com.axelfrache.listle.controller

import com.axelfrache.listle.dto.response.LeaderboardEntry
import com.axelfrache.listle.service.LeaderboardService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/leaderboards")
class LeaderboardController(private val leaderboardService: LeaderboardService) {

    @GetMapping("/daily")
    fun getDailyLeaderboard(): ResponseEntity<List<LeaderboardEntry>> {
        return ResponseEntity.ok(leaderboardService.getDailyLeaderboard())
    }

    @GetMapping("/weekly")
    fun getWeeklyLeaderboard(): ResponseEntity<List<LeaderboardEntry>> {
        return ResponseEntity.ok(leaderboardService.getWeeklyLeaderboard())
    }

    @GetMapping("/global")
    fun getGlobalLeaderboard(): ResponseEntity<List<LeaderboardEntry>> {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard())
    }
}
