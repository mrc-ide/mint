package org.imperial.mrc.mint.integration.endpoints

import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity

class OptionTests: EndpointTests() {

    @Test
    fun `can get baseline options`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/baseline/options")
        assertSuccess(responseEntity, "DynamicFormOptions")
    }

    @Test
    fun `can get intervention options`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/intervention/options")
        assertSuccess(responseEntity, "DynamicFormOptions")
    }
}
