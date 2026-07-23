package com.axelfrache.daydash.service

import com.axelfrache.daydash.dto.response.LeaderboardEntry
import com.axelfrache.daydash.entity.GameStatus
import com.axelfrache.daydash.repository.GameSessionRepository
import com.axelfrache.daydash.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class LeaderboardService(
    private val gameSessionRepository: GameSessionRepository,
    private val dailyCategoryResolverService: DailyCategoryResolverService,
    private val userRepository: UserRepository,
) {
    fun getDailyLeaderboard(): List<LeaderboardEntry> {
        val dailyCategory = dailyCategoryResolverService.getOrCreateDailyCategory()
        val today = dailyCategory.date

        val sessions =
            gameSessionRepository.findTop10ByCategoryIdAndStatusAndStartedAtAfterOrderByScoreDesc(
                dailyCategory.categoryId,
                GameStatus.FINISHED,
                today.atStartOfDay(),
            )
        return sessions.mapNotNull { session ->
            userRepository.findById(session.userId).orElse(null)?.let { user ->
                LeaderboardEntry(username = user.username, score = session.score)
            }
        }
    }

    fun getWeeklyLeaderboard(): List<LeaderboardEntry> = emptyList()

    fun getGlobalLeaderboard(): List<LeaderboardEntry> {
        val sessions = gameSessionRepository.findTop10ByStatusOrderByScoreDesc(GameStatus.FINISHED)
        return sessions.mapNotNull { session ->
            userRepository.findById(session.userId).orElse(null)?.let { user ->
                LeaderboardEntry(username = user.username, score = session.score)
            }
        }
    }
}
