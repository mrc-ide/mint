package org.imperial.mrc.mint.controllers

import org.springframework.http.ResponseEntity
import org.imperial.mrc.mint.APIClient
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/cost")
class CostController(private val apiClient: APIClient) {
    @GetMapping("/graph/cases-averted/config")
    @ResponseBody
    fun graphCasesAvertedConfig(): ResponseEntity<String> {
        return apiClient.getCostCasesAvertedGraphConfig()
    }

    @GetMapping("/graph/efficacy/config")
    @ResponseBody
    fun graphEfficacyConfig(): ResponseEntity<String> {
        return apiClient.getCostEfficacyGraphConfig()
    }

    @PostMapping("/graph/data")
    @ResponseBody
    fun graphData(@RequestBody dataOptions: Map<String, Any>): ResponseEntity<String> {
        return apiClient.getCostGraphData(dataOptions)
    }
}