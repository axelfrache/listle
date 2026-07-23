package com.axelfrache.daydash

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource

@SpringBootTest
@TestPropertySource(properties = ["daydash.wordsync.enabled=false"])
class DaydashApplicationTests {
    @Test
    fun contextLoads() {
    }
}
