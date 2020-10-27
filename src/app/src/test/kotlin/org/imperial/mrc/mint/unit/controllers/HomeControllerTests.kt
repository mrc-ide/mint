package org.imperial.mrc.mint.unit.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.imperial.mrc.mint.APIClient
import org.imperial.mrc.mint.controllers.HomeController
import org.junit.jupiter.api.Test
import org.springframework.http.ResponseEntity

class HomeControllerTests  {

    private val mockResponse = mock<ResponseEntity<String>>()
    private val options = mapOf("option" to "value")

    @Test
    fun `gets table data from the api`()
    {
        val mockAPI = mock<APIClient>{
            on{ getTableData(options)} doReturn mockResponse
        }

        val sut = HomeController(mockAPI, mock())
        assertThat(sut.tableData(options)).isSameAs(mockResponse)
    }
}
