package com.axelfrache.listle.service

import com.axelfrache.listle.dto.request.WordSubmissionRequest
import com.axelfrache.listle.dto.response.GameFinishResponse
import com.axelfrache.listle.dto.response.GameHistoryItemResponse
import com.axelfrache.listle.dto.response.GameHistoryResponse
import com.axelfrache.listle.dto.response.GameStartResponse
import com.axelfrache.listle.dto.response.SubmissionResponse
import com.axelfrache.listle.entity.GameSession
import com.axelfrache.listle.entity.GameStatus
import com.axelfrache.listle.entity.GameSubmission
import com.axelfrache.listle.exception.GameLogicException
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.CategoryWordRepository
import com.axelfrache.listle.repository.DailyCategoryRepository
import com.axelfrache.listle.repository.GameSessionRepository
import com.axelfrache.listle.repository.GameSubmissionRepository
import com.axelfrache.listle.util.WordNormalizer
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class GameService(
    private val gameSessionRepository: GameSessionRepository,
    private val gameSubmissionRepository: GameSubmissionRepository,
    private val dailyCategoryRepository: DailyCategoryRepository,
    private val categoryWordRepository: CategoryWordRepository
) {
    fun getHistory(userId: String, page: Int, size: Int): GameHistoryResponse {
        val pageable = PageRequest.of(page, size)
        val sessionsPage = gameSessionRepository.findByUserIdOrderByStartedAtDesc(userId, pageable)
        val items = sessionsPage.content.map { session ->
            GameHistoryItemResponse(
                gameId = session.id!!,
                categoryId = session.categoryId,
                startedAt = session.startedAt,
                finishedAt = session.finishedAt,
                score = session.score,
                foundCount = session.foundCount,
                status = session.status
            )
        }

        return GameHistoryResponse(
            items = items,
            page = sessionsPage.number,
            size = sessionsPage.size,
            totalElements = sessionsPage.totalElements,
            totalPages = sessionsPage.totalPages
        )
    }

    @Transactional
    fun startGame(userId: String): GameStartResponse {
        val today = LocalDate.now()
        val dailyCategory = dailyCategoryRepository.findById(today)
            .orElseThrow { ResourceNotFoundException("No daily category set for today") }

        val session = GameSession(
            userId = userId,
            categoryId = dailyCategory.categoryId
        )
        val savedSession = gameSessionRepository.save(session)
        
        return GameStartResponse(
            gameId = savedSession.id!!,
            startedAt = savedSession.startedAt
        )
    }

    @Transactional
    fun submitWord(userId: String, gameId: String, request: WordSubmissionRequest): SubmissionResponse {
        val session = gameSessionRepository.findById(gameId)
            .orElseThrow { ResourceNotFoundException("Game session not found") }

        if (session.userId != userId) {
            throw GameLogicException("Cannot submit to another user's game")
        }
        if (session.status != GameStatus.ACTIVE) {
            throw GameLogicException("Game is no longer active")
        }
        if (LocalDateTime.now().isAfter(session.startedAt.plusSeconds(60))) {
            finishGameInternal(session)
            throw GameLogicException("Game time has expired")
        }

        val normalized = WordNormalizer.normalize(request.word)
        val isValid = categoryWordRepository.existsByCategoryIdAndNormalizedLabel(session.categoryId, normalized)
        var duplicate = false
        var scoreDelta = 0

        if (isValid) {
            duplicate = gameSubmissionRepository.existsByGameSessionIdAndNormalizedValue(session.id!!, normalized)
            if (!duplicate) {
                scoreDelta = 1
                session.score += scoreDelta
                session.foundCount += 1
                gameSessionRepository.save(session)
            }
        }

        val submission = GameSubmission(
            gameSessionId = session.id!!,
            submittedValue = request.word,
            normalizedValue = normalized,
            isValid = isValid
        )
        gameSubmissionRepository.save(submission)

        return SubmissionResponse(
            valid = isValid,
            duplicate = duplicate,
            scoreDelta = scoreDelta,
            foundCount = session.foundCount
        )
    }

    @Transactional
    fun finishGame(userId: String, gameId: String): GameFinishResponse {
        val session = gameSessionRepository.findById(gameId)
            .orElseThrow { ResourceNotFoundException("Game session not found") }

        if (session.userId != userId) {
            throw GameLogicException("Cannot finish another user's game")
        }

        if (session.status == GameStatus.ACTIVE) {
            finishGameInternal(session)
        }

        return GameFinishResponse(
            gameId = session.id!!,
            finalScore = session.score,
            foundCount = session.foundCount
        )
    }

    private fun finishGameInternal(session: GameSession) {
        session.status = GameStatus.FINISHED
        session.finishedAt = LocalDateTime.now()
        gameSessionRepository.save(session)
    }
}
