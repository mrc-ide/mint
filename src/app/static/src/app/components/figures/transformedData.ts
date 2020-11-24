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
                let val = "";
                if (props.settings) {
                    val = props.settings[id] as string;
                }
                if (!val && row) {
                    val = row[id]
                }
                return val
            });
        return evaluate(interpolatedFormula);
    };
    return {evaluateFormula}
}
