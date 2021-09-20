package org.imperial.mrc.mint

import org.springframework.http.ResponseEntity
import org.springframework.http.MediaType
import org.springframework.http.HttpStatus
import com.github.kittinunf.fuel.core.Response
import com.fasterxml.jackson.databind.ObjectMapper
import org.imperial.mrc.mint.models.ErrorDetail
import java.io.IOException

@Suppress("UNCHECKED_CAST", "SwallowedException")
fun Response.asResponseEntity(): ResponseEntity<String> {
    val httpStatus = httpStatusFromCode(this.statusCode)

    if (this.statusCode == -1) {
        return ErrorDetail(httpStatus, "No response returned. The request may have timed out.")
                .toResponseEntity() as ResponseEntity<String>
    }

    return try {
        val body = this.body().asString("application/json")
        val json = ObjectMapper().readTree(body)
        if (!json.has("status")) {
            throw IOException()
        }

        ResponseEntity.status(httpStatus)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)

    } catch (e: IOException) {
        ErrorDetail(httpStatus, "Could not parse response.")
                .toResponseEntity() as ResponseEntity<String>
    }

}

fun httpStatusFromCode(code: Int): HttpStatus {
    val status = HttpStatus.resolve(code) ?: return HttpStatus.INTERNAL_SERVER_ERROR
    return if (status <= HttpStatus.NOT_FOUND) {
        status
    } else {
        HttpStatus.INTERNAL_SERVER_ERROR
    }
}

