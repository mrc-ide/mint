import {
    roundNumberToNearest,
    formatCurrency, formatNumber,
    formatPercentage,
    getInterventionColourName,
    getInterventionName,
    getRegionPopulations
} from "../../../../app/components/figures/strategise/util";
import {Project} from "../../../../app/models/project";
import {DynamicFormData} from "@reside-ic/vue-dynamic-form";

describe("strategise utilities", () => {

    it("formats invalid costs as NA", () => {
        expect(formatCurrency(NaN)).toBe("NA");
    });

    it("formats valid costs as expected", () => {
        expect(formatCurrency(12.345)).toBe("$12");
        expect(formatCurrency(12.345, 2)).toBe("$12.35");
    });

    it("formats numbers as expected", () => {
        expect(formatNumber(12.345)).toBe("12");
        expect(formatNumber(12.345, 1)).toBe("12.3");
    });

    it("formats percentages as expected", () => {
        expect(formatPercentage(0.123)).toBe("12.3%");
    });

    it("rounds numbers as expected", () => {
        expect(roundNumberToNearest(5, 50)).toBe(0);
        expect(roundNumberToNearest(25, 50)).toBe(50);
        expect(roundNumberToNearest(45, 50)).toBe(50);
        expect(roundNumberToNearest(55, 50)).toBe(50);
        expect(roundNumberToNearest(100, 50)).toBe(100);
    });

    it("gets intervention name", () => {
        expect(getInterventionName("irs-llin")).toBe("Pyrethroid LLIN with IRS*");
        expect(getInterventionName("none")).toBe("No intervention");
    });

    it("gets intervention colour", () => {
        expect(getInterventionColourName("irs-llin")).toBe("warning");
        expect(getInterventionColourName("none")).toBe("");
    });

    it("gets populations", () => {
        expect(getRegionPopulations({
            regions: [
                {
                    name: "Africa",
                    baselineSettings: {
                        population: 1000
                    } as DynamicFormData
                },
                {
                    name: "Antarctica",
                    baselineSettings: {
                        population: 500
                    } as DynamicFormData
                }
            ]
        } as Project)).toStrictEqual({
            Africa: 1000,
            Antarctica: 500
        });
    });

})