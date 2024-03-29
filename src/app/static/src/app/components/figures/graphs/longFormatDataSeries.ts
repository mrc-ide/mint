import {computed} from "@vue/composition-api";
import {FilteringProps, useFiltering} from "../filteredData";
import {LongFormatMetadata, SeriesDefinition, WideFormatMetadata} from "../../../generated";
import {useTransformation} from "../transformedData";
import {getErrorInterval} from "../errorInterval";

interface Props extends FilteringProps {
    series: SeriesDefinition[]
    metadata: LongFormatMetadata | WideFormatMetadata
}

export function useLongFormatData(props: Props) {
    const {filteredData} = useFiltering(props);
    const {evaluateFormula} = useTransformation(props);
    const getRows = (definition: SeriesDefinition) => {
        const x = [] as any[];
        let y = [] as any[];
        const meta = props.metadata as LongFormatMetadata;

        const error_col = definition.error_x ? definition.error_x.col : null;
        const error_col_minus = definition.error_x ? definition.error_x.colminus : null;

        const error_cols = definition.error_x ? definition.error_x.cols : null;
        const error_cols_minus = definition.error_x ? definition.error_x.colsminus : null;

        const error_array = [] as any[];

        filteredData.value.map((row: any) => {
            if (row[meta.id_col] == definition.id) {
                let xForRow: any[] = [];
                if (meta.x_formula) {  // NB x_formula is at metadata leve
                    xForRow = meta.x_formula.map((formula) => evaluateFormula(formula, row));
                } else if (meta.x_col) {
                    xForRow.push(row[meta.x_col]);
                }
                x.push(...xForRow);

                if (meta.y_col) {
                    y.push(row[meta.y_col]);
                }

                // If using column values for error
                if (error_col && error_col_minus) {
                    error_array.push(getErrorInterval(row[error_col_minus], xForRow[0], row[error_col]));
                }

                // If calculating error
                if (error_cols && error_cols_minus) {
                    xForRow.forEach((central: number, i: number) => {
                        const interval = getErrorInterval(evaluateFormula(error_cols_minus[i], row), central, evaluateFormula(error_cols[i], row))
                        error_array.push(interval);
                    });
                }
            }
        });

        if (definition.y_formula) { // NB y_formula is at series definition level, and cannot include row data
            y = definition.y_formula.map(evaluateFormula);
        }

        const result = [x, y];
        if (error_array.length) {
            result.push(error_array.map(e => e.plus));
            result.push(error_array.map(e => e.minus));
        }

        return result;
    };

    const dataSeries = computed(() => {
        const result: SeriesDefinition[] = []
        props.series.map((d: SeriesDefinition) => {
            if (d.x && d.y) {
                // all values are given explicitly
                result.push(d);
                return;
            }
            if (d.id) {
                const rows = getRows(d);
                if (rows[0].length == 0) {
                    console.warn(`The data series with id ${d.id} did not match any rows in the provided data`)
                    return null;

                }

                const dataSeries = {
                    ...d,
                    x: rows[0],
                    y: rows[1]
                };

                if (d.error_x) {
                    (dataSeries as any).error_x = {
                        ...d.error_x,
                        array: rows[2],
                        arrayminus: rows[3]
                    }
                }

                result.push(dataSeries);
                return;
            }
            return;
        });
        return result;
    });

    return {dataSeries}
}
