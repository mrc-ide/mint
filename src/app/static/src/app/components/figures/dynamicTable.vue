<template>
    <b-table striped :items="items" :fields="fields"></b-table>
</template>
<script lang="ts">
    import {defineComponent} from "@vue/composition-api";
    import {FilteringProps, useFiltering} from "./filteredData";
    import {useTransformation} from "./transformedData";
    import numeral from "numeral";
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
                if (col.precision) {
                    value = value.toPrecision(col.precision)
                }
                if (col.format) {
                    value = numeral(value).format(col.format)
                }
                return value;
            };
            return {
                fields: props.config.map((col, i) => (
                    {
                        key: `${col.valueCol}${i}`,
                        label: col.displayName,
                        sortable: true,
                        thClass: "align-middle"
                    }
                )),
                items:  filteredData.value.map((row) =>
                    props.config.reduce((item, col, i) => (
                        {
                            ...item,
                            [`${col.valueCol}${i}`]: evaluateCell(col, row)
                        }
                    ), {})
                )
            }
        }
    })
</script>
