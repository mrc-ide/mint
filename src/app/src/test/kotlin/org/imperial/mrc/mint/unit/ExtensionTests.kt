package org.imperial.mrc.mint.unit


import com.fasterxml.jackson.databind.ObjectMapper
import com.github.kittinunf.fuel.core.*
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.doReturn
import com.nhaarman.mockito_kotlin.mock
import org.assertj.core.api.Assertions.assertThat
import org.imperial.mrc.mint.jsonAsResponseEntity
import org.imperial.mrc.mint.binaryAsResponseEntity
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import java.net.URL

class ExtensionTests {
    @Test
    fun `response status code gets translated to HttpStatus`() {
        val mockBody = mock<Body> {
            on {it.asString(any())} doReturn "{\"status\": \"whatever\"}"
        }

        var res = Response(URL("http://whatever"), 200, body=mockBody)
        assertThat(res.jsonAsResponseEntity().statusCode).isEqualTo(HttpStatus.OK)

        res = Response(URL("http://whatever"), 201, body=mockBody)
        assertThat(res.jsonAsResponseEntity().statusCode).isEqualTo(HttpStatus.CREATED)

        res = Response(URL("http://whatever"), 400, body=mockBody)
        assertThat(res.jsonAsResponseEntity().statusCode).isEqualTo(HttpStatus.BAD_REQUEST)

        res = Response(URL("http://whatever"), 401, body=mockBody)
        assertThat(res.jsonAsResponseEntity().statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)

        res = Response(URL("http://whatever"), 403, body=mockBody)
        assertThat(res.jsonAsResponseEntity().statusCode).isEqualTo(HttpStatus.FORBIDDEN)

        res = Response(URL("http://whatever"), 404, body=mockBody)
        assertThat(res.jsonAsResponseEntity().statusCode).isEqualTo(HttpStatus.NOT_FOUND)

        res = Response(URL("http://whatever"), 500, body=mockBody)
        assertThat(res.jsonAsResponseEntity().statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
    }

    @Test
    fun `message is returned when status code is missing`() {
        val res = Response(URL("http://whatever"), -1)
        assertThat(res.jsonAsResponseEntity().statusCode).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE)
        val body = ObjectMapper().readTree(res.jsonAsResponseEntity().body)
        val errorDetail = body["errors"].first()["detail"].textValue()
        assertThat(errorDetail).isEqualTo("No response returned. The request may have timed out.")
    }

    @Test
    fun `error is returned when response is not valid json`() {
        val mockBody = mock<Body> {
            on {it.asString(any())} doReturn "Bad response"
        }
        val res = Response(URL("http://whatever"), 500, body = mockBody)
        assertThat(res.jsonAsResponseEntity().statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
        val body = ObjectMapper().readTree(res.jsonAsResponseEntity().body)
        val errorDetail = body["errors"].first()["detail"].textValue()
        assertThat(errorDetail).isEqualTo("Could not parse response.")
    }

    @Test
    fun `error is returned when response json does not conform to schema`() {
        val mockBody = mock<Body> {
            on {it.asString(any())} doReturn "{\"wrong\": \"schema\"}"
        }
        val res = Response(URL("http://whatever"), 500, body = mockBody)
        assertThat(res.jsonAsResponseEntity().statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
        val body = ObjectMapper().readTree(res.jsonAsResponseEntity().body)
        val errorDetail = body["errors"].first()["detail"].textValue()
        assertThat(errorDetail).isEqualTo("Could not parse response.")
    }

    @Test
    fun `binary payload is returned on success`() {
        val mockBody = mock<Body> {
            on {it.toByteArray()} doReturn byteArrayOf(1, 2, 3, 4)
        }

        val res = Response(URL("http://whatever"), 200, body=mockBody)
        val entity = res.binaryAsResponseEntity()

        assertThat(entity.statusCode).isEqualTo(HttpStatus.OK)
        assertThat(entity.getHeaders().getContentType()).isEqualTo(MediaType.APPLICATION_OCTET_STREAM)
        assertThat(entity.body).isEqualTo(byteArrayOf(1, 2, 3, 4));
    }

    @Test
    fun `binary endpoint returns JSON on error`() {
        val mockBody = mock<Body> {
            on {it.asString(any())} doReturn "{\"status\": \"error\"}"
        }

        val res = Response(URL("http://whatever"), 400, body=mockBody)
        val entity = res.binaryAsResponseEntity()

        assertThat(entity.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        assertThat(entity.getHeaders().getContentType()).isEqualTo(MediaType.APPLICATION_JSON)
        val body = ObjectMapper().readTree(entity.body as? String);
        assertThat(body["status"].textValue()).isEqualTo("error");
    }
}
