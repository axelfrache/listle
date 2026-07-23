package com.axelfrache.daydash.controller

import com.axelfrache.daydash.dto.request.LoginRequest
import com.axelfrache.daydash.dto.request.RegisterRequest
import com.axelfrache.daydash.dto.response.AuthResponse
import com.axelfrache.daydash.dto.response.UserResponse
import com.axelfrache.daydash.exception.ResourceNotFoundException
import com.axelfrache.daydash.repository.UserRepository
import com.axelfrache.daydash.service.AuthService
import io.swagger.v3.oas.annotations.Parameter
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService,
    private val userRepository: UserRepository,
) {
    @PostMapping("/register")
    fun register(
        @RequestBody request: RegisterRequest,
    ): ResponseEntity<AuthResponse> {
        val response = authService.register(request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/login")
    fun login(
        @RequestBody request: LoginRequest,
    ): ResponseEntity<AuthResponse> {
        val response = authService.login(request)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/me")
    fun getCurrentUser(
        @Parameter(hidden = true) @AuthenticationPrincipal userPrincipal: org.springframework.security.core.userdetails.UserDetails,
    ): ResponseEntity<UserResponse> {
        val user =
            userRepository.findByUsername(userPrincipal.username)
                ?: throw ResourceNotFoundException("Utilisateur introuvable")

        val response =
            UserResponse(
                id = user.id ?: "",
                username = user.username,
                email = user.email,
                role = user.role,
            )
        return ResponseEntity.ok(response)
    }
}
