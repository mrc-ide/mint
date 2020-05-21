import {computed} from "@vue/composition-api";
import {FilteringProps, useFiltering} from "../filteredData";
import {LongFormatMetadata, SeriesDefinition, WideFormatMetadata} from "../../../generated";

interface Props extends FilteringProps {
    series: SeriesDefinition[]
    metadata: LongFormatMetadata | WideFormatMetadata
}

export function useLongFormatData(props: Props) {
    const {filteredData} = useFiltering(props)
    const getRows = (definition: SeriesDefinition) => {
        const x = [] as any[];
        const y = [] as any[];
        const meta = props.metadata as LongFormatMetadata;

        const error_cols = definition.error_x ? definition.error_x.cols : null;
        const error_cols_minus = definition.error_x ? definition.error_x.colsminus : null;
        const error_array = [] as any;
        const error_array_minus = [] as any;

        filteredData.value.map((row: any) => {
            if (row[meta.id_col] == definition.id) {
                x.push(row[meta.x_col]);
                y.push(row[meta.y_col]);

                if (error_cols && error_cols_minus) {
                    error_array.push(row[error_cols]);
                    error_array_minus.push(row[error_cols_minus]);
                }
            }
        });

        const result =  [x, y];
        if (error_array.length) {
            result.push(error_array);
            result.push(error_array_minus);
        }

        return result;
    };

    const dataSeries = computed(() => {
        const result: any[] = []
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
