package org.imperial.mrc.mint.integration.endpoints

import org.imperial.mrc.mint.helpers.Settings
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.postForEntity

class HomeTests : EndpointTests() {

    @Test
    fun `can get table data`() {
        val responseEntity = testRestTemplate.postForEntity<String>("/table/data",
                Settings.Baseline)
        assertSuccess(responseEntity, "Data")
    }
}
