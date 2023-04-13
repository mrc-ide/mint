import {expect, test} from "@playwright/test";

const costStringToNumber = (costString) => {
    const regex =  /\$([0-9.]*)(k?)/;
    const match = costString.match(regex);
    if (!match) {
        return null;
    }
    const numericPart = Number.parseFloat(match[1]);
    const kPart = match[2] ? 1000 : 1;
    return numericPart * kPart;
};
test.beforeEach(async ({page}) => {
    await page.goto("/");

    // Make a project
    await page.fill("#name", "Project 1");
    await page.fill(".ti-new-tag-input", "Region A");
    await page.click(".btn-primary");

    // Accept baseline
    await page.click("text=Next");

    // select usages
    await page.locator("select[name='netUse']").selectOption("0.2");
    await page.locator("select[name='irsUse']").selectOption("0.6");

    // Go to cost table
    await page.click("text='Table'")
    await page.click("text='Cost effectiveness'");
});

test("can set procurement buffer to 0", async ({page}) => {
    // Click on Interventions header to order by name
    await page.locator(":nth-match(th div, 1)").click();

    // values in cost table should update accordingly
    const llinRow = await page.locator(":nth-match(table tr, 4)");
    const costCell = await llinRow.locator(":nth-match(td, 5)");
    const originalLLINCost = costStringToNumber(await costCell.innerText());

    const procureBufferInput = await page.locator("input[name='procureBuffer']");
    await procureBufferInput.fill("0");

    const newLLINCost = costStringToNumber(await costCell.innerText());
    expect(newLLINCost).toBeLessThan(originalLLINCost);

    // empty numeric value should be treated as 0
    // reset value to ensure setting to empty makes  difference
    await procureBufferInput.fill("7");
    expect(costStringToNumber(await costCell.innerText())).toBe(originalLLINCost);
    await procureBufferInput.fill("");
    expect(costStringToNumber(await costCell.innerText())).toBe(newLLINCost);
});
