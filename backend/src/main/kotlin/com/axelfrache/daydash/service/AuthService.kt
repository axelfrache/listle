package com.axelfrache.daydash.service

import com.axelfrache.daydash.dto.request.LoginRequest
import com.axelfrache.daydash.dto.request.RegisterRequest
import com.axelfrache.daydash.dto.response.AuthResponse
import com.axelfrache.daydash.entity.User
import com.axelfrache.daydash.exception.GameLogicException
import com.axelfrache.daydash.repository.UserRepository
import com.axelfrache.daydash.security.JwtTokenProvider
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val tokenProvider: JwtTokenProvider,
) {
    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByUsername(request.username)) {
            throw GameLogicException("Ce nom d'utilisateur est déjà pris.")
        }
        if (userRepository.existsByEmail(request.email)) {
            throw GameLogicException("Cet e-mail est déjà utilisé.")
        }

        val user =
            User(
                username = request.username,
                email = request.email,
                passwordHash = passwordEncoder.encode(request.password),
            )
        userRepository.save(user)

        val authentication =
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(request.username, request.password),
            )
        val token = tokenProvider.generateToken(authentication)
        return AuthResponse(token)
    }

    fun login(request: LoginRequest): AuthResponse {
        val authentication =
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(request.username, request.password),
            )
        val token = tokenProvider.generateToken(authentication)
        return AuthResponse(token)
    }
}
