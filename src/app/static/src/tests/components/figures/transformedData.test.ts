import {useTransformation} from "../../../app/components/figures/transformedData";

describe("use transformation", () => {

    it("can evaluate formulas with interpolated settings", () => {

        const props = {
            settings: {
                "irsUse": 1.5,
                "netUse": 1.5
            }
        }

        const evaluateFormula = useTransformation(props).evaluateFormula;
        expect(evaluateFormula("{irsUse} + {netUse}")).toBe(3);
    });

    it("can evaluate formulas with no settings", () => {

        const props = {
            settings: null
        }

        const evaluateFormula = useTransformation(props).evaluateFormula;
        expect(evaluateFormula("1 + 2")).toBe(3);
    });

});
