package com.axelfrache.daydash.repository

import com.axelfrache.daydash.entity.GameSubmission
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface GameSubmissionRepository : JpaRepository<GameSubmission, String> {
    fun existsByGameSessionIdAndNormalizedValue(
        gameSessionId: String,
        normalizedValue: String,
    ): Boolean
}
