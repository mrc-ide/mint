package org.imperial.mrc.mint.integration

import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.imperial.mrc.mint.ConfiguredAppProperties
import org.imperial.mrc.mint.MintrAPIClient
import org.imperial.mrc.mint.helpers.JSONValidator
import org.junit.jupiter.api.Test

class MintrAPIClientTests {
    @Test
    fun `can get impact graph prevalence config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getImpactGraphPrevalenceConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Graph")
    }

    @Test
    fun `can get impact graph prevalence data`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getImpactGraphPrevalenceData(mapOf())
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Data")
    }
}