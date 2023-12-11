package org.imperial.mrc.mint.controllers

import org.imperial.mrc.mint.APIClient
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/")
class OptionsController(private val apiClient: APIClient) {

    @GetMapping("/baseline/options")
    @ResponseBody
    fun baselineOptions(): ResponseEntity<String> {
        return apiClient.getBaselineOptions()
    }

    @GetMapping("/intervention/options")
    @ResponseBody
    fun interventionOptions(): ResponseEntity<String> {
        return apiClient.getInterventionOptions()
    }
}
