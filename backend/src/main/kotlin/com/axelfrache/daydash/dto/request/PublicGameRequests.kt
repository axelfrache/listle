package com.axelfrache.daydash.dto.request

data class PublicWordEvaluationRequest(
    val categoryId: String,
    val existingWords: List<String>,
    val rawWord: String,
)

data class PublicFinalizeGameRequest(
    val words: List<String>,
)
