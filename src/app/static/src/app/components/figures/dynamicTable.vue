<template>
    <table class="table table-responsive">
        <thead class="thead-light">
        <tr>
            <th scope="col" v-for="key in Object.keys(columns)">{{columns[key]}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in filteredData">
            <td v-for="key in Object.keys(columns)">
                {{row[key]}}
            </td>
        </tr>
        </tbody>
    </table>
</template>
<script lang="ts">
    import {defineComponent} from "@vue/composition-api";
    import {FilteringProps, useFiltering} from "./filteredData";
    import {TableDefinition} from "../../generated";

    interface Props extends FilteringProps {
        columns: TableDefinition
    }
    
    export default defineComponent({
        props: {data: Array, columns: Object, settings: Object},
        setup(props: Props) {
            const {filteredData} = useFiltering(props)
            return {
                filteredData
            }
        }
    })
</script>