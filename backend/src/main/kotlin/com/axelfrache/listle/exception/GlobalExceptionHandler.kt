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
        val body = mapOf("error" to "Not Found", "message" to ex.message)
        return ResponseEntity(body, HttpStatus.NOT_FOUND)
    }

    @ExceptionHandler(GameLogicException::class)
    fun handleGameLogicException(ex: GameLogicException): ResponseEntity<Any> {
        val body = mapOf("error" to "Bad Request", "message" to ex.message)
        return ResponseEntity(body, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(Exception::class)
    fun handleGlobalException(ex: Exception): ResponseEntity<Any> {
        log.error("Unhandled exception: ", ex)
        val body = mapOf("error" to "Internal Server Error", "message" to "An unexpected error occurred: ${ex.message}")
        return ResponseEntity(body, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
