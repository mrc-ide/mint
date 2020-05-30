package org.imperial.mrc.mint.unit.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions
import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.mint.APIClient
import org.imperial.mrc.mint.controllers.CostController
import org.junit.jupiter.api.Test
import org.springframework.http.ResponseEntity

class CostControllerTests {
    private val mockResponse = mock<ResponseEntity<String>>()
    private val options = mapOf("option" to "value")

    @Test
    fun `gets graph cases averted config from the api`()
    {
        val mockAPI = mock<APIClient>{
            on{ getCostCasesAvertedGraphConfig() } doReturn mockResponse
        }

        val sut = CostController(mockAPI)
        assertThat(sut.graphCasesAvertedConfig()).isSameAs(mockResponse)
    }

    @Test
    fun `gets graph data from the api`()
    {
        val mockAPI = mock<APIClient>{
            on{ getCostGraphData(options)} doReturn mockResponse
        }

        val sut = CostController(mockAPI)
        assertThat(sut.graphData(options)).isSameAs(mockResponse)
    }

    @Test
    fun `gets table config from the api`()
    {
        val mockAPI = mock<APIClient>{
            on{ getCostTableConfig() } doReturn mockResponse
        }

        val sut = CostController(mockAPI)
        assertThat(sut.tableConfig()).isSameAs(mockResponse)
    }

    @Test
    fun `gets table data from the api`()
    {
        val mockAPI = mock<APIClient>{
            on{ getCostTableData(options)} doReturn mockResponse
        }

        val sut = CostController(mockAPI)
        assertThat(sut.tableData(options)).isSameAs(mockResponse)
    }
}