package com.axelfrache.listle.dto.response

data class AuthResponse(
    val token: String,
    val tokenType: String = "Bearer"
)

data class UserResponse(
    val id: String,
    val username: String,
    val email: String,
    val role: String
)
