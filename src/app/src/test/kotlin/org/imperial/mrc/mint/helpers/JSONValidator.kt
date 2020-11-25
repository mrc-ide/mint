package org.imperial.mrc.mint.helpers

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions
import org.leadpony.justify.api.*
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URI
import java.net.URL
import javax.json.stream.JsonParsingException

class JSONValidator {

    private val service = JsonValidationService.newInstance()
    private val objectMapper = ObjectMapper()
    private val mintrVersion = File("../config/mintr_version").readLines().first()

    private val modelSchemaReaderFactory = service.createSchemaReaderFactoryBuilder()
            .withSchemaResolver(this::resolveModelSchema)
            .build()

    private val responseSchemaReaderFactory = service.createSchemaReaderFactoryBuilder()
            .withSchemaResolver(this::resolveResponseSchema)
            .build()

    fun validateError(response: String,
                      expectedErrorCode: String,
                      expectedErrorMessage: String? = null) {
        val responseSchema = getResponseSchema("response-failure")
        val responseJson = objectMapper.readValue<JsonNode>(response)
        assertValidates(response, responseSchema, "response-failure")

        val error = responseJson["errors"].first()
        val status = responseJson["status"].textValue()

        assertThat(status).isEqualTo("failure")
        assertThat(error["error"].asText()).isEqualTo(expectedErrorCode)
        if (expectedErrorMessage != null) {
            val actualErrorDetail = error["detail"].asText()
            val regex = Regex(expectedErrorMessage)
            assertThat(regex.matchEntire(actualErrorDetail))
                    .withFailMessage("Expected $actualErrorDetail to match $expectedErrorMessage")
                    .isNotNull()
        }
    }

    fun validateSuccess(response: String, schemaName: String) {
        val responseSchema = getResponseSchema("response-success")
        val responseJson = objectMapper.readValue<JsonNode>(response)
        assertValidates(response, responseSchema, "response-success")

        val data = responseJson["data"]
        val status = responseJson["status"].textValue()

        assertThat(status).isEqualTo("success")

        val dataSchema = getModelSchema(schemaName)
        assertValidates(objectMapper.writeValueAsString(data), dataSchema, schemaName)
    }

    private fun assertValidates(jsonString: String, schema: JsonSchema, schemaName: String) {
        val problems = mutableListOf<Problem>()
        val handler = ProblemHandler.collectingTo(problems)
        val parser = service.createParser(jsonString.byteInputStream(), schema, handler)
        while (parser.hasNext()) {
            parser.next()
        }
        if (problems.any()) {
            Assertions.fail<Any>(
                    "JSON failed schema validation. Attempted to validate: $jsonString against $schemaName. " +
                            "Problems were ${problems.joinToString(",")}"
            )
        }
    }

    private fun getModelSchema(name: String): JsonSchema
    {
        val location = "https://raw.githubusercontent.com/mrc-ide/mintr/$mintrVersion/inst/schema/"
        return getSchema(name, location, modelSchemaReaderFactory)
    }

    private fun getResponseSchema(name: String): JsonSchema
    {
        val location = "https://raw.githubusercontent.com/reside-ic/pkgapi/master/inst/schema/"
        return getSchema(name, location, responseSchemaReaderFactory)
    }

    private fun getSchema(name: String, location: String, factory: JsonSchemaReaderFactory): JsonSchema
    {
        val path = if (name.endsWith(".schema.json")) {
            name
        } else {
            "$name.schema.json"
        }
        val url = URL("$location$path")

        val conn = url.openConnection() as HttpURLConnection
        return BufferedReader(InputStreamReader(conn.getInputStream())).use {
            val reader = factory.createSchemaReader(it)
            try {
                reader.read()
            } catch (e: JsonParsingException) {
                Assertions.fail<JsonSchema>("Could not parse schema $name")
            }
        }
    }

    private fun resolveModelSchema(id: URI): JsonSchema {
        return getModelSchema(id.path)
    }

    private fun resolveResponseSchema(id: URI): JsonSchema {
        return getResponseSchema(id.path)
    }
}
