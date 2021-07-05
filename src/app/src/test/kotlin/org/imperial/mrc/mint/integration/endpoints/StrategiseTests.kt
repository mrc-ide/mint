package org.imperial.mrc.mint.integration.endpoints

import org.imperial.mrc.mint.helpers.Settings
import org.junit.jupiter.api.Test
import org.springframework.boot.test.web.client.postForEntity

class StrategiseTests : EndpointTests() {

    @Test
    fun `can get strategies`() {
        val responseEntity = testRestTemplate.postForEntity<String>(
                "/strategise",
                mapOf(
                        "budget" to 20000,
                        "zones" to listOf(
                                mapOf(
                                        "name" to "Region A",
                                        "baselineSettings" to Settings.Baseline,
                                        "interventionSettings" to mapOf(
                                                "procurePeoplePerNet" to 1.8,
                                                "procureBuffer" to 7,
                                                "priceDelivery" to 2.75,
                                                "priceNetPBO" to 2.5,
                                                "priceNetStandard" to 1.5,
                                                "priceIRSPerPerson" to 5.73,
                                                "netUse" to "0.8",
                                                "irsUse" to "0.6"
                                        )
                                )
                        )
                )
        )
        assertSuccess(responseEntity, "Strategise")
    }

}
