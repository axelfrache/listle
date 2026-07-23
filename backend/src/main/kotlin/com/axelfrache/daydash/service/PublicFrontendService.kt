package com.axelfrache.listle.service

import com.axelfrache.listle.dto.request.PublicFinalizeGameRequest
import com.axelfrache.listle.dto.request.PublicWordEvaluationRequest
import com.axelfrache.listle.dto.response.PublicAchievementResponse
import com.axelfrache.listle.dto.response.PublicCategoryPerformanceResponse
import com.axelfrache.listle.dto.response.PublicCategoryResponse
import com.axelfrache.listle.dto.response.PublicDailySnapshotResponse
import com.axelfrache.listle.dto.response.PublicDashboardResponse
import com.axelfrache.listle.dto.response.PublicGameResultResponse
import com.axelfrache.listle.dto.response.PublicLeaderboardEntryResponse
import com.axelfrache.listle.dto.response.PublicRecentGameResponse
import com.axelfrache.listle.dto.response.PublicStatPointResponse
import com.axelfrache.listle.dto.response.PublicUserProfileResponse
import com.axelfrache.listle.dto.response.PublicUserProfileStatsResponse
import com.axelfrache.listle.dto.response.PublicUserStatsResponse
import com.axelfrache.listle.dto.response.PublicWordSubmissionResultResponse
import com.axelfrache.listle.entity.GameStatus
import com.axelfrache.listle.entity.GameSession
import com.axelfrache.listle.entity.User
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.CategoryRepository
import com.axelfrache.listle.repository.CategoryWordRepository
import com.axelfrache.listle.repository.GameSessionRepository
import com.axelfrache.listle.repository.UserRepository
import com.axelfrache.listle.util.WordNormalizer
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale
import kotlin.math.round

