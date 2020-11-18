package org.imperial.mrc.mint.integration.endpoints

import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.imperial.mrc.mint.APIClient
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.web.client.getForEntity


class ErrorTests: EndpointTests() {

    @Test
    fun `can get 404 page for missing routes`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/nonsense")
        assertThat(responseEntity.statusCodeValue).isEqualTo(404)
        assertThat(responseEntity.body.toString().contains("Page Not Found")).isTrue()
    }

    @MockBean
    private lateinit var mockApiClient: APIClient

    @Test
    fun `can get 500 page for server errors`() {
        Mockito.`when`(mockApiClient.getBaselineOptions()).thenThrow(Exception())
        val responseEntity = testRestTemplate.getForEntity<String>("/baseline/options")
        assertThat(responseEntity.statusCodeValue).isEqualTo(500)
        assertThat(responseEntity.body.toString().contains("Something Went Wrong")).isTrue()
    }
}
