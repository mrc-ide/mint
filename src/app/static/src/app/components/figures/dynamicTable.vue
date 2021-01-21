<template>
    <b-table striped :items="items" :fields="fields">
        <template #cell()="data">
            <abbr v-if="data.value.tooltip" :title="data.value.tooltip">{{ data.value.text }}</abbr>
            <template v-else>{{ data.value.text }}</template>
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

    interface Props extends FilteringProps {
        config: ColumnDefinition[]
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
            const formatCell = (col: ColumnDefinition, value: number): string => {
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
                    thClass: "align-middle"
                }
            ));
            const items = computed(() => filteredData.value.map((row) =>
                props.config.reduce((items, col, i) => {
                    const value = evaluateCell(col, row);
                    const item: Record<string, string> = {};
                    item.text = typeof value === "number" ? formatCell(col, value) : value;
                    if (typeof value === "number" && col.error) {
                        const valuePlus = <number>evaluateCell({...col, ...col.error.plus}, row);
                        const valueMinus = <number>evaluateCell({...col, ...col.error.minus}, row);
                        item.tooltip = `${item.text} +${formatCell(col, valuePlus)} / -${formatCell(col, valueMinus)}`
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
