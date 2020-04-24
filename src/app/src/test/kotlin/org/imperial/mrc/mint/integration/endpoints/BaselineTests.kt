package org.imperial.mrc.mint.integration.endpoints

import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity

class BaselineTests: EndpointTests() {
    @Test
    fun `can get baseline options`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/baseline/options")
        assertSuccess(responseEntity, "BaselineOptions")
    }
}