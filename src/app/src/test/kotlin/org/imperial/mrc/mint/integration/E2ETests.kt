package org.imperial.mrc.mint.integration

import com.microsoft.playwright.Browser
import com.microsoft.playwright.BrowserContext
import com.microsoft.playwright.Page
import com.microsoft.playwright.Playwright
import org.junit.jupiter.api.*

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
abstract class E2ETests {

    companion object {
        private lateinit var playwright: Playwright
        private lateinit var browser: Browser

        @BeforeAll
        @JvmStatic
        fun launchBrowser() {
            playwright = Playwright.create()
            browser = playwright.chromium().launch()
        }

        @AfterAll
        @JvmStatic
        fun closeBrowser() {
            playwright.close()
        }
    }

    private lateinit var context: BrowserContext
    protected lateinit var page: Page

    @BeforeEach
    fun createContextAndPage() {
        context = browser.newContext()
        page = context.newPage()
    }

    @AfterEach
    fun closeContext() {
        context.close()
    }

}
