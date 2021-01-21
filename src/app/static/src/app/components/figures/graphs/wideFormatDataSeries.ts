import {computed} from "@vue/composition-api";
import {LongFormatMetadata, SeriesDefinition, WideFormatMetadata} from "../../../generated";
import {FilteringProps, useFiltering} from "../filteredData";
import {useTransformation} from "../transformedData";

interface Props extends FilteringProps {
    series: SeriesDefinition[]
    metadata: LongFormatMetadata | WideFormatMetadata
}

export function useWideFormatData(props: Props) {
    const {filteredData} = useFiltering(props);
    const {evaluateFormula} = useTransformation(props);

    const getRow = (id: string) => {
        return filteredData.value.find((row: any) => row[props.metadata.id_col] == id);
    }

    const getErrorBar = (row: any, error: any, y: any[]) => {
        const evaluate = (c: string) => c.match(/\{\w+\}/) ? evaluateFormula(c, row) : row[c];
        const plus = error.cols.map(evaluate);
        const minus = error.colsminus.map(evaluate);
        return {
            ...error,
            array: y.map((e: number, i: number) => Math.max(plus[i], minus[i], e) - e),
            arrayminus: y.map((e: number, i: number) => e - Math.min(plus[i], minus[i] , e))
        };
    };
    const dataSeries: any = computed(() => {
        const meta = props.metadata as WideFormatMetadata;
        const result: any[] = [];
        props.series.forEach((d: SeriesDefinition) => {
            if (d.x && d.y) {
                // all values are given explicitly
                result.push(d);
                return;
            }
            if (d.id) {
                const row = getRow(d.id);
                if (!row) {
                    console.warn(`The data series with id ${d.id} did not match any rows in the provided data`)
                    return;
                }
                const y = d.y_formula
                    ? d.y_formula.map(formula => evaluateFormula(formula, row))
                    : meta.cols!!.map((c: string) => row[c]);
                const def: SeriesDefinition = {...d, y};
                if (d.error_y) {
                    def.error_y = getErrorBar(row, d.error_y, y);
                }
                result.push(def);
                return;
            }
        });
        return result;
    });

    return {dataSeries};
}
