package com.axelfrache.listle.service

import com.axelfrache.listle.dto.response.MeAchievementResponse
import com.axelfrache.listle.dto.response.MeCategoryPerformanceResponse
import com.axelfrache.listle.dto.response.MeProfileResponse
import com.axelfrache.listle.dto.response.MeProfileStatsResponse
import com.axelfrache.listle.dto.response.MeRecentGameResponse
import com.axelfrache.listle.dto.response.MeStatPointResponse
import com.axelfrache.listle.dto.response.MeStatsResponse
import com.axelfrache.listle.entity.GameSession
import com.axelfrache.listle.entity.GameStatus
import com.axelfrache.listle.entity.User
import com.axelfrache.listle.repository.CategoryRepository
import com.axelfrache.listle.repository.GameSessionRepository
import org.springframework.stereotype.Service
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import kotlin.math.round

@Service
class MeService(
    private val gameSessionRepository: GameSessionRepository,
    private val categoryRepository: CategoryRepository
) {
    private val dateFormatter = DateTimeFormatter.ofPattern("dd MMM", Locale.FRENCH)
    private val weekdayFormatter = DateTimeFormatter.ofPattern("EEE", Locale.FRENCH)

    fun getStats(userId: String): MeStatsResponse {
        val sessions = gameSessionRepository.findByUserIdAndStatus(userId, GameStatus.FINISHED)
        if (sessions.isEmpty()) {
            return emptyStats()
        }

        val averageScore = round((sessions.map { it.score }.average()) * 10.0) / 10.0
        val bestScore = sessions.maxOf { it.score }
        val gamesPlayed = sessions.size.toLong()
        val totalWordsFound = sessions.sumOf { it.foundCount }
        val currentStreak = computeCurrentStreak(sessions)

        val categoryNames = categoryRepository.findAll()
            .associateBy({ it.id ?: "" }, { it.name })

        val strongestCategories = sessions
            .groupBy { it.categoryId }
            .entries
            .sortedByDescending { (_, categorySessions) -> categorySessions.map { it.score }.average() }
            .take(3)
            .map { (categoryId, categorySessions) ->
                MeCategoryPerformanceResponse(
                    category = categoryNames[categoryId] ?: "Inconnu",
                    averageScore = round(categorySessions.map { it.score }.average() * 10.0) / 10.0,
                    bestScore = categorySessions.maxOf { it.score }
                )
            }

        val allScores = gameSessionRepository.findByStatus(GameStatus.FINISHED).map { it.score }
        val recentHistory = sessions
            .sortedByDescending { it.startedAt }
            .take(5)
            .map { session ->
                val lowerOrEqual = allScores.count { it <= session.score }
                val percentile = if (allScores.isEmpty()) 50 else ((lowerOrEqual.toDouble() / allScores.size) * 100.0).toInt().coerceIn(1, 99)
                MeRecentGameResponse(
                    date = session.startedAt.toLocalDate().format(dateFormatter),
                    category = categoryNames[session.categoryId] ?: "Inconnu",
                    score = session.score,
                    percentile = percentile
                )
            }

        val weekStart = LocalDate.now().with(DayOfWeek.MONDAY)
        val dailyScores = sessions
            .filter { !it.startedAt.toLocalDate().isBefore(weekStart) }
            .groupBy { it.startedAt.toLocalDate() }
            .mapValues { (_, daySessions) -> daySessions.maxOf { it.score } }

        val weeklyTrend = (0..6).map { offset ->
            val day = weekStart.plusDays(offset.toLong())
            MeStatPointResponse(
                label = day.format(weekdayFormatter),
                value = dailyScores[day] ?: 0
            )
        }

        return MeStatsResponse(
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

    fun getProfile(user: User): MeProfileResponse {
        val stats = getStats(user.id ?: "")
        val cleanUsername = user.username.trim()
        val avatarLetters = cleanUsername
            .replace(Regex("[^A-Za-z0-9]"), "")
            .take(2)
            .uppercase()
            .ifBlank { "US" }

        return MeProfileResponse(
            username = user.username,
            joinedAt = user.createdAt.toLocalDate().toString(),
            tagline = "Joueur Listle authentifié.",
            avatarLetters = avatarLetters,
            badges = listOf(
                MeAchievementResponse(
                    id = "streak",
                    label = "Série de ${stats.currentStreak} jours",
                    description = "Jours consécutifs avec une manche terminée."
                ),
                MeAchievementResponse(
                    id = "best",
                    label = "Record ${stats.bestScore}",
                    description = "Meilleur score enregistré sur ton compte."
                ),
                MeAchievementResponse(
                    id = "games",
                    label = "${stats.gamesPlayed} parties",
                    description = "Total des manches terminées sur ton compte."
                )
            ),
            stats = MeProfileStatsResponse(
                averageScore = stats.averageScore,
                bestScore = stats.bestScore,
                gamesPlayed = stats.gamesPlayed,
                currentStreak = stats.currentStreak
            )
        )
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

    private fun emptyStats(): MeStatsResponse {
        return MeStatsResponse(
            averageScore = 0.0,
            bestScore = 0,
            gamesPlayed = 0,
            currentStreak = 0,
            totalWordsFound = 0,
            strongestCategories = emptyList(),
            recentHistory = emptyList(),
            weeklyTrend = listOf("Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim")
                .map { MeStatPointResponse(it, 0) }
        )
    }
}
