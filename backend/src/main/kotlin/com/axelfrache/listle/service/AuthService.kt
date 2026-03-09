package com.axelfrache.listle.service

import com.axelfrache.listle.dto.request.LoginRequest
import com.axelfrache.listle.dto.request.RegisterRequest
import com.axelfrache.listle.dto.response.AuthResponse
import com.axelfrache.listle.entity.User
import com.axelfrache.listle.exception.GameLogicException
import com.axelfrache.listle.repository.UserRepository
import com.axelfrache.listle.security.JwtTokenProvider
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
    private val tokenProvider: JwtTokenProvider
) {

    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByUsername(request.username)) {
            throw GameLogicException("Username is already taken!")
        }
        if (userRepository.existsByEmail(request.email)) {
            throw GameLogicException("Email is already in use!")
        }

        val user = User(
            username = request.username,
            email = request.email,
            passwordHash = passwordEncoder.encode(request.password)
        )
        userRepository.save(user)

        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.username, request.password)
        )
        val token = tokenProvider.generateToken(authentication)
        return AuthResponse(token)
    }

    fun login(request: LoginRequest): AuthResponse {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.username, request.password)
        )
        val token = tokenProvider.generateToken(authentication)
        return AuthResponse(token)
    }
}
