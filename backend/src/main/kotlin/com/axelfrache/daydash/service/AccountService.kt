package com.axelfrache.daydash.service

import com.axelfrache.daydash.dto.request.UpdatePasswordRequest
import com.axelfrache.daydash.dto.request.UpdateUsernameRequest
import com.axelfrache.daydash.dto.response.AuthResponse
import com.axelfrache.daydash.entity.User
import com.axelfrache.daydash.exception.GameLogicException
import com.axelfrache.daydash.repository.UserRepository
import com.axelfrache.daydash.security.JwtTokenProvider
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AccountService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val tokenProvider: JwtTokenProvider,
) {
    @Transactional
    fun updateUsername(
        user: User,
        request: UpdateUsernameRequest,
    ): AuthResponse {
        val newUsername = request.username.trim()
        if (newUsername.length < 3 || newUsername.length > 20) {
            throw GameLogicException("Le nom d'utilisateur doit contenir entre 3 et 20 caractères.")
        }
        if (!newUsername.matches(USERNAME_PATTERN)) {
            throw GameLogicException("Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.")
        }
        if (newUsername != user.username && userRepository.existsByUsername(newUsername)) {
            throw GameLogicException("Ce nom d'utilisateur est déjà pris.")
        }

        user.username = newUsername
        userRepository.save(user)

        return AuthResponse(tokenProvider.generateTokenForUsername(newUsername))
    }

    @Transactional
    fun updatePassword(
        user: User,
        request: UpdatePasswordRequest,
    ) {
        if (!passwordEncoder.matches(request.currentPassword, user.passwordHash)) {
            throw GameLogicException("Le mot de passe actuel est incorrect.")
        }
        if (request.newPassword.length < 6) {
            throw GameLogicException("Le nouveau mot de passe doit contenir au moins 6 caractères.")
        }

        user.passwordHash = passwordEncoder.encode(request.newPassword)
        userRepository.save(user)
    }

    companion object {
        private val USERNAME_PATTERN = Regex("^[A-Za-z0-9_-]+$")
    }
}
