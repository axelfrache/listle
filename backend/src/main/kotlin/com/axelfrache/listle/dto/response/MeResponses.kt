package com.axelfrache.listle.dto.response

data class MeStatPointResponse(
    val label: String,
    val value: Int
)

data class MeCategoryPerformanceResponse(
    val category: String,
    val averageScore: Double,
    val bestScore: Int
)

data class MeRecentGameResponse(
    val date: String,
    val category: String,
    val score: Int,
    val percentile: Int
)

data class MeStatsResponse(
    val averageScore: Double,
    val bestScore: Int,
    val gamesPlayed: Long,
    val currentStreak: Int,
    val totalWordsFound: Int,
    val strongestCategories: List<MeCategoryPerformanceResponse>,
    val recentHistory: List<MeRecentGameResponse>,
    val weeklyTrend: List<MeStatPointResponse>
)

data class MeAchievementResponse(
    val id: String,
    val label: String,
    val description: String
)

data class MeProfileStatsResponse(
    val averageScore: Double,
    val bestScore: Int,
    val gamesPlayed: Long,
    val currentStreak: Int
)

data class MeProfileResponse(
    val username: String,
    val joinedAt: String,
    val tagline: String,
    val avatarLetters: String,
    val badges: List<MeAchievementResponse>,
    val stats: MeProfileStatsResponse
)
