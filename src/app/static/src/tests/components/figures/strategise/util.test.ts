import {
    formatCases,
    formatCost,
    formatPercentage, getInterventionColour,
    getInterventionName
} from "../../../../app/components/figures/strategise/util";

describe("strategise utilities", () => {

    it("formats invalid costs as NA", () => {
        expect(formatCost(NaN)).toBe("NA");
    });

    it("formats valid costs as expected", () => {
        expect(formatCost(12.345)).toBe("$12");
        expect(formatCost(12.345, 2)).toBe("$12.35");
    });

    it("formats cases as expected", () => {
        expect(formatCases(12.345)).toBe("12");
        expect(formatCases(12.345, 1)).toBe("12.3");
    });

    it("formats percentages as expected", () => {
        expect(formatPercentage(0.123)).toBe("12.3%");
    });

    it("gets intervention name", () => {
        expect(getInterventionName("irs-llin")).toBe("Pyrethroid LLIN with IRS*");
        expect(getInterventionName("none")).toBe("No intervention");
    });

    it("gets intervention colour", () => {
        expect(getInterventionColour("irs-llin")).toBe("warning");
        expect(getInterventionColour("none")).toBe("");
    });

})