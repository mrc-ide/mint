<template>
    <b-table striped :items="items" :fields="fields">
        <template #cell()="data">
            <abbr v-if="data.value.tooltip" :title="data.value.tooltip">{{ data.value.value }}</abbr>
            <template v-else>{{ data.value.value }}</template>
        </template>
    </b-table>
</template>
<script lang="ts">
    import {computed, defineComponent} from "@vue/composition-api";
    import {FilteringProps, useFiltering} from "./filteredData";
    import {useTransformation} from "./transformedData";
    import numeral from "numeral";
    import {evaluate} from "mathjs/number";
    import {ColumnDefinition} from "../../generated";
    import {BTable} from "bootstrap-vue";
    import {getErrorInterval, ErrorInterval} from "./errorInterval";

    interface Props extends FilteringProps {
        config: ColumnDefinition[]
    }

    interface UnformattedCell {
        value: string | number,
        error?: ErrorInterval
    }

    export default defineComponent({
    props: {data: Array, config: Array, settings: Object},
    components: {BTable},
    setup(props: Props) {
        const {filteredData} = useFiltering(props);
        const {evaluateFormula} = useTransformation(props);
        const evaluateCell = (col: ColumnDefinition, row: any): number | string => {
            let value: string | number = "";
            if (!col.valueTransform) {
                value = row[col.valueCol]
            } else if (col.valueTransform[row[col.valueCol]]) {
                value = evaluateFormula(col.valueTransform[row[col.valueCol]], row)
            }
            if (value == Infinity) {
                return "n/a";
            }
            if (typeof value == "string") {
                if (isNaN(parseFloat(value))) {
                    return value;
                }
                value = parseFloat(value);
            }
            if (col.transform) {
                value = evaluate(col.transform.replace(/{}/g, value.toString()));
            }
            return value;
        };
        const formatValue = (col: ColumnDefinition, value: number): string => {
            let formattedValue = value.toString();
            if (col.precision) {
                formattedValue = value.toPrecision(col.precision);
            }
            if (col.format) {
                formattedValue = numeral(formattedValue).format(col.format);
            }
            return formattedValue;
        };
        const fields = props.config.map((col, i) => (
            {
                key: `${col.valueCol}${i}`,
                label: col.displayName,
                sortable: true,
                thClass: "align-middle",
                formatter: (item: UnformattedCell) => {
                    const formatted = typeof item.value === "number" ? formatValue(col, item.value) : item.value;
                    const result: Record<string, string>  = {value: formatted};
                    if (item.error) {
                        result.tooltip = `${formatted} +${formatValue(col, item.error.plus)} / -${formatValue(col, item.error.minus)}`
                    }
                    return result;
                }
            }
        ));
        const items = computed(() => filteredData.value.map((row) =>
            props.config.reduce((items, col, i) => {
                const value = evaluateCell(col, row);
                const item: UnformattedCell = {value};
                if (typeof value === "number" && col.error) {
                    const valuePlus = <number>evaluateCell({...col, ...col.error.plus}, row);
                    const valueMinus = <number>evaluateCell({...col, ...col.error.minus}, row);
                    item.error = getErrorInterval(valueMinus, value, valuePlus);
                }
                return {...items, [`${col.valueCol}${i}`]: item};
            }, {})
        ));
        return {
            fields,
            items
        }
    }
    })
</script>
