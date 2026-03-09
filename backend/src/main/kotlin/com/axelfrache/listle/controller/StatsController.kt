package com.axelfrache.listle.controller

import com.axelfrache.listle.dto.response.StatsOverviewResponse
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.UserRepository
import com.axelfrache.listle.service.StatsService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/stats")
class StatsController(
    private val statsService: StatsService,
    private val userRepository: UserRepository
) {

    @GetMapping("/me/overview")
    fun getMyStatsOverview(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<StatsOverviewResponse> {
        val user = userRepository.findByUsername(userDetails.username)
            ?: throw ResourceNotFoundException("User not found")
            
        return ResponseEntity.ok(statsService.getOverview(user.id!!))
    }
}
