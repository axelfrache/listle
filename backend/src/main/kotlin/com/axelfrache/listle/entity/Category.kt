package com.axelfrache.listle.entity

import jakarta.persistence.*

@Entity
@Table(name = "categories")
class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @Column(unique = true, nullable = false)
    val slug: String,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false)
    val difficulty: Int = 1,

    @Column(name = "active", nullable = false)
    val isActive: Boolean = true
)
