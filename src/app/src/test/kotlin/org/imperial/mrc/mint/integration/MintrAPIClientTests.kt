package org.imperial.mrc.mint.integration

import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.imperial.mrc.mint.ConfiguredAppProperties
import org.imperial.mrc.mint.MintrAPIClient
import org.junit.jupiter.api.Test

class MintrAPIClientTests {
    @Test
    fun `can get impact graph prevalence config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getImpactGraphPrevalenceConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        val body = result.body
        //JSONValidator().validateError(result.body!!, "VERSION_OUT_OF_DATE")
    }
}