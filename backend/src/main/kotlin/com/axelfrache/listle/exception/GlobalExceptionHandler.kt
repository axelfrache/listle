package com.axelfrache.listle.exception

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleResourceNotFoundException(ex: ResourceNotFoundException): ResponseEntity<Any> {
        val body = mapOf("error" to "Introuvable", "message" to ex.message)
        return ResponseEntity(body, HttpStatus.NOT_FOUND)
    }

    @ExceptionHandler(GameLogicException::class)
    fun handleGameLogicException(ex: GameLogicException): ResponseEntity<Any> {
        val body = mapOf("error" to "Requête invalide", "message" to ex.message)
        return ResponseEntity(body, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(Exception::class)
    fun handleGlobalException(ex: Exception): ResponseEntity<Any> {
        log.error("Exception non gérée: ", ex)
        val body = mapOf("error" to "Erreur interne du serveur", "message" to "Une erreur inattendue est survenue: ${ex.message}")
        return ResponseEntity(body, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
