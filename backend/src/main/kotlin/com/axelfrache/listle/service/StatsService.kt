package com.axelfrache.listle.service

import com.axelfrache.listle.dto.response.StatsOverviewResponse
import com.axelfrache.listle.entity.GameStatus
import com.axelfrache.listle.repository.GameSessionRepository
import org.springframework.stereotype.Service

@Service
class StatsService(
    private val gameSessionRepository: GameSessionRepository
) {
    fun getOverview(userId: String): StatsOverviewResponse {
        val totalGames = gameSessionRepository.countByUserIdAndStatus(userId, GameStatus.FINISHED)
        val averageScore = gameSessionRepository.getAverageScoreByUserIdAndStatus(userId, GameStatus.FINISHED) ?: 0.0
        val bestScore = gameSessionRepository.findTopByUserIdAndStatusOrderByScoreDesc(userId, GameStatus.FINISHED)?.score ?: 0
        
        val currentStreak = 0

        return StatsOverviewResponse(
            totalGamesPlayed = totalGames,
            averageScore = averageScore,
            bestScore = bestScore,
            currentStreak = currentStreak
        )
    }
}
