package org.imperial.mrc.mint.controllers

import org.imperial.mrc.mint.APIClient
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/emulator")
class EmulatorController(private val apiClient: APIClient) {

    @GetMapping("/config")
    fun emulatorConfig(): ResponseEntity<String> {
        return apiClient.getEmulatorConfig()
    }

    @GetMapping("/model/{filename:.+}")
    fun emulatorModel(@PathVariable filename: String): ResponseEntity<out Any> {
        return apiClient.getEmulatorModel(filename)
    }
}
