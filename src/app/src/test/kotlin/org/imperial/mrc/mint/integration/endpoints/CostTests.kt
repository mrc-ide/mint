package org.imperial.mrc.mint.integration.endpoints

import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity

class CostTests: EndpointTests() {

    @Test
    fun `can get cost graph cases averted config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/cost/graph/cases-averted/config")
        assertSuccessfulValidJson(responseEntity, "Graph")
    }

    @Test
    fun `can get cost graph per case config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/cost/graph/per-case/config")
        assertSuccessfulValidJson(responseEntity, "Graph")
    }

    @Test
    fun `can get cost table config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/cost/table/config")
        assertSuccessfulValidJson(responseEntity, "TableDefinition")
    }

    @Test
    fun `can get cost docs`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/cost/docs")
        assertSuccessfulValidJson(responseEntity, "Docs")
    }
}
