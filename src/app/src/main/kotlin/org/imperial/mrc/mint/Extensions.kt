package org.imperial.mrc.mint

import org.springframework.http.ResponseEntity
import org.springframework.http.MediaType
import org.springframework.http.HttpStatus
import com.github.kittinunf.fuel.core.Response
import com.fasterxml.jackson.databind.ObjectMapper
import org.imperial.mrc.mint.models.ErrorDetail
import java.io.IOException

@Suppress("UNCHECKED_CAST")
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
    return when (code) {
        200 -> HttpStatus.OK
        201 -> HttpStatus.CREATED
        400 -> HttpStatus.BAD_REQUEST
        401 -> HttpStatus.UNAUTHORIZED
        403 -> HttpStatus.FORBIDDEN
        404 -> HttpStatus.NOT_FOUND
        else -> HttpStatus.INTERNAL_SERVER_ERROR
    }
}