package org.imperial.mrc.mint.unit

import org.assertj.core.api.Java6Assertions.assertThat
import org.imperial.mrc.mint.ConfiguredAppProperties
import org.imperial.mrc.mint.MintProperties
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import java.io.File

class AppPropertiesTests {

    @AfterEach
    fun cleanup() {
        File("tmp").deleteRecursively()
    }

    private fun readPropsFromTempFile(contents: String): MintProperties {
        File("tmp").mkdir()
        val config = File("tmp/fake.properties")
        config.createNewFile()
        config.writeText(contents)
        return ConfiguredAppProperties.readProperties("tmp/fake.properties")
    }

    @Test
    fun `properties can be read from disk`() {

        val props = readPropsFromTempFile("something=1234")
        assertThat(props["something"]).isEqualTo("1234")
    }

    @Test
    fun `properties are expected at the correct path`() {
        assertThat(ConfiguredAppProperties.configPath).isEqualTo("/etc/mint/config.properties")
    }

    @Test
    fun `can read applicationTitle`() {
        val props = readPropsFromTempFile("application_title=TestTitle")
        val sut = ConfiguredAppProperties(props)
        assertThat(sut.applicationTitle).isEqualTo("TestTitle")
    }

    @Test
    fun `can read applicationUrl`() {
        val props = readPropsFromTempFile("application_url=https://test")
        val sut = ConfiguredAppProperties(props)
        assertThat(sut.applicationUrl).isEqualTo("https://test")
    }
}
