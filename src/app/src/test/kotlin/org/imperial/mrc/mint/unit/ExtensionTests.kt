package org.imperial.mrc.mint.unit


import com.fasterxml.jackson.databind.ObjectMapper
import com.github.kittinunf.fuel.core.*
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Java6Assertions.assertThat
import org.imperial.mrc.mint.asResponseEntity
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import java.net.URL

class ExtensionTests {
    @Test
    fun `response status code gets translated to HttpStatus`() {

        var res = Response(URL("http://whatever"), 200)
        assertThat(res.asResponseEntity().statusCode).isEqualTo(HttpStatus.OK)

        res = Response(URL("http://whatever"), 201)
        assertThat(res.asResponseEntity().statusCode).isEqualTo(HttpStatus.CREATED)

        res = Response(URL("http://whatever"), 400)
        assertThat(res.asResponseEntity().statusCode).isEqualTo(HttpStatus.BAD_REQUEST)

        res = Response(URL("http://whatever"), 401)
        assertThat(res.asResponseEntity().statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)

        res = Response(URL("http://whatever"), 403)
        assertThat(res.asResponseEntity().statusCode).isEqualTo(HttpStatus.FORBIDDEN)

        res = Response(URL("http://whatever"), 404)
        assertThat(res.asResponseEntity().statusCode).isEqualTo(HttpStatus.NOT_FOUND)

        res = Response(URL("http://whatever"), 500)
        assertThat(res.asResponseEntity().statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)

    }

    @Test
    fun `message is returned when status code is missing`() {
        val res = Response(URL("http://whatever"), -1)
        assertThat(res.asResponseEntity().statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
        val body = ObjectMapper().readTree(res.asResponseEntity().body)
        val errorDetail = body["errors"].first()["detail"].textValue()
        assertThat(errorDetail).isEqualTo("No response returned. The request may have timed out.")
    }

    @Test
    fun `error is returned when response is not valid json`() {
        val mockBody = mock<Body> {
            on {it.asString(any())} doReturn "Bad response"
        }
        val res = Response(URL("http://whatever"), 500, body = mockBody)
        assertThat(res.asResponseEntity().statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
        val body = ObjectMapper().readTree(res.asResponseEntity().body)
        val errorDetail = body["errors"].first()["detail"].textValue()
        assertThat(errorDetail).isEqualTo("Could not parse response.")
    }

    @Test
    fun `error is returned when response json does not conform to schema`() {
        val mockBody = mock<Body> {
            on {it.asString(any())} doReturn "{\"wrong\": \"schema\"}"
        }
        val res = Response(URL("http://whatever"), 500, body = mockBody)
        assertThat(res.asResponseEntity().statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
        val body = ObjectMapper().readTree(res.asResponseEntity().body)
        val errorDetail = body["errors"].first()["detail"].textValue()
        assertThat(errorDetail).isEqualTo("Could not parse response.")
    }

}