import {evaluate} from "mathjs";
import {Dictionary} from "vue-router/types/router";

export interface TransformationProps {
    settings: Dictionary<string> | null
}

export function useTransformation(props: TransformationProps) {
    const evaluateFormula = (formula: string) => {
        let interpolatedFormula = formula;
        if (props.settings) {
            interpolatedFormula = formula.replace(/\{([^}]+)\}/g,
                (match) => props.settings!![match.replace(/\{|\}/g, "")]);
        }
        return Math.round(evaluate(interpolatedFormula));
    };
    return {evaluateFormula}
}
