import {computed} from "@vue/composition-api";
import {LongFormatSeriesMetadata, SeriesDefinition, SeriesMetadata} from "./types";
import {FilteringProps, useFiltering} from "./filteredData";

interface Props extends FilteringProps {
    series: SeriesDefinition[]
    metadata: SeriesMetadata
}

export function useLongFormatData(props: Props) {
    const {filteredData} = useFiltering(props)
    const getRows = (definition: SeriesDefinition) => {
        const x = [] as any[];
        const y = [] as any[];
        const meta = props.metadata as LongFormatSeriesMetadata
        filteredData.value.map((row: any) => {
            if (row[meta.id_col] == definition.id) {
                x.push(row[meta.x_col])
                y.push(row[meta.y_col])
            }
        });
        return [x, y]
    }

    const dataSeries = computed(() => {
        return props.series.map((d: SeriesDefinition) => {
            if (d.x && d.y) {
                // all values are given explicitly
                return d
            }
            if (d.id) {
                const rows = getRows(d);
                return {
                    ...d,
                    x: rows[0],
                    y: rows[1]
                }
            }
            // ignore invalid definitions
            return null
        });
    });

    return {dataSeries}
}
