// https://mathjs.org/docs/custom_bundling.html#numbers-only
import {evaluate} from "mathjs/number";
import {Dictionary} from "vue-router/types/router";

export interface TransformationProps {
    settings: Dictionary<string | number> | null
}

export function useTransformation(props: TransformationProps) {
    const evaluateFormula = (formula: string, row: any | null = null) => {
        const interpolatedFormula = formula.replace(/\{([^}]+)\}/g,
            (match) => {
                const id = match.replace(/\{|\}/g, "");
                let val;
                if (props.settings && id in props.settings) {
                    val = props.settings[id].toString();

                    // Default to 0 if text is cleared from numeric
                    if (val === "") {
                        val = "0";
                    }
                }
                if (!val && row) {
                    val = row[id]
                }

                return val;
            });
        try {
            return evaluate(interpolatedFormula);
        } catch (e) {
            console.log(`Unable to evaluate formula: "${formula}" which resolved to: ${interpolatedFormula}`);
            throw e;
        }
    };
    return {evaluateFormula}
}
