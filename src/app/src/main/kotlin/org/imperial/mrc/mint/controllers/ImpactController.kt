package org.imperial.mrc.mint.controllers

import org.imperial.mrc.mint.APIClient
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/impact")
class ImpactController(private val apiClient: APIClient){

    @GetMapping("/graph/prevalence/config")
    @ResponseBody
    fun graphPrevalenceConfig(): ResponseEntity<String> {
        return apiClient.getImpactGraphPrevalenceConfig()
    }

    @PostMapping("/graph/prevalence/data")
    @ResponseBody
    fun graphPrevalenceData(@RequestBody dataOptions: Map<String, Any>): ResponseEntity<String> {
        return apiClient.getImpactGraphPrevalenceData(dataOptions)
    }

    @GetMapping("/table/config")
    @ResponseBody
    fun tableConfig(): ResponseEntity<String> {
        return apiClient.getImpactTableConfig()
    }
}
