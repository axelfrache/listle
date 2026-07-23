package com.axelfrache.daydash.service

import com.axelfrache.daydash.dto.response.StatsOverviewResponse
import com.axelfrache.daydash.entity.GameStatus
import com.axelfrache.daydash.repository.GameSessionRepository
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class StatsService(
    private val gameSessionRepository: GameSessionRepository,
) {
    fun getOverview(userId: String): StatsOverviewResponse {
        val totalGames = gameSessionRepository.countByUserIdAndStatus(userId, GameStatus.FINISHED)
        val averageScore = gameSessionRepository.getAverageScoreByUserIdAndStatus(userId, GameStatus.FINISHED) ?: 0.0
        val bestScore =
            gameSessionRepository.findTopByUserIdAndStatusOrderByScoreDesc(userId, GameStatus.FINISHED)?.score ?: 0

        val sessions = gameSessionRepository.findByUserIdAndStatus(userId, GameStatus.FINISHED)
        val currentStreak = computeCurrentStreak(sessions.map { it.startedAt.toLocalDate() }.toSet())

        return StatsOverviewResponse(
            totalGamesPlayed = totalGames,
            averageScore = averageScore,
            bestScore = bestScore,
            currentStreak = currentStreak,
        )
    }

    private fun computeCurrentStreak(playedDays: Set<LocalDate>): Int {
        var streak = 0
        var cursor = LocalDate.now()

        while (playedDays.contains(cursor)) {
            streak += 1
            cursor = cursor.minusDays(1)
        }

        return streak
    }
}
