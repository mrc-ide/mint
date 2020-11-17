<template>
    <table>
        <thead>
        <tr>
            <th v-for="col in config">{{col.displayName}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in filteredData">
            <td v-for="col in config">
                <span>{{evaluateCell(col, row)}}</span>
            </td>
        </tr>
        </tbody>
    </table>
</template>
<script lang="ts">
    import {defineComponent} from "@vue/composition-api";
    import {FilteringProps, useFiltering} from "./filteredData";
    import {useTransformation} from "./transformedData";
    import {Dictionary} from "vue-router/types/router";
    import numeral from "numeral";

    // TODO should come from mintr generated types
    interface ColumnDefinition {
        displayName: string
        valueCol: string
        valueTransform?: Dictionary<string>
        format?: string
    }

    interface Props extends FilteringProps {
        config: ColumnDefinition[]
    }

    export default defineComponent({
        props: {data: Array, config: Array, settings: Object},
        setup(props: Props) {
            const {filteredData} = useFiltering(props);
            const {evaluateFormula} = useTransformation(props);
            const evaluateCell = (col: ColumnDefinition, row: any) => {
                let value: string | number = "";
                if (!col.valueTransform) {
                    value = row[col.valueCol]
                } else if (col.valueTransform[row[col.valueCol]]) {
                    value = evaluateFormula(col.valueTransform[row[col.valueCol]])
                }
                if (col.format) {
                    value = numeral(value).format(col.format)
                }
                return value;
            };
            return {
                filteredData,
                evaluateCell
            }
        }
    })
</script>
