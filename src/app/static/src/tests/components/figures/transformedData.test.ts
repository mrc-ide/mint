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

    it("can evaluate formulas with empty and zero settings", () => {

        const props = {
            settings: {
                "irsUse": 1.5,
                "netUse": 1.5,
                "zero": 0,
                "zeroStr": "0",
                "empty": ""
            }
        }

        const evaluateFormula = useTransformation(props).evaluateFormula;
        expect(evaluateFormula("{irsUse} + {netUse} + {zero} + {zeroStr} + {empty}")).toBe(3);
    });

    it("can evaluate formulas with no settings", () => {

        const props = {
            settings: null
        }

        const evaluateFormula = useTransformation(props).evaluateFormula;
        expect(evaluateFormula("1 + 2")).toBe(3);
    });

    it("logs details if cannot transform formula", () => {
        const consoleSpy = jest.spyOn(console, "log");
        const props = {
            settings: {
                "irsUse": 1.5,
                "netUse": "nonsense"
            }
        }

        expect(() => useTransformation(props).evaluateFormula("{irsUse} + {netUse}"))
            .toThrowError("Undefined symbol nonsense");
        expect(consoleSpy)
            .toHaveBeenCalledWith("Unable to evaluate formula: \"{irsUse} + {netUse}\" which resolved to: 1.5 + nonsense");
    });
});
