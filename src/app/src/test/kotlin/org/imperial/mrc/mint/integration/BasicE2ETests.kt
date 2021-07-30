package org.imperial.mrc.mint.integration

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class BasicE2ETests : E2ETests() {

    @Test
    fun `renders homepage`() {
        page.navigate("http://localhost:8080")
        assertEquals(page.innerText("a.navbar-brand"), "MINT")
    }

}
