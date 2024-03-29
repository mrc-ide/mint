package org.imperial.mrc.mint.integration.endpoints

import org.imperial.mrc.mint.helpers.Settings
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.boot.test.web.client.postForEntity

class ImpactTests: EndpointTests() {
    
    @Test
    fun `can get impact graph prevalence config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/impact/graph/prevalence/config")
        assertSuccessfulValidJson(responseEntity, "Graph")
    }

    @Test
    fun `can get impact cases config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/impact/graph/cases-averted/config")
        assertSuccessfulValidJson(responseEntity, "Graph")
    }

    @Test
    fun `can get impact graph prevalence data`() {
        val responseEntity = testRestTemplate.postForEntity<String>("/impact/graph/prevalence/data",
                Settings.Baseline)
        assertSuccessfulValidJson(responseEntity, "Data")
    }

    @Test
    fun `can get impact table config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/impact/table/config")
        assertSuccessfulValidJson(responseEntity, "TableDefinition")
    }

    @Test
    fun `can get impact docs`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/impact/docs")
        assertSuccessfulValidJson(responseEntity, "Docs")
    }
}
