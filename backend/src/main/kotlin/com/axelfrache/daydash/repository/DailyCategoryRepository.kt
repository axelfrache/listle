package com.axelfrache.listle.repository

import com.axelfrache.listle.entity.DailyCategory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface DailyCategoryRepository : JpaRepository<DailyCategory, LocalDate>
