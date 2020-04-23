package org.imperial.mrc.mint.integration.endpoints

import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.boot.test.web.client.postForEntity

class ImpactTests: EndpointTests() {
    @Test
    fun `can get impact graph prevalence config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/impact/graph/prevalence/config")
        assertSuccess(responseEntity, "Graph")
    }

    @Test
    fun `can get impact graph prevalence data`() {
        val responseEntity = testRestTemplate.postForEntity<String>("/impact/graph/prevalence/data",
                mapOf<String, Any>())
        assertSuccess(responseEntity, "Data")
    }
}