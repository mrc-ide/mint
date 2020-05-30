<template>
    <div class="plotly-horizontal-errors">
        <plotly-graph v-if="activeTab === 'Graphs' && casesAvertedGraphConfig"
                      :layout="casesAvertedGraphConfig.layout"
                      :metadata="casesAvertedGraphConfig.metadata"
                      :series="casesAvertedGraphConfig.series"
                      :data="graphData"></plotly-graph>

        <dynamic-table v-if="activeTab === 'Table' && tableConfig"
                       :data="tableData"
                       :columns="tableConfig"
                       :settings="settings"></dynamic-table>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {Project} from "../models/project";
    import {Data, Graph, TableDefinition} from "../generated";
    import plotlyGraph from "./figures/graphs/plotlyGraph.vue";
    import {mapStateProp} from "../utils";
    import {RootState} from "../store";
    import {DynamicFormData} from "@reside-ic/vue-dynamic-form";
    import dynamicTable from "./figures/dynamicTable.vue";

    interface Computed {
        settings: DynamicFormData | null,
        currentProject: Project | null,
        graphData: Data,
        casesAvertedGraphConfig: Graph,
        tableData: Data,
        tableConfig: TableDefinition | null
    }

    export default Vue.extend<{}, {}, Computed, {}>({
        components: {plotlyGraph, dynamicTable},
        props: ["activeTab"],
        computed: {
            settings: mapStateProp<RootState, DynamicFormData | null>
            (state => state.currentProject && state.currentProject.currentRegion.interventionSettings),
            currentProject: mapStateProp<RootState, Project | null>(state => state.currentProject),
            casesAvertedGraphConfig: mapStateProp<RootState, Graph | null>(state => state.costCasesGraphConfig),
            graphData() {
                return this.currentProject ? this.currentProject.currentRegion.costGraphData : [];
            },
            tableConfig: mapStateProp<RootState, TableDefinition | null>(state => state.costTableConfig),
            tableData() {
                return this.currentProject ? this.currentProject.currentRegion.costTableData : [];
            }
        }
    });
</script>
