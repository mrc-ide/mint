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

    const getErrorBar = (row: any, error: any) => {
        return {
            ...error,
            array: error.cols.map((c: string) => c.match(/\{\w+\}/) ? evaluateFormula(c, row) : row[c]),
            arrayminus: error.colsminus.map((c: string) => c.match(/\{\w+\}/) ? evaluateFormula(c, row) : row[c])
        }
    }
    const dataSeries = computed(() => {
        const meta = props.metadata as WideFormatMetadata;
        const result: any[] = [];
        props.series.map((d: SeriesDefinition) => {
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
                const error_y = d.error_y && getErrorBar(row, d.error_y)
                const def: SeriesDefinition = {
                    ...d,
                    y: d.y_formula
                        ? d.y_formula.map(formula => evaluateFormula(formula, row))
                        : meta.cols && meta.cols.map((c: string) => row[c])
                }
                if (error_y) {
                    def.error_y = error_y
                }
                result.push(def);
                return;
            }
            return;
        });
        return result;
    });

    return {dataSeries}
}
