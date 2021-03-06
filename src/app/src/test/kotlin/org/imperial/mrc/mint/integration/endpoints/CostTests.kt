package org.imperial.mrc.mint.integration.endpoints

import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.boot.test.web.client.postForEntity

class CostTests: EndpointTests() {

    @Test
    fun `can get cost graph cases averted config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/cost/graph/cases-averted/config")
        assertSuccess(responseEntity, "Graph")
    }

    @Test
    fun `can get cost graph per case config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/cost/graph/per-case/config")
        assertSuccess(responseEntity, "Graph")
    }

    @Test
    fun `can get cost table config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/cost/table/config")
        assertSuccess(responseEntity, "TableDefinition")
    }

    @Test
    fun `can get cost docs`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/cost/docs")
        assertSuccess(responseEntity, "Docs")
    }
}
