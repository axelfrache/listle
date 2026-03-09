package com.axelfrache.listle.security

import com.axelfrache.listle.repository.UserRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(private val userRepository: UserRepository) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User Not Found with username: $username")

        val authorities = listOf(SimpleGrantedAuthority(user.role))

        return org.springframework.security.core.userdetails.User(
            user.username,
            user.passwordHash,
            authorities
        )
    }
}
