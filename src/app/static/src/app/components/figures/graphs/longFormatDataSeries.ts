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
        const meta = props.metadata as LongFormatMetadata
        filteredData.value.map((row: any) => {
            if (row[meta.id_col] == definition.id) {
                x.push(row[meta.x_col])
                y.push(row[meta.y_col])
            }
        });
        return [x, y]
    }

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
                result.push({
                    ...d,
                    x: rows[0],
                    y: rows[1]
                });
                return;
            }
            return;
        });
        return result;
    });

    return {dataSeries}
}
