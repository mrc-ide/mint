package org.imperial.mrc.mint.integration

import com.fasterxml.jackson.databind.ObjectMapper
import org.assertj.core.api.AssertionsForClassTypes.assertThat
import org.imperial.mrc.mint.ConfiguredAppProperties
import org.imperial.mrc.mint.MintrAPIClient
import org.imperial.mrc.mint.helpers.JSONValidator
import org.imperial.mrc.mint.helpers.Settings
import org.junit.jupiter.api.Test

class MintrAPIClientTests {
    @Test
    fun `can get baseline options`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getBaselineOptions()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "DynamicFormOptions")
    }

    @Test
    fun `can get intervention options`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getInterventionOptions()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "DynamicFormOptions")
    }

    @Test
    fun `can get impact graph prevalence config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getImpactGraphPrevalenceConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Graph")
    }

    @Test
    fun `can get impact graph cases config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getImpactGraphCasesAvertedConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Graph")
    }

    @Test
    fun `can get impact graph prevalence data`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getImpactGraphPrevalenceData(Settings.Baseline)
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Data")
    }

    @Test
    fun `can get error on send invalid settings for graph prevalence data`()
    {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getImpactGraphPrevalenceData(mapOf())
        JSONValidator().validateError(result.body!!, "SERVER_ERROR")
    }

    @Test
    fun `can get impact table config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getImpactTableConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "TableDefinition")
    }

    @Test
    fun `can get graph cost cases averted config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getCostCasesAvertedGraphConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Graph")
    }

    @Test
    fun `can get graph cost per case config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getCostPerCaseGraphConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Graph")
    }

    @Test
    fun `can get cost table config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getCostTableConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "TableDefinition")
    }

    @Test
    fun `can get table data`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getTableData(Settings.Baseline)
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Data")
    }

    @Test
    fun `can get impact docs`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getImpactDocs()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Docs")
    }

    @Test
    fun `can get cost docs`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getCostDocs()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Docs")
    }

    @Test
    fun `can get strategies`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val options = mapOf(
                "budget" to 20_000,
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
                                        "priceNetPyrrole" to 3,
                                        "priceIRSPerPerson" to 5.73,
                                        "netUse" to "0.8",
                                        "irsUse" to "0.6"
                                )
                        )
                )
        )
        val result = sut.getStrategies(options)
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Strategise")
    }

    @Test
    fun `can get version`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getVersion()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Version")
    }
}
