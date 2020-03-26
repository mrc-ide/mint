package org.imperial.mrc.mint

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor
import org.springframework.web.servlet.config.annotation.*
import org.springframework.web.servlet.resource.EncodedResourceResolver
import org.springframework.web.servlet.resource.PathResourceResolver

@SpringBootApplication
class MintApplication

fun main(args: Array<String>) {
    SpringApplication.run(MintApplication::class.java, *args)
}

@Configuration
@EnableWebMvc
class MvcConfig() : WebMvcConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("/public/**")
                .addResourceLocations("file:/static/public/", "file:static/public/")
                .resourceChain(true)
                .addResolver(EncodedResourceResolver())
                .addResolver(PathResourceResolver())
    }

    override fun configureAsyncSupport(configurer: AsyncSupportConfigurer) {
        val t = ThreadPoolTaskExecutor()
        t.corePoolSize = 10
        t.maxPoolSize = 100
        t.setQueueCapacity(50)
        t.setAllowCoreThreadTimeOut(true)
        t.keepAliveSeconds = 120
        t.initialize()
        configurer.setTaskExecutor(t)
    }
}
