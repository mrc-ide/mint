package org.imperial.mrc.mint

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.kittinunf.fuel.core.Response
import org.imperial.mrc.mint.models.ErrorDetail
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import java.io.IOException

/**
 * Convert a mintr endpoint's JSON result to a Spring ResponseEntity.
 */
fun Response.jsonAsResponseEntity(): ResponseEntity<String> {
    if (this.statusCode == -1) {
        return ErrorDetail(HttpStatus.SERVICE_UNAVAILABLE, "No response returned. The request may have timed out.")
            .toResponseEntity()
    }

    val httpStatus = httpStatusFromCode(this.statusCode)
    return try {
        val body = this.body().asString("application/json")
        val json = ObjectMapper().readTree(body)
        if (!json.has("status")) {
            throw IOException()
        }

        ResponseEntity.status(httpStatus)
            .contentType(MediaType.APPLICATION_JSON)
            .body(body)
    } catch (@Suppress("SwallowedException") e: IOException) {
        ErrorDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Could not parse response.")
            .toResponseEntity()
    }
}

/**
 * Convert a mintr endpoint's binary result to a Spring ResponseEntity.
 *
 * This assumes the endpoint returns a binary result for successful HTTP error
 * codes but a JSON object on error.
 */
fun Response.binaryAsResponseEntity(): ResponseEntity<out Any> {
    if (this.statusCode == -1) {
        return ErrorDetail(HttpStatus.SERVICE_UNAVAILABLE, "No response returned. The request may have timed out.")
            .toResponseEntity()
    }

    val httpStatus = httpStatusFromCode(this.statusCode)
    return if (httpStatus.is2xxSuccessful()) {
        val body = this.body().toByteArray()
        ResponseEntity.status(httpStatus)
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(body)
    } else {
        this.jsonAsResponseEntity()
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
