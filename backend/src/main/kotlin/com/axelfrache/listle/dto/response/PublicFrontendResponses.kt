package com.axelfrache.listle.dto.response

data class PublicCategoryResponse(
    val id: String,
    val name: String,
    val description: String,
    val accent: String,
    val words: List<String>
)

data class PublicLeaderboardEntryResponse(
    val rank: Int,
    val username: String,
    val score: Int,
    val streak: Int,
    val isCurrentUser: Boolean
)

data class PublicStatPointResponse(
    val label: String,
    val value: Int
)

data class PublicCategoryPerformanceResponse(
    val category: String,
    val averageScore: Double,
    val bestScore: Int
)

data class PublicRecentGameResponse(
    val date: String,
    val category: String,
    val score: Int,
    val percentile: Int
)

data class PublicUserStatsResponse(
    val averageScore: Double,
    val bestScore: Int,
    val gamesPlayed: Long,
    val currentStreak: Int,
    val totalWordsFound: Int,
    val strongestCategories: List<PublicCategoryPerformanceResponse>,
    val recentHistory: List<PublicRecentGameResponse>,
    val weeklyTrend: List<PublicStatPointResponse>
)

data class PublicAchievementResponse(
    val id: String,
    val label: String,
    val description: String
)

data class PublicUserProfileStatsResponse(
    val averageScore: Double,
    val bestScore: Int,
    val gamesPlayed: Long,
    val currentStreak: Int
)

data class PublicUserProfileResponse(
    val username: String,
    val joinedAt: String,
    val tagline: String,
    val avatarLetters: String,
    val badges: List<PublicAchievementResponse>,
    val stats: PublicUserProfileStatsResponse
)

data class PublicDailySnapshotResponse(
    val date: String,
    val category: PublicCategoryResponse,
    val userBestScore: Int,
    val userStreak: Int,
    val leaderboardPreview: List<PublicLeaderboardEntryResponse>
)

data class PublicDashboardResponse(
    val snapshot: PublicDailySnapshotResponse,
    val stats: PublicUserStatsResponse,
    val profile: PublicUserProfileResponse
)

data class PublicWordSubmissionResultResponse(
    val status: String,
    val normalized: String,
    val scoreDelta: Int
)

data class PublicGameResultResponse(
    val score: Int,
    val words: List<String>,
    val bestScore: Int,
    val streak: Int,
    val percentile: Int
)
