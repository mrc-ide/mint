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
    fun `can get impact table data`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getImpactTableData(Settings.Baseline)
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Data")
    }

    @Test
    fun `can get graph cost cases averted config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getCostCasesAvertedGraphConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Graph")
    }

    @Test
    fun `can get graph cost efficacy config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getCostEfficacyGraphConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Graph")
    }

    @Test
    fun `can get graph cost data`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getCostGraphData(mapOf())
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Data")
    }

    @Test
    fun `can get cost table config`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getCostTableConfig()
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "TableDefinition")
    }

    @Test
    fun `can get cost table data`() {
        val sut = MintrAPIClient(ConfiguredAppProperties(), ObjectMapper())
        val result = sut.getCostTableData(mapOf())
        assertThat(result.statusCodeValue).isEqualTo(200)
        JSONValidator().validateSuccess(result.body!!, "Data")
    }
}
