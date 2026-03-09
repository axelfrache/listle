package com.axelfrache.listle.entity

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "daily_categories")
class DailyCategory(
    @Id
    val date: LocalDate,

    @Column(nullable = false)
    val categoryId: String
)
