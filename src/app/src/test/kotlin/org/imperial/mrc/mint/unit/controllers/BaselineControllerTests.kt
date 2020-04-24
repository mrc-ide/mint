package org.imperial.mrc.mint.unit.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.mint.APIClient
import org.imperial.mrc.mint.controllers.BaselineController
import org.junit.jupiter.api.Test
import org.springframework.http.ResponseEntity

class BaselineControllerTests {
    @Test
    fun `gets graph prevalence config from the api`() {
       val mockResponse = mock<ResponseEntity<String>>()
        val mockAPI = mock<APIClient> {
            on { getBaselineOptions() } doReturn mockResponse
        }

        val sut = BaselineController(mockAPI)
        assertThat(sut.baselineOptions()).isSameAs(mockResponse)
    }
}