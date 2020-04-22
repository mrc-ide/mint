package org.imperial.mrc.mint

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.fuel.core.Request
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component

interface APIClient {
    fun getImpactGraphPrevalenceConfig(): ResponseEntity<String>
    fun getImpactGraphPrevalenceData(dataOptions: Map<String, Any>): ResponseEntity<String>
}

@Component
class MintrAPIClient(
        appProperties: AppProperties,
        private val objectMapper: ObjectMapper) : APIClient {

    private val baseUrl = appProperties.apiUrl

    override fun getImpactGraphPrevalenceConfig(): ResponseEntity<String> {
        return get("graph/prevalence/config")
    }

    override fun getImpactGraphPrevalenceData(dataOptions: Map<String, Any>): ResponseEntity<String>
    {
        val json = objectMapper.writeValueAsString(dataOptions)
        return postJson("graph/prevalence/data", json)
    }

    fun get(url: String): ResponseEntity<String> {

        return "$baseUrl/$url".httpGet()
                .addTimeouts()
                .response()
                .second
                .asResponseEntity()
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