package com.axelfrache.listle.entity

import jakarta.persistence.*

@Entity
@Table(name = "category_words")
class CategoryWord(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @Column(nullable = false)
    val categoryId: String,

    @Column(nullable = false)
    val label: String,

    @Column(nullable = false)
    val normalizedLabel: String
)
