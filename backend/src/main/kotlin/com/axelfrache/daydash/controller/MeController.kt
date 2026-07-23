package com.axelfrache.listle.controller

import com.axelfrache.listle.dto.request.UpdatePasswordRequest
import com.axelfrache.listle.dto.request.UpdateUsernameRequest
import com.axelfrache.listle.dto.response.AuthResponse
import com.axelfrache.listle.dto.response.MeProfileResponse
import com.axelfrache.listle.dto.response.MeStatsResponse
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.UserRepository
import com.axelfrache.listle.service.AccountService
import com.axelfrache.listle.service.MeService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/me")
class MeController(
    private val meService: MeService,
    private val accountService: AccountService,
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

    @PutMapping("/username")
    fun updateUsername(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestBody request: UpdateUsernameRequest
    ): ResponseEntity<AuthResponse> {
        val user = userRepository.findByUsername(userDetails.username)
            ?: throw ResourceNotFoundException("Utilisateur introuvable")
        return ResponseEntity.ok(accountService.updateUsername(user, request))
    }

    @PutMapping("/password")
    fun updatePassword(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestBody request: UpdatePasswordRequest
    ): ResponseEntity<Void> {
        val user = userRepository.findByUsername(userDetails.username)
            ?: throw ResourceNotFoundException("Utilisateur introuvable")
        accountService.updatePassword(user, request)
        return ResponseEntity.noContent().build()
    }
}
