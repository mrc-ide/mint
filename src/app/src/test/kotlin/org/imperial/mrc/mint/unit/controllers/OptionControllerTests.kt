package org.imperial.mrc.mint.unit.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.mint.APIClient
import org.imperial.mrc.mint.controllers.OptionsController
import org.junit.jupiter.api.Test
import org.springframework.http.ResponseEntity

class OptionControllerTests {
    @Test
    fun `gets baseline options from the api`() {
       val mockResponse = mock<ResponseEntity<String>>()
        val mockAPI = mock<APIClient> {
            on { getBaselineOptions() } doReturn mockResponse
        }

        val sut = OptionsController(mockAPI)
        assertThat(sut.baselineOptions()).isSameAs(mockResponse)
    }

    @Test
    fun `gets intervention options from the api`() {
        val mockResponse = mock<ResponseEntity<String>>()
        val mockAPI = mock<APIClient> {
            on { getInterventionOptions() } doReturn mockResponse
        }

        val sut = OptionsController(mockAPI)
        assertThat(sut.interventionOptions()).isSameAs(mockResponse)
    }
}