package org.imperial.mrc.mint.controllers

import org.imperial.mrc.mint.APIClient
import org.imperial.mrc.mint.AppProperties
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.ui.set
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

@Controller
class HomeController(
    private val apiClient: APIClient,
    private val appProperties: AppProperties
) {

    @GetMapping("/", "/projects/{project}/regions/{region}", "accessibility", "privacy")
    fun index(model: Model): String {
        model["title"] = appProperties.applicationTitle
        return "index"
    }

    @PostMapping("/table/data")
    fun tableData(@RequestBody dataOptions: Map<String, Any>): ResponseEntity<String> {
        return apiClient.getTableData(dataOptions)
    }

    @GetMapping("/version")
    fun version(): ResponseEntity<String> {
        return apiClient.getVersion()
    }
}
