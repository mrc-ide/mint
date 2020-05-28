package org.imperial.mrc.mint

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.fuel.core.Request
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component

interface APIClient {
    fun getBaselineOptions(): ResponseEntity<String>
    fun getInterventionOptions(): ResponseEntity<String>
    fun getImpactGraphPrevalenceConfig(): ResponseEntity<String>
    fun getImpactGraphPrevalenceData(dataOptions: Map<String, Any>): ResponseEntity<String>
    fun getImpactTableConfig(): ResponseEntity<String>
    fun getImpactTableData(dataOptions: Map<String, Any>): ResponseEntity<String>
    fun getCostCasesAvertedGraphConfig(): ResponseEntity<String>
    fun getCostGraphData(dataOptions: Map<String, Any>): ResponseEntity<String>
}

@Component
class MintrAPIClient(
        appProperties: AppProperties,
        private val objectMapper: ObjectMapper) : APIClient {

    private val baseUrl = appProperties.apiUrl

    override fun getBaselineOptions(): ResponseEntity<String> {
        return get("baseline/options")
    }

    override fun getInterventionOptions(): ResponseEntity<String> {
        return get("intervention/options")
    }

    override fun getImpactGraphPrevalenceConfig(): ResponseEntity<String> {
        return get("graph/prevalence/config")
    }

    override fun getImpactGraphPrevalenceData(dataOptions: Map<String, Any>): ResponseEntity<String>
    {
        return postJson("graph/prevalence/data", optionsJson(dataOptions))
    }

    override fun getImpactTableConfig(): ResponseEntity<String> {
        return get("table/impact/config")
    }

    override fun getImpactTableData(dataOptions: Map<String, Any>): ResponseEntity<String> {
        return postJson("table/impact/data", optionsJson(dataOptions))
    }

    override fun getCostCasesAvertedGraphConfig(): ResponseEntity<String> {
        return get("graph/cost/cases-averted/config")
    }

    override fun getCostGraphData(dataOptions: Map<String, Any>): ResponseEntity<String> {
        return postJson("graph/cost/data", optionsJson(dataOptions))
    }

    fun get(url: String): ResponseEntity<String> {

        return "$baseUrl/$url".httpGet()
                .addTimeouts()
                .response()
                .second
                .asResponseEntity()
    }

    private fun optionsJson(dataOptions: Map<String, Any>): String
    {
        return  objectMapper.writeValueAsString(dataOptions)
    }

    private fun postJson(url: String, json: String): ResponseEntity<String> {
        return "$baseUrl/$url".httpPost()
                .addTimeouts()
                .header("Content-Type" to "application/json")
                .body(json)
                .response()
                .second
                .asResponseEntity()
    }

    private fun Request.addTimeouts(): Request {
        return this.timeout(60000)
                .timeoutRead(60000)
    }
}