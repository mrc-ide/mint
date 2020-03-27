package org.imperial.mrc.mint

import org.springframework.stereotype.Component
import java.io.File
import java.io.FileNotFoundException
import java.net.URL
import java.util.*

interface AppProperties {
    val applicationTitle: String
    val applicationUrl: String
}

//prevent auto-wiring of default Properties
class MintProperties: Properties()

@Component
class ConfiguredAppProperties(private val props: MintProperties = properties): AppProperties {
    override val applicationTitle = propString("application_title")
    override val applicationUrl = propString("application_url")

    companion object {

        fun readProperties(configPath: String): MintProperties {
            return MintProperties().apply {
                load(getResource("config.properties").openStream())
                val global = File(configPath)
                if (global.exists()) {
                    global.inputStream().use { load(it) }
                }
            }
        }

        var configPath = "/etc/mint/config.properties"
        val properties = readProperties(configPath)
    }

    private fun propString(propName: String): String {
        return props[propName].toString()
    }
}

fun getResource(path: String): URL {
    val url: URL? = AppProperties::class.java.classLoader.getResource(path)
    if (url != null) {
        return url
    } else {
        throw FileNotFoundException("Unable to load '$path' as a resource steam")
    }
}
