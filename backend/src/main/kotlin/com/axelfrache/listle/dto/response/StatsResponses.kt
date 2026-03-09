package com.axelfrache.listle.dto.response

data class StatsOverviewResponse(
    val totalGamesPlayed: Long,
    val averageScore: Double,
    val bestScore: Int,
    val currentStreak: Int
)

data class LeaderboardEntry(
    val username: String,
    val score: Int
)
