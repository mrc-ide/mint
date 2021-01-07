import {TransformationProps, useTransformation} from "../transformedData";
import {Dictionary} from "vue-router/types/router";
import {deepCopy} from "../../../utils";

interface Props extends TransformationProps {
    layout: Dictionary<any>
}

export function useLayout(props: Props) {
    const layout = deepCopy(props.layout);
    const {evaluateFormula} = useTransformation(props);

    // Currently supports transformation to horizontal line only
    if (layout.shapes) {
        layout.shapes.map((shape: any) => {
            if (shape.type == "line" && shape.y_formula) {
                const y = evaluateFormula(shape.y_formula);
                shape.y0 = y;
                shape.y1 = y;
            }
        });
    }
    return layout;
}
