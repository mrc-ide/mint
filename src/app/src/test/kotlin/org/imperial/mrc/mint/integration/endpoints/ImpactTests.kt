package org.imperial.mrc.mint.integration.endpoints

import org.imperial.mrc.mint.helpers.Settings
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
                Settings.Baseline)
        assertSuccess(responseEntity, "Data")
    }

    @Test
    fun `can get impact table config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/impact/table/config")
        assertSuccess(responseEntity, "TableDefinition")
    }

    @Test
    fun `can get impact table data`() {
        val responseEntity = testRestTemplate.postForEntity<String>("/impact/table/data",
                Settings.Baseline)
        assertSuccess(responseEntity, "Data")
    }
}
