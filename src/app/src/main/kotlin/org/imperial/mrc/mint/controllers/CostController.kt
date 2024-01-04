package org.imperial.mrc.mint.controllers

import org.imperial.mrc.mint.APIClient
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/cost")
class CostController(private val apiClient: APIClient) {
    @GetMapping("/graph/cases-averted/config")
    fun graphCasesAvertedConfig(): ResponseEntity<String> {
        return apiClient.getCostCasesAvertedGraphConfig()
    }

    @GetMapping("/graph/per-case/config")
    fun graphCostPerCaseConfig(): ResponseEntity<String> {
        return apiClient.getCostPerCaseGraphConfig()
    }

    @GetMapping("/table/config")
    fun tableConfig(): ResponseEntity<String> {
        return apiClient.getCostTableConfig()
    }

    @GetMapping("/docs")
    fun docs(): ResponseEntity<String> {
        return apiClient.getCostDocs()
    }
}
