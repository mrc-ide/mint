package org.imperial.mrc.mint.unit.controllers

import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.imperial.mrc.mint.AppProperties
import org.imperial.mrc.mint.controllers.MINTErrorController
import org.junit.jupiter.api.Test
import javax.servlet.RequestDispatcher
import javax.servlet.http.HttpServletRequest

class ErrorControllerTests {

    private val mockProps = mock<AppProperties> {
        on { applicationTitle } doReturn "MINT"
    }

    @Test
    fun `returns error path`() {
        val sut = MINTErrorController(mockProps)
        assertThat(sut.errorPath).isEqualTo("/error")
    }

    @Test
    fun `returns 404 page if status is 404, 403 or 401`() {
        val sut = MINTErrorController(mockProps)
        var mockRequest = mock<HttpServletRequest> {
            on { getAttribute(RequestDispatcher.ERROR_STATUS_CODE) } doReturn "404"
        }
        var result = sut.handleError(mockRequest)
        assertThat(result.viewName).isEqualTo("404")

        mockRequest = mock {
            on { getAttribute(RequestDispatcher.ERROR_STATUS_CODE) } doReturn "403"
        }
        result = sut.handleError(mockRequest)
        assertThat(result.viewName).isEqualTo("404")

        mockRequest = mock {
            on { getAttribute(RequestDispatcher.ERROR_STATUS_CODE) } doReturn "401"
        }
        result = sut.handleError(mockRequest)
        assertThat(result.viewName).isEqualTo("404")
    }

    @Test
    fun `returns 500 page for other statuses`() {
        val sut = MINTErrorController(mockProps)
        var mockRequest = mock<HttpServletRequest> {
            on { getAttribute(RequestDispatcher.ERROR_STATUS_CODE) } doReturn "500"
        }
        var result = sut.handleError(mockRequest)
        assertThat(result.viewName).isEqualTo("500")

        mockRequest = mock<HttpServletRequest> {
            on { getAttribute(RequestDispatcher.ERROR_STATUS_CODE) } doReturn "111"
        }
        result = sut.handleError(mockRequest)
        assertThat(result.viewName).isEqualTo("500")
    }
}
