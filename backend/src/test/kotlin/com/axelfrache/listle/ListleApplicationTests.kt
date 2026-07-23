package com.axelfrache.listle

import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource

@SpringBootTest
@TestPropertySource(properties = ["listle.wordsync.enabled=false"])
class ListleApplicationTests {

    @Test
    fun contextLoads() {
    }

}
