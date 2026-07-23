package com.axelfrache.listle.controller

import com.axelfrache.listle.dto.request.WordSubmissionRequest
import com.axelfrache.listle.dto.response.GameFinishResponse
import com.axelfrache.listle.dto.response.GameHistoryResponse
import com.axelfrache.listle.dto.response.GameStartResponse
import com.axelfrache.listle.dto.response.SubmissionResponse
import com.axelfrache.listle.exception.ResourceNotFoundException
import com.axelfrache.listle.repository.UserRepository
import com.axelfrache.listle.service.GameService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/games")
class GameController(
    private val gameService: GameService,
    private val userRepository: UserRepository
) {

    private fun getUserId(principal: UserDetails): String {
        val user = userRepository.findByUsername(principal.username)
            ?: throw ResourceNotFoundException("Utilisateur introuvable")
        return user.id!!
    }

    @PostMapping
    fun startGame(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<GameStartResponse> {
        val userId = getUserId(userDetails)
        val response = gameService.startGame(userId)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/history")
    fun getHistory(
        @AuthenticationPrincipal userDetails: UserDetails,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<GameHistoryResponse> {
        val userId = getUserId(userDetails)
        val response = gameService.getHistory(userId, page, size)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/{gameId}/submit")
    fun submitWord(
        @PathVariable gameId: String,
        @RequestBody request: WordSubmissionRequest,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<SubmissionResponse> {
        val userId = getUserId(userDetails)
        val response = gameService.submitWord(userId, gameId, request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/{gameId}/finish")
    fun finishGame(
        @PathVariable gameId: String,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<GameFinishResponse> {
        val userId = getUserId(userDetails)
        val response = gameService.finishGame(userId, gameId)
        return ResponseEntity.ok(response)
    }
}
