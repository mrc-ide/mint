package org.imperial.mrc.mint.integration.endpoints

import org.assertj.core.api.Assertions.assertThat
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.getForEntity

class EmulatorTests: EndpointTests() {
    @Test
    fun `can get emulator config`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/emulator/config")
        assertSuccessfulValidJson(responseEntity, "EmulatorOptions")

        val response = ObjectMapper().readTree(responseEntity.body)
        assertThat(response["data"]["models"]).isNotEmpty()
    }

    @Test
    fun `can get emulator data`() {
        val responseEntity = testRestTemplate.getForEntity<String>("/emulator/config")
        val response = ObjectMapper().readTree(responseEntity.body)
        val modelConfig = response["data"]["models"].first()
        val modelFilename = modelConfig["filename"].textValue()

        val modelEntity = testRestTemplate.getForEntity<ByteArray>("/emulator/model/${modelFilename}")
        assertSuccess(modelEntity)
        assertThat(modelEntity.headers.contentType!!.toString()).isEqualTo("application/octet-stream")
    }
}
