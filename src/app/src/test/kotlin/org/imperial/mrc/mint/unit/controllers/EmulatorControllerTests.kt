package org.imperial.mrc.mint.unit.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import com.nhaarman.mockito_kotlin.any
import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.mint.APIClient
import org.imperial.mrc.mint.controllers.EmulatorController
import org.junit.jupiter.api.Test
import org.springframework.http.ResponseEntity

class EmulatorControllerTests {
    @Test
    fun `gets emulator config from the api`() {
        val mockResponse = mock<ResponseEntity<String>>()
        val mockAPI = mock<APIClient> {
            on { getEmulatorConfig() } doReturn mockResponse
        }

        val sut = EmulatorController(mockAPI)
        assertThat(sut.emulatorConfig()).isSameAs(mockResponse)
    }

    @Test
    fun `gets emulator data from the api`() {
        val mockResponse = mock<ResponseEntity<out Any>>()
        val mockAPI = mock<APIClient> {
            on { getEmulatorModel("foobar") } doReturn mockResponse
        }

        val sut = EmulatorController(mockAPI)
        assertThat(sut.emulatorModel("foobar")).isSameAs(mockResponse)
    }
}
