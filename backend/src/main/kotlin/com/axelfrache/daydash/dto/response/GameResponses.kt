package com.axelfrache.listle.dto.response

import com.axelfrache.listle.entity.GameStatus
import java.time.LocalDateTime

data class GameStartResponse(
    val gameId: String,
    val startedAt: LocalDateTime
)

data class SubmissionResponse(
    val valid: Boolean,
    val duplicate: Boolean,
    val scoreDelta: Int,
    val foundCount: Int
)

data class GameFinishResponse(
    val gameId: String,
    val finalScore: Int,
    val foundCount: Int,
    val bestScore: Int,
    val currentStreak: Int,
    val percentile: Int
)

data class GameHistoryItemResponse(
    val gameId: String,
    val categoryId: String,
    val startedAt: LocalDateTime,
    val finishedAt: LocalDateTime?,
    val score: Int,
    val foundCount: Int,
    val status: GameStatus
)

data class GameHistoryResponse(
    val items: List<GameHistoryItemResponse>,
    val page: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int
)
