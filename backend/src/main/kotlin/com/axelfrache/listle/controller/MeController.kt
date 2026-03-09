package com.axelfrache.listle.controller

import com.axelfrache.listle.dto.response.MeProfileResponse
import com.axelfrache.listle.dto.response.MeStatsResponse
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.UserRepository
import com.axelfrache.listle.service.MeService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/me")
class MeController(
    private val meService: MeService,
    private val userRepository: UserRepository
) {
    @GetMapping("/stats")
    fun getStats(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<MeStatsResponse> {
        val user = userRepository.findByUsername(userDetails.username)
            ?: throw ResourceNotFoundException("Utilisateur introuvable")
        return ResponseEntity.ok(meService.getStats(user.id!!))
    }

    @GetMapping("/profile")
    fun getProfile(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<MeProfileResponse> {
        val user = userRepository.findByUsername(userDetails.username)
            ?: throw ResourceNotFoundException("Utilisateur introuvable")
        return ResponseEntity.ok(meService.getProfile(user))
    }
}
