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

    @GetMapping("/table/config")
    @ResponseBody
    fun tableConfig(): ResponseEntity<String> {
        return apiClient.getCostTableConfig()
    }

    @GetMapping("/docs")
    @ResponseBody
    fun docs(): ResponseEntity<String> {
        return apiClient.getCostDocs()
    }

}
