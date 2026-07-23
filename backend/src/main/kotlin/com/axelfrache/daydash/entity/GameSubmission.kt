package com.axelfrache.listle.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "game_submissions")
class GameSubmission(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @Column(nullable = false)
    val gameSessionId: String,

    @Column(nullable = false)
    val submittedValue: String,

    @Column(nullable = false)
    val normalizedValue: String,

    @Column(nullable = false)
    val isValid: Boolean,

    @Column(nullable = false)
    val submittedAt: LocalDateTime = LocalDateTime.now()
)
