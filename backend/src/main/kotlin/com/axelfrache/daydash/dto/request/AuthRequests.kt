package com.axelfrache.listle.dto.request

data class LoginRequest(
    val username: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val username: String,
    val password: String
)

data class UpdateUsernameRequest(
    val username: String
)

data class UpdatePasswordRequest(
    val currentPassword: String,
    val newPassword: String
)
