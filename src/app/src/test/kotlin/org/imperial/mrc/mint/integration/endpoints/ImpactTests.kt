package org.imperial.mrc.mint.integration.endpoints

import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity

class ImpactTests: EndpointTests() {
    @Test
    fun `can get impact graph prevalence config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/impact/graph/prevalence/config")
        assertSuccess(responseEntity, "Data")
    }
}