package com.axelfrache.listle.util

import java.text.Normalizer

object WordNormalizer {
    fun normalize(word: String): String {
        return Normalizer.normalize(word, Normalizer.Form.NFD)
            .replace("\\p{M}".toRegex(), "")
            .replace("['\\-]".toRegex(), "")
            .trim()
            .lowercase()
    }
}
