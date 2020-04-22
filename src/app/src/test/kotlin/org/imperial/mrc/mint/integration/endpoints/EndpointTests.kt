package org.imperial.mrc.mint.integration.endpoints

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles(profiles = ["dev"])
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
abstract class EndpointTests {
    @Autowired
    lateinit var testRestTemplate: TestRestTemplate
}