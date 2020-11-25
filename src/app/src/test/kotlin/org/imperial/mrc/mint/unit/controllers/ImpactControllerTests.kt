package org.imperial.mrc.mint.unit.controllers;

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test;
import org.imperial.mrc.mint.APIClient
import org.imperial.mrc.mint.controllers.ImpactController
import org.springframework.http.ResponseEntity

class ImpactControllerTests {

    private val mockResponse = mock<ResponseEntity<String>>()
    private val options = mapOf("option" to "value")

    @Test
    fun `gets graph prevalence config from the api`()
    {
        val mockAPI = mock<APIClient>{
            on{ getImpactGraphPrevalenceConfig() } doReturn mockResponse
        }

        val sut = ImpactController(mockAPI)
        assertThat(sut.graphPrevalenceConfig()).isSameAs(mockResponse)
    }

    @Test
    fun `gets graph cases config from the api`()
    {
        val mockAPI = mock<APIClient>{
            on{ getImpactGraphCasesAvertedConfig() } doReturn mockResponse
        }

        val sut = ImpactController(mockAPI)
        assertThat(sut.graphCasesAvertedConfig()).isSameAs(mockResponse)
    }

    @Test
    fun `gets graph prevalence data from the api`()
    {
        val mockAPI = mock<APIClient>{
            on{ getImpactGraphPrevalenceData(options)} doReturn mockResponse
        }

        val sut = ImpactController(mockAPI)
        assertThat(sut.graphPrevalenceData(options)).isSameAs(mockResponse)
    }

    @Test
    fun `gets table config from the api`()
    {
        val mockAPI = mock<APIClient>{
            on{ getImpactTableConfig() } doReturn mockResponse
        }

        val sut = ImpactController(mockAPI)
        assertThat(sut.tableConfig()).isSameAs(mockResponse)
    }

    @Test
    fun `gets docs from the api`()
    {
        val mockAPI = mock<APIClient>{
            on{ getImpactDocs() } doReturn mockResponse
        }

        val sut = ImpactController(mockAPI)
        assertThat(sut.docs()).isSameAs(mockResponse)
    }
}
