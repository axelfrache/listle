package com.axelfrache.listle

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class ListleApplication

fun main(args: Array<String>) {
    runApplication<ListleApplication>(*args)
}
