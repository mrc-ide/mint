import {computed} from "@vue/composition-api";
import {SeriesDefinition, SeriesMetadata, WideFormatSeriesMetadata} from "./types";
import {FilteringProps, useFiltering} from "./filteredData";

interface Props extends FilteringProps {
    series: SeriesDefinition[]
    metadata: SeriesMetadata
}

export function useWideFormatData(props: Props) {
    const {filteredData} = useFiltering(props)
    const getRow = (id: string) => {
        return filteredData.value.find((row: any) => row[props.metadata.id_col] == id);
    }

    const getErrorBar = (row: any, error: any) => {
        return {
            ...error,
            array: error.cols.map((c: string) => row[c]),
            arrayminus: error.colsminus.map((c: string) => row[c])
        }
    }
    const dataSeries = computed(() => {
        const meta = props.metadata as WideFormatSeriesMetadata
        return props.series.map((d: SeriesDefinition) => {
            if (d.x && d.y) {
                // all values are given explicitly
                return d
            }
            if (d.id) {
                const row = getRow(d.id);
                return {
                    ...d,
                    y: meta.cols.map((c: string) => row[c]),
                    error_y: d.error_y && getErrorBar(row, d.error_y)
                }
            }
            // ignore invalid definitions
            return null
        });
    });

    return {dataSeries}
}