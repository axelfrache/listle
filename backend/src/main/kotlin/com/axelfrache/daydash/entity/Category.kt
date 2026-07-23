package com.axelfrache.daydash.entity

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
    val isActive: Boolean = true,
    @Column(name = "source_type")
    val sourceType: String? = null,
    @Column(name = "source_ref")
    val sourceRef: String? = null,
    @Column(name = "source_min_sitelinks")
    val sourceMinSitelinks: Int? = null,
)
