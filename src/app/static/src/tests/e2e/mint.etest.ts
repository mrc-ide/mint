import {expect, test} from "@playwright/test";

test.describe("basic tests", () => {
    test("renders homepage", async ({page}) => {
        await page.goto("/");
        const name = await page.innerText("a.navbar-brand");
        expect(name).toBe("MINT");
    });

    test("creates a project with two regions", async ({page}) => {
        await page.goto("/");

        expect(await page.innerText("h1")).toBe("Create a project to get started");
        await page.fill("#name", "Project 1");
        await page.fill(".ti-new-tag-input", "Region A");
        await page.click(".btn-primary");

        expect(await page.innerText("h4")).toBe("Setup baseline");
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

        expect(await page.innerText(".table")).toContain("Pyrethroid-PBO ITN only");
    });
});
