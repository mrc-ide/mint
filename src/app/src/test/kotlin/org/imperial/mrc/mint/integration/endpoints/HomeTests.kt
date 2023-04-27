package org.imperial.mrc.mint.integration.endpoints

import org.imperial.mrc.mint.helpers.Settings
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.postForEntity
import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.springframework.boot.test.web.client.getForEntity

class HomeTests : EndpointTests() {

    @Test
    fun `can get table data`() {
        val responseEntity = testRestTemplate.postForEntity<String>("/table/data",
                Settings.Baseline)
        assertSuccessfulValidJson(responseEntity, "Data")
    }

    @Test
    fun `can get index page for valid vue routes`() {
        var responseEntity = testRestTemplate.getForEntity<String>("/")
        assertSuccess(responseEntity)

        responseEntity = testRestTemplate.getForEntity("/projects/p1/regions/r1")
        assertSuccess(responseEntity)

        responseEntity = testRestTemplate.getForEntity<String>("accessibility")
        assertSuccess(responseEntity)

        responseEntity = testRestTemplate.getForEntity<String>("privacy")
        assertSuccess(responseEntity)
    }

    @Test
    fun `can get version`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/version")
        assertSuccessfulValidJson(responseEntity, "Version")
    }
}
