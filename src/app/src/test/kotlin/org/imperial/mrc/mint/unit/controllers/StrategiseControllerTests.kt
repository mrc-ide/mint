package org.imperial.mrc.mint.unit.controllers;

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test;
import org.imperial.mrc.mint.APIClient
import org.imperial.mrc.mint.controllers.ImpactController
import org.imperial.mrc.mint.controllers.StrategiseController
import org.springframework.http.ResponseEntity

class StrategiseControllerTests {

    private val mockResponse = mock<ResponseEntity<String>>()
    private val options = mapOf("option" to "value")

    @Test
    fun `gets strategies from the api`()
    {
        val mockAPI = mock<APIClient>{
            on { getStrategies(options) } doReturn mockResponse
        }

        val sut = StrategiseController(mockAPI)
        assertThat(sut.strategise(options)).isSameAs(mockResponse)
    }

}
