package org.imperial.mrc.mint.controllers

import org.imperial.mrc.mint.APIClient
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/")
class StrategiseController(private val apiClient: APIClient) {

    @PostMapping("/strategise")
    @ResponseBody
    fun strategise(@RequestBody options: Map<String, Any>): ResponseEntity<String> {
        return apiClient.getStrategies(options)
    }

}
