import {
    formatCases,
    formatCost,
    formatPercentage,
    getInterventionColourValue,
    getInterventionName,
    getRegionPopulations
} from "../../../../app/components/figures/strategise/util";
import {Project} from "../../../../app/models/project";
import {DynamicFormData} from "@reside-ic/vue-dynamic-form";

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
        expect(getInterventionName("irs")).toBe("IRS only");
        expect(getInterventionName("llin-pbo")).toBe("Pyrethroid-PBO ITN only");
        expect(getInterventionName("pyrrole-pbo")).toBe("Pyrethroid-pyrrole ITN only");
        expect(getInterventionName("irs-llin-pbo")).toBe("Pyrethroid-PBO ITN with IRS");
        expect(getInterventionName("llin")).toBe("Pyrethroid-only ITN only");
        expect(getInterventionName("irs-llin")).toBe("Pyrethroid-only ITN with IRS");
        expect(getInterventionName("irs-pyrrole-pbo")).toBe("Pyrethroid-pyrrole ITN with IRS");
    });

    it("gets intervention colour", () => {
        expect(getInterventionColourValue("irs")).toBe("c080c0");
        expect(getInterventionColourValue("llin-pbo")).toBe("bfffea");
        expect(getInterventionColourValue("pyrrole-pbo")).toBe("80b280");
        expect(getInterventionColourValue("irs-llin-pbo")).toBe("ffd280");
        expect(getInterventionColourValue("llin")).toBe("8080ff");
        expect(getInterventionColourValue("irs-llin")).toBe("c58080");
        expect(getInterventionColourValue("irs-pyrrole-pbo")).toBe("99e699");
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