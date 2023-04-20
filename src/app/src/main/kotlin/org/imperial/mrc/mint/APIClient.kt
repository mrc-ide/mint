package org.imperial.mrc.mint

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.fuel.core.Request
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import kotlin.jvm.Throws

interface APIClient {
    @Throws(Exception::class)
    fun getBaselineOptions(): ResponseEntity<String>
    fun getInterventionOptions(): ResponseEntity<String>
    fun getImpactGraphPrevalenceConfig(): ResponseEntity<String>
    fun getImpactGraphCasesAvertedConfig(): ResponseEntity<String>
    fun getImpactGraphPrevalenceData(dataOptions: Map<String, Any>): ResponseEntity<String>
    fun getImpactTableConfig(): ResponseEntity<String>
    fun getCostCasesAvertedGraphConfig(): ResponseEntity<String>
    fun getCostPerCaseGraphConfig(): ResponseEntity<String>
    fun getCostTableConfig(): ResponseEntity<String>
    fun getTableData(dataOptions: Map<String, Any>): ResponseEntity<String>
    fun getImpactDocs(): ResponseEntity<String>
    fun getCostDocs(): ResponseEntity<String>
    fun getStrategies(options: Map<String, Any>): ResponseEntity<String>
    fun getVersion(): ResponseEntity<String>
}

@Component
class MintrAPIClient(
        appProperties: AppProperties,
        private val objectMapper: ObjectMapper) : APIClient {

    companion object {
        const val TIMEOUT = 60000
    }

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

    override fun getImpactGraphCasesAvertedConfig(): ResponseEntity<String> {
        return get("graph/impact/cases-averted/config")
    }

    override fun getImpactGraphPrevalenceData(dataOptions: Map<String, Any>): ResponseEntity<String>
    {
        return postJson("graph/prevalence/data", optionsJson(dataOptions))
    }

    override fun getImpactTableConfig(): ResponseEntity<String> {
        return get("table/impact/config")
    }

    override fun getTableData(dataOptions: Map<String, Any>): ResponseEntity<String> {
        return postJson("table/data", optionsJson(dataOptions))
    }

    override fun getCostCasesAvertedGraphConfig(): ResponseEntity<String> {
        return get("graph/cost/cases-averted/config")
    }

    override fun getCostPerCaseGraphConfig(): ResponseEntity<String> {
        return get("graph/cost/per-case/config")
    }

    override fun getCostTableConfig(): ResponseEntity<String> {
        return get("table/cost/config")
    }

    override fun getImpactDocs(): ResponseEntity<String> {
        return get("docs/impact")
    }

    override fun getCostDocs(): ResponseEntity<String> {
        return get("docs/cost")
    }

    override fun getStrategies(options: Map<String, Any>): ResponseEntity<String> {
        return postJson("strategise", objectMapper.writeValueAsString(options))
    }

    override fun getVersion(): ResponseEntity<String> {
        return get("version")
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
        return this.timeout(TIMEOUT)
                .timeoutRead(TIMEOUT)
    }
}
