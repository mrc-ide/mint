package org.imperial.mrc.mint.integration.endpoints

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity

class HomeTests: EndpointTests() {

    @Test
    fun `can get index page for valid vue routes`() {
        var responseEntity = testRestTemplate.getForEntity<String>("/")
        assertThat(responseEntity.statusCodeValue).isEqualTo(200)

        responseEntity = testRestTemplate.getForEntity("/projects/p1/regions/r1")
        assertThat(responseEntity.statusCodeValue).isEqualTo(200)
    }
}
