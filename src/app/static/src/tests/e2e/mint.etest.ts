import {expect, test} from "@playwright/test";
import AxeBuilder from '@axe-core/playwright';

test.describe("basic tests", () => {

    test("renders homepage", async ({page}) => {
        await page.goto("/");

        expect(await page.innerText("a.navbar-brand")).toBe("MINT");
    });

    test('accessibility of homepage', async ({page}) => {
        await page.goto("/");

        const accessibilityScanResults = await new AxeBuilder({page})
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toStrictEqual([]);
    });

    test("prevalences are displayed as ranges", async ({page}) => {
        await page.goto("/");

        await page.fill("#name", "Project 1");

        await page.fill(".ti-new-tag-input", "Region A");
        await page.click(".btn-primary");

        // default value is 30%
        await expect(page.locator("select[name=currentPrevalence] option:checked")).toHaveText(/^\s*26-35%\s*$/);

        await page.selectOption("select[name=currentPrevalence]", "5%");
        await expect(page.locator("select[name=currentPrevalence] option:checked")).toHaveText(/^\s*<= 7%\s*$/);
    });

    test("creates a project with two regions", async ({page}) => {
        await page.goto("/");

        await page.fill("#name", "Project 1");

        await page.fill(".ti-new-tag-input", "Region A");
        await page.click(".btn-primary");
        await page.click("text=Next");

        expect(await page.innerText(":nth-match(a.active, 1)")).toBe("Impact");
        expect(await page.innerText(":nth-match(a.active, 2)")).toBe("Graphs");
        await page.click("a.dropdown-toggle");
        await page.click("text=Add region");
        await page.fill("#region", "Region B");
        await page.click(".modal .btn-primary");
        await page.click("text=Next");

        expect(await page.innerText("a.dropdown-toggle")).toContain("Region B ");
    });

    test("strategise", async ({page}) => {
        await page.goto("/?stratAcrossRegions=true");

        // Create project
        await page.fill("#name", "Project 1");

        // Create first region
        await page.fill(".ti-new-tag-input", "Region A");
        await page.click(".btn-primary");
        await page.click("text=Next");
        await page.selectOption('[name="netUse"]', "0.2");

        // Create second region
        await page.click("a.dropdown-toggle");
        await page.click("text=Add region");
        await page.fill("#region", "Region B");
        await page.click(".modal .btn-primary");
        await page.click("text=Next");
        await page.selectOption('[name="irsUse"]', "0.6");

        // Navigate to strategize page and submit form
        await page.click("#stratAcrossRegions");
        await page.click(".btn-primary");

        // Summary table should be displayed, with llin as at least one of the strategies
        expect(await page.innerText(".summaryTable")).toContain("Pyrethroid LLIN only");

        // Ensure that heading prompts strategy selection
        expect(await page.innerText("h2 >> nth=1")).toContain("Select a row");

        // Select row in summary table in order to see details for a specific strategy
        await page.click("text='Strategy 3'");

        // Ensure that heading reflects strategy selection
        expect(await page.innerText("h2 >> nth=1")).toBe("Details for Strategy 3");

        // Check that (only) the selected table row has a border
        const border = async (selector) => page.$eval(selector, el => window.getComputedStyle(el).border);
        expect(await border("tr:nth-child(3)")).toContain("solid");
        expect(await border("tr:nth-child(2)")).toContain("none");

        // Verify default "Charts" tab is displayed by checking for title displayed above charts
        expect(await page.innerText(".tab-content")).toContain("Cases averted per region");

        // Switch to "Table" tab
        await page.click("text='Table'");

        // Check that total population across the two regions is displayed in footer (summary) row of table
        expect(await page.innerText(".tab-content")).toContain("2000");
    });

});
