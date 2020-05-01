<template>
    <div class="p-5">
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData"
                      :settings="settings"></plotly-graph>

        <dynamic-table v-if="activeTab === 'Table' && tableConfig"
                       :data="tableData"
                       :columns="tableConfig"
                       :settings="settings"></dynamic-table>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {mapStateProp} from "../utils";
    import {RootState} from "../store";
    import {Data, Graph, TableDefinition} from "../generated";
    import plotlyGraph from "./figures/graphs/plotlyGraph.vue";
    import dynamicTable from "./figures/dynamicTable.vue";
    import {DynamicFormData} from "@reside-ic/vue-dynamic-form";

    export default Vue.extend({
        components: {plotlyGraph, dynamicTable},
        props: ["activeTab"],
        computed: {
            settings: mapStateProp<RootState, DynamicFormData | null>
            (state => state.currentProject && state.currentProject.currentRegion.interventionSettings),
            prevalenceGraphConfig: mapStateProp<RootState, Graph | null>(state => state.prevalenceGraphConfig),
            prevalenceGraphData: mapStateProp<RootState, Data>(state => state.prevalenceGraphData),
            tableData: mapStateProp<RootState, Data>(state => state.impactTableData),
            tableConfig: mapStateProp<RootState, TableDefinition | null>(state => state.impactTableConfig)
        }
    });

</script>
