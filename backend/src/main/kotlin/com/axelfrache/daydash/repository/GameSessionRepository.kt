package com.axelfrache.listle.repository

import com.axelfrache.listle.entity.GameSession
import com.axelfrache.listle.entity.GameStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface GameSessionRepository : JpaRepository<GameSession, String> {
    fun findByUserId(userId: String): List<GameSession>
    fun findByUserIdAndStatus(userId: String, status: GameStatus): List<GameSession>
    fun findByUserIdOrderByStartedAtDesc(userId: String, pageable: Pageable): Page<GameSession>
    fun countByUserIdAndStatus(userId: String, status: GameStatus): Long
    fun findTopByUserIdAndStatusOrderByScoreDesc(userId: String, status: GameStatus): GameSession?

    @Query("SELECT AVG(g.score) FROM GameSession g WHERE g.userId = :userId AND g.status = :status")
    fun getAverageScoreByUserIdAndStatus(
        @Param("userId") userId: String,
        @Param("status") status: GameStatus
    ): Double?

    fun findTop10ByCategoryIdAndStatusOrderByScoreDesc(categoryId: String, status: GameStatus): List<GameSession>
    fun findTop10ByStatusOrderByScoreDesc(status: GameStatus): List<GameSession>
    fun findByStatus(status: GameStatus): List<GameSession>
    fun findByStatusAndStartedAtAfter(status: GameStatus, since: LocalDateTime): List<GameSession>

    @Query("SELECT g FROM GameSession g WHERE g.categoryId = :categoryId AND g.status = :status AND g.startedAt >= :since ORDER BY g.score DESC LIMIT 10")
    fun findTop10ByCategoryIdAndStatusAndStartedAtAfterOrderByScoreDesc(
        @Param("categoryId") categoryId: String,
        @Param("status") status: GameStatus,
        @Param("since") since: LocalDateTime
    ): List<GameSession>
}
