package com.axelfrache.listle.service

import com.axelfrache.listle.dto.response.LeaderboardEntry
import com.axelfrache.listle.entity.GameStatus
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.DailyCategoryRepository
import com.axelfrache.listle.repository.GameSessionRepository
import com.axelfrache.listle.repository.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class LeaderboardService(
    private val gameSessionRepository: GameSessionRepository,
    private val dailyCategoryRepository: DailyCategoryRepository,
    private val userRepository: UserRepository
) {

    fun getDailyLeaderboard(): List<LeaderboardEntry> {
        val today = LocalDate.now()
        val dailyCategory = dailyCategoryRepository.findById(today)
            .orElseThrow { ResourceNotFoundException("No daily category set for today") }

        val sessions = gameSessionRepository.findTop10ByCategoryIdAndStatusAndStartedAtAfterOrderByScoreDesc(
            dailyCategory.categoryId,
            GameStatus.FINISHED,
            today.atStartOfDay()
        )
        return sessions.mapNotNull { session ->
            userRepository.findById(session.userId).orElse(null)?.let { user ->
                LeaderboardEntry(username = user.username, score = session.score)
            }
        }
    }

    fun getWeeklyLeaderboard(): List<LeaderboardEntry> {
        return emptyList()
    }

    fun getGlobalLeaderboard(): List<LeaderboardEntry> {
        val sessions = gameSessionRepository.findTop10ByStatusOrderByScoreDesc(GameStatus.FINISHED)
        return sessions.mapNotNull { session ->
            userRepository.findById(session.userId).orElse(null)?.let { user ->
                LeaderboardEntry(username = user.username, score = session.score)
            }
        }
    }
}
