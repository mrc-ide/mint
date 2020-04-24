package org.imperial.mrc.mint.controllers

import org.imperial.mrc.mint.APIClient
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/baseline")
class BaselineController(private val apiClient: APIClient) {

    @GetMapping("/options")
    @ResponseBody
    fun baselineOptions(): ResponseEntity<String> {
        return apiClient.getBaselineOptions()
    }
}