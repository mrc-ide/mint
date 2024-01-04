package org.imperial.mrc.mint.controllers

import org.imperial.mrc.mint.APIClient
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/impact")
class ImpactController(private val apiClient: APIClient) {

    @GetMapping("/graph/prevalence/config")
    fun graphPrevalenceConfig(): ResponseEntity<String> {
        return apiClient.getImpactGraphPrevalenceConfig()
    }

    @GetMapping("/graph/cases-averted/config")
    fun graphCasesAvertedConfig(): ResponseEntity<String> {
        return apiClient.getImpactGraphCasesAvertedConfig()
    }

    @PostMapping("/graph/prevalence/data")
    fun graphPrevalenceData(@RequestBody dataOptions: Map<String, Any>): ResponseEntity<String> {
        return apiClient.getImpactGraphPrevalenceData(dataOptions)
    }

    @GetMapping("/table/config")
    fun tableConfig(): ResponseEntity<String> {
        return apiClient.getImpactTableConfig()
    }

    @GetMapping("/docs")
    fun docs(): ResponseEntity<String> {
        return apiClient.getImpactDocs()
    }
}
