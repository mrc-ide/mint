package org.imperial.mrc.mint.integration.endpoints

import org.assertj.core.api.Assertions
import org.imperial.mrc.mint.helpers.JSONValidator
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles(profiles = ["dev"])
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
abstract class EndpointTests {
    @Autowired
    lateinit var testRestTemplate: TestRestTemplate

    protected fun assertSuccess(responseEntity: ResponseEntity<*>) {
        if (responseEntity.statusCode != HttpStatus.OK) {
            Assertions.fail<String>("Expected OK response but got error: ${responseEntity.body}")
        }
    }

    protected fun assertSuccessfulValidJson(responseEntity: ResponseEntity<String>,
                                            schemaName: String?) {

        Assertions.assertThat(responseEntity.headers.contentType!!.toString())
                .isEqualTo("application/json")

        assertSuccess(responseEntity)

        if (schemaName != null) {
            JSONValidator().validateSuccess(responseEntity.body!!, schemaName)
        }
    }
}
