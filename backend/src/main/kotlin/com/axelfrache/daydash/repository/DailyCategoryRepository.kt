package com.axelfrache.daydash.repository

import com.axelfrache.daydash.entity.DailyCategory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface DailyCategoryRepository : JpaRepository<DailyCategory, LocalDate>
