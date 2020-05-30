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

    @PostMapping("/graph/data")
    @ResponseBody
    fun graphData(@RequestBody dataOptions: Map<String, Any>): ResponseEntity<String> {
        return apiClient.getCostGraphData(dataOptions)
    }

    @GetMapping("/table/config")
    @ResponseBody
    fun tableConfig(): ResponseEntity<String> {
        return apiClient.getCostTableConfig()
    }

    @PostMapping("/table/data")
    @ResponseBody
    fun tableData(@RequestBody dataOptions: Map<String, Any>): ResponseEntity<String> {
        return apiClient.getCostTableData(dataOptions)
    }
}