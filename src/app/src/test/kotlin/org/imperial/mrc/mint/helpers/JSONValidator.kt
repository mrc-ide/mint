package org.imperial.mrc.mint.helpers

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions
import org.leadpony.justify.api.JsonSchema
import org.leadpony.justify.api.JsonValidationService
import org.leadpony.justify.api.Problem
import org.leadpony.justify.api.ProblemHandler
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

    private val readerFactory = service.createSchemaReaderFactoryBuilder()
            .withSchemaResolver(this::resolveSchema)
            .build()

    fun validateError(response: String,
                      expectedErrorCode: String,
                      expectedErrorMessage: String? = null) {
        val error = objectMapper.readValue<JsonNode>(response)["errors"].first()
        val status = objectMapper.readValue<JsonNode>(response)["status"].textValue()

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
        val data = objectMapper.readValue<JsonNode>(response)["data"]
        val status = objectMapper.readValue<JsonNode>(response)["status"].textValue()

        assertThat(status).isEqualTo("success")
        val dataSchema = getSchema(schemaName)
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

    private fun getSchema(name: String): JsonSchema {
        val path = if (name.endsWith(".schema.json")) {
            name
        } else {
            "$name.schema.json"
        }
        val url = URL("https://raw.githubusercontent.com/mrc-ide/mintr/$mintrVersion/inst/schema/$path")

        val conn = url.openConnection() as HttpURLConnection
        return BufferedReader(InputStreamReader(conn.getInputStream())).use {
            val reader = readerFactory.createSchemaReader(it)
            try {
                reader.read()
            } catch (e: JsonParsingException) {
                Assertions.fail<JsonSchema>("Could not parse schema $name")
            }
        }
    }

    private fun resolveSchema(id: URI): JsonSchema {
        return getSchema(id.path)
    }
}