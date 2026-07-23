package com.axelfrache.listle.util

import java.text.Normalizer

object WordNormalizer {
    fun normalize(word: String): String {
        return normalizeBase(word)
            .replace("['\\-]".toRegex(), "")
            .trim()
            .lowercase()
    }

    fun candidates(word: String): List<String> {
        val base = normalize(word)
        val spaced = normalizeBase(word)
            .replace("['’`\\-]".toRegex(), " ")
            .replace("[^a-z0-9\\s]".toRegex(), " ")
            .trim()
            .replace("\\s+".toRegex(), " ")

        val elisionTokens = setOf("d", "l", "j", "m", "t", "s", "c", "n", "qu")
        val linkerTokens = setOf("de", "du", "des")

        val spacedTokens = if (spaced.isBlank()) emptyList() else spaced.split(" ")
        val withoutElisions = spacedTokens.filterNot { it in elisionTokens }.joinToString(" ").trim()
        val withoutLinkers = spacedTokens.filterNot { it in linkerTokens || it in elisionTokens }.joinToString(" ").trim()

        return listOf(base, spaced, withoutElisions, withoutLinkers)
            .map { it.trim().replace("\\s+".toRegex(), " ") }
            .filter { it.isNotBlank() }
            .distinct()
    }

    private fun normalizeBase(word: String): String {
        return Normalizer.normalize(word, Normalizer.Form.NFD)
            .replace("\\p{M}".toRegex(), "")
            .lowercase()
    }
}
