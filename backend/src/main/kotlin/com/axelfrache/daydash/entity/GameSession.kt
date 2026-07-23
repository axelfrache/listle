package com.axelfrache.listle.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "game_sessions")
class GameSession(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @Column(nullable = false)
    val userId: String,

    @Column(nullable = false)
    val categoryId: String,

    @Column(nullable = false)
    val startedAt: LocalDateTime = LocalDateTime.now(),

    @Column
    var finishedAt: LocalDateTime? = null,

    @Column(nullable = false)
    var score: Int = 0,

    @Column(nullable = false)
    var foundCount: Int = 0,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: GameStatus = GameStatus.ACTIVE
)
