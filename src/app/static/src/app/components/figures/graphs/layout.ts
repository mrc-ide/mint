import {TransformationProps, useTransformation} from "../transformedData";
import {deepCopy} from "../../../utils";
import {Axis, Layout, SeriesDefinition} from "../../../generated";

interface Props extends TransformationProps {
    layout: Layout
}

export function useLayout(props: Props, dataSeries: readonly SeriesDefinition[]) {
    const layout = deepCopy(props.layout);

    evaluateShapes(layout, props);
    evaluateRanges(layout, dataSeries);

    return layout;
}

function evaluateShapes(layout: Layout, props: Props) {
    const {evaluateFormula} = useTransformation(props);
    // Currently supports transformation to horizontal line only
    if (layout.shapes) {
        const toRemove: number[] = [];
        layout.shapes.map((shape: any, index: number) => {
            if (shape.type == "line" && shape.y_formula) {
                const y = evaluateFormula(shape.y_formula);
                if (typeof y === "undefined") {
                    toRemove.push(index)
                } else {
                    shape.y0 = y;
                    shape.y1 = y;
                }
            }
        });

        toRemove.reverse().map((i: number) => {layout.shapes!!.splice(i, 1);});
    }
}

function evaluateRanges(layout: Layout, dataSeries: readonly SeriesDefinition[]) {
    //Support custom rangemode 'series' which maps to a fixed range from 0 (or less if in data)
    //to max series value (exclude shapes)

    const evaluateRangeForAxis = function(axis: Axis | undefined, dataKey: string) {
        if (axis && axis.rangemode === "series") {
            axis.autorange = false;

            const data: number[] = [];
            dataSeries.map((series: SeriesDefinition) => {
                if (series[dataKey]) {
                    data.push(...series[dataKey]);
                }
            });

            const min = Math.min(0, ...data);
            let max = Math.max(...data);
            max += (max-min) / 50; // pad 2% so markers can be seen

            axis.range = [min, max];
        }
    };

    evaluateRangeForAxis(layout.xaxis, "x");
    evaluateRangeForAxis(layout.yaxis, "y");
}