@Service
class PublicFrontendService(
    private val categoryRepository: CategoryRepository,
    private val categoryWordRepository: CategoryWordRepository,
    private val dailyCategoryResolverService: DailyCategoryResolverService,
    private val gameSessionRepository: GameSessionRepository,
    private val userRepository: UserRepository
) {
    private val dateFormatter = DateTimeFormatter.ofPattern("dd MMM", Locale.FRENCH)
    private val weekdayFormatter = DateTimeFormatter.ofPattern("EEE", Locale.FRENCH)

    fun getDailyCategory(): PublicCategoryResponse {
        return resolveDailyCategory()
    }

    fun getLeaderboard(window: String): List<PublicLeaderboardEntryResponse> {
        val currentUser = resolveCurrentUser()
        val sessions = when (window.lowercase()) {
            "daily" -> getDailyFinishedSessions()
            "weekly" -> gameSessionRepository.findByStatusAndStartedAtAfter(GameStatus.FINISHED, LocalDateTime.now().minusDays(7))
            else -> gameSessionRepository.findByStatus(GameStatus.FINISHED)
        }

        if (sessions.isEmpty()) {
            return emptyList()
        }

        val grouped = sessions.groupBy { it.userId }
        val scoreByUser = grouped.mapValues { (_, userSessions) ->
            if (window.lowercase() == "daily") {
                userSessions.maxOf { it.score }
            } else {
                userSessions.sumOf { it.score }
            }
        }

        return scoreByUser.entries
            .sortedByDescending { it.value }
            .take(10)
            .mapIndexedNotNull { index, entry ->
                val user = userRepository.findById(entry.key).orElse(null) ?: return@mapIndexedNotNull null
                PublicLeaderboardEntryResponse(
                    rank = index + 1,
                    username = user.username,
                    score = entry.value,
                    streak = gameSessionRepository.countByUserIdAndStatus(user.id!!, GameStatus.FINISHED).toInt(),
                    isCurrentUser = currentUser?.id == user.id
                )
            }
    }

    fun getStats(): PublicUserStatsResponse {
        val user = resolveCurrentUser()
        if (user == null) {
            return emptyStats()
        }

        val sessions = gameSessionRepository.findByUserId(user.id!!).filter { it.status == GameStatus.FINISHED }
        if (sessions.isEmpty()) {
            return emptyStats()
        }

        val averageScore = round((sessions.map { it.score }.average()) * 10.0) / 10.0
        val bestScore = sessions.maxOf { it.score }
        val gamesPlayed = sessions.size.toLong()
        val totalWordsFound = sessions.sumOf { it.foundCount }
        val currentStreak = computeCurrentStreak(sessions)

        val strongestCategories = sessions
            .groupBy { it.categoryId }
            .entries
            .sortedByDescending { (_, categorySessions) -> categorySessions.map { it.score }.average() }
            .take(3)
            .map { (categoryId, categorySessions) ->
                val categoryName = categoryRepository.findById(categoryId).orElse(null)?.name ?: "Inconnu"
                PublicCategoryPerformanceResponse(
                    category = categoryName,
                    averageScore = round(categorySessions.map { it.score }.average() * 10.0) / 10.0,
                    bestScore = categorySessions.maxOf { it.score }
                )
            }

        val recentHistory = sessions
            .sortedByDescending { it.startedAt }
            .take(5)
            .map { session ->
                val categoryName = categoryRepository.findById(session.categoryId).orElse(null)?.name ?: "Inconnu"
                PublicRecentGameResponse(
                    date = session.startedAt.toLocalDate().format(dateFormatter),
                    category = categoryName,
                    score = session.score,
                    percentile = computePercentile(session.score)
                )
            }

        val weekStart = LocalDate.now().with(DayOfWeek.MONDAY)
        val dailyScores = sessions
            .filter { !it.startedAt.toLocalDate().isBefore(weekStart) }
            .groupBy { it.startedAt.toLocalDate() }
            .mapValues { (_, daySessions) -> daySessions.maxOf { it.score } }

        val weeklyTrend = (0..6).map { offset ->
            val day = weekStart.plusDays(offset.toLong())
            PublicStatPointResponse(
                label = day.format(weekdayFormatter),
                value = dailyScores[day] ?: 0
            )
        }

        return PublicUserStatsResponse(
            averageScore = averageScore,
            bestScore = bestScore,
            gamesPlayed = gamesPlayed,
            currentStreak = currentStreak,
            totalWordsFound = totalWordsFound,
            strongestCategories = strongestCategories,
            recentHistory = recentHistory,
            weeklyTrend = weeklyTrend
        )
    }

    fun getProfile(): PublicUserProfileResponse {
        val user = resolveCurrentUser()
        val stats = getStats()

        val username = user?.username ?: "Invité"
        val avatarLetters = username
            .replace(Regex("[^A-Za-z0-9]"), "")
            .take(2)
            .uppercase()
            .ifBlank { "GU" }

        val badges = listOf(
            PublicAchievementResponse(
                id = "streak",
                label = "Série de ${stats.currentStreak} jours",
                description = "A joué ${"%d".format(stats.currentStreak)} manches quotidiennes d'affilée"
            ),
            PublicAchievementResponse(
                id = "best",
                label = "Record ${stats.bestScore}",
                description = "Meilleur score confirmé à ce jour"
            ),
            PublicAchievementResponse(
                id = "volume",
                label = "${stats.gamesPlayed} parties",
                description = "Manches terminées suivies par le backend"
            )
        )

        return PublicUserProfileResponse(
            username = username,
            joinedAt = user?.createdAt?.toLocalDate()?.toString() ?: LocalDate.now().toString(),
            tagline = "Chasseur de mots quotidien en progression à chaque sprint.",
            avatarLetters = avatarLetters,
            badges = badges,
            stats = PublicUserProfileStatsResponse(
                averageScore = stats.averageScore,
                bestScore = stats.bestScore,
                gamesPlayed = stats.gamesPlayed,
                currentStreak = stats.currentStreak
            )
        )
    }

    fun getDashboard(): PublicDashboardResponse {
        val dailyCategory = resolveDailyCategory()
        val leaderboard = getLeaderboard("daily")
        val stats = getStats()
        val profile = getProfile()

        return PublicDashboardResponse(
            snapshot = PublicDailySnapshotResponse(
                date = LocalDate.now().toString(),
                category = dailyCategory,
                userBestScore = stats.bestScore,
                userStreak = stats.currentStreak,
                leaderboardPreview = leaderboard.take(5)
            ),
            stats = stats,
            profile = profile
        )
    }

    fun evaluateWord(request: PublicWordEvaluationRequest): PublicWordSubmissionResultResponse {
        val candidates = WordNormalizer.candidates(request.rawWord)
        val normalized = candidates.firstOrNull() ?: ""
        if (normalized.isBlank() || !normalized.matches(Regex("^[a-z][a-z0-9\\s-]*$"))) {
            return PublicWordSubmissionResultResponse(status = "invalid", normalized = normalized, scoreDelta = 0)
        }

        val existingNormalized = request.existingWords.flatMap { WordNormalizer.candidates(it) }.toSet()
        if (candidates.any { it in existingNormalized }) {
            return PublicWordSubmissionResultResponse(status = "duplicate", normalized = normalized, scoreDelta = 0)
        }

        val matchedNormalized = candidates.firstOrNull {
            categoryWordRepository.existsByCategoryIdAndNormalizedLabel(request.categoryId, it)
        }
        return if (matchedNormalized != null) {
            PublicWordSubmissionResultResponse(status = "valid", normalized = matchedNormalized, scoreDelta = 1)
        } else {
            PublicWordSubmissionResultResponse(status = "invalid", normalized = normalized, scoreDelta = 0)
        }
    }

    fun finalizeGame(request: PublicFinalizeGameRequest): PublicGameResultResponse {
        val normalizedWords = request.words.map { WordNormalizer.normalize(it) }.filter { it.isNotBlank() }.distinct()
        val score = normalizedWords.size
        val stats = getStats()
        val streak = if (score > 0) stats.currentStreak + 1 else stats.currentStreak

        return PublicGameResultResponse(
            score = score,
            words = normalizedWords,
            bestScore = maxOf(score, stats.bestScore),
            streak = streak,
            percentile = computePercentile(score)
        )
    }

    private fun resolveDailyCategory(): PublicCategoryResponse {
        val category = dailyCategoryResolverService.resolveCategoryForDate()

        val persistedCategoryId = category.id ?: throw ResourceNotFoundException("Identifiant de catégorie manquant")
        val words = categoryWordRepository.findByCategoryIdOrderByLabelAsc(persistedCategoryId).map { it.normalizedLabel }
        return PublicCategoryResponse(
            id = persistedCategoryId,
            name = category.name,
            description = "Saisis un maximum de mots de la catégorie ${category.name.lowercase()}.",
            accent = accentForCategory(category.slug),
            words = words
        )
    }

    private fun accentForCategory(slug: String): String {
        return when (slug.lowercase()) {
            "fruits" -> "#ff7a59"
            "animaux" -> "#68f2a3"
            "pays" -> "#ffe45e"
            else -> "#00c2a8"
        }
    }

    private fun getDailyFinishedSessions(): List<GameSession> {
        val daily = dailyCategoryResolverService.getOrCreateDailyCategory()
        val today = daily.date
        return gameSessionRepository.findTop10ByCategoryIdAndStatusAndStartedAtAfterOrderByScoreDesc(
            daily.categoryId,
            GameStatus.FINISHED,
            today.atStartOfDay()
        )
    }

    private fun resolveCurrentUser(): User? {
        return userRepository.findByUsername("you")
            ?: userRepository.findByUsername("You")
            ?: userRepository.findAll().sortedBy { it.createdAt }.firstOrNull()
    }

    private fun computeCurrentStreak(sessions: List<GameSession>): Int {
        val playedDays = sessions.map { it.startedAt.toLocalDate() }.toSet()
        var streak = 0
        var cursor = LocalDate.now()

        while (playedDays.contains(cursor)) {
            streak += 1
            cursor = cursor.minusDays(1)
        }

        return streak
    }

    private fun computePercentile(score: Int): Int {
        val allFinishedScores = gameSessionRepository.findByStatus(GameStatus.FINISHED).map { it.score }
        if (allFinishedScores.isEmpty()) {
            return if (score <= 0) 50 else 80
        }

        val lowerOrEqual = allFinishedScores.count { it <= score }
        val percentile = ((lowerOrEqual.toDouble() / allFinishedScores.size.toDouble()) * 100.0).toInt()
        return percentile.coerceIn(1, 99)
    }

    private fun emptyStats(): PublicUserStatsResponse {
        val labels = listOf("Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim")
        return PublicUserStatsResponse(
            averageScore = 0.0,
            bestScore = 0,
            gamesPlayed = 0,
            currentStreak = 0,
            totalWordsFound = 0,
            strongestCategories = emptyList(),
            recentHistory = emptyList(),
            weeklyTrend = labels.map { PublicStatPointResponse(label = it, value = 0) }
        )
    }
}
