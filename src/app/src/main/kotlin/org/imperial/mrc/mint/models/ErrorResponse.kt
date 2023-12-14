package org.imperial.mrc.mint.models

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.ObjectMapper

data class ErrorResponse(val errors: List<ErrorDetail>) {
    val data = mapOf<Any, Any>()
    val status = "failure"
}

fun ErrorResponse.toJsonString(): String = ObjectMapper().apply {
    setSerializationInclusion(JsonInclude.Include.NON_NULL)
}.writeValueAsString(this)
