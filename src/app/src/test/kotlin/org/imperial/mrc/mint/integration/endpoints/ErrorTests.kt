package org.imperial.mrc.mint.integration.endpoints

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity

class ErrorTests: EndpointTests() {

    @Test
    fun `can get 404 page for missing routes`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/nonsense")
        assertThat(responseEntity.statusCodeValue).isEqualTo(404)
        assertThat(responseEntity.body.toString().contains("Page Not Found"))
    }
}
