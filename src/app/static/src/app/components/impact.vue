<template>
    <div>
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
    import {Project} from "../models/project";

    interface Computed {
        prevalenceGraphConfig: Graph | null,
        tableConfig: TableDefinition | null,
        currentProject: Project | null,
        prevalenceGraphData: Data,
        tableData: Data,
        settings: DynamicFormData | null
    }

    export default Vue.extend<{}, {}, Computed, {}>({
        components: {plotlyGraph, dynamicTable},
        props: ["activeTab"],
        computed: {
            settings: mapStateProp<RootState, DynamicFormData | null>
                (state => state.currentProject && state.currentProject.currentRegion.interventionSettings),
            prevalenceGraphConfig: mapStateProp<RootState, Graph | null>(state => state.prevalenceGraphConfig),
            tableConfig: mapStateProp<RootState, TableDefinition | null>(state => state.impactTableConfig),
            currentProject: mapStateProp<RootState, Project | null>(state => state.currentProject),
            prevalenceGraphData() {
                return this.currentProject ? this.currentProject.currentRegion.prevalenceGraphData : [];
            },
            tableData() {
                return this.currentProject ? this.currentProject.currentRegion.impactTableData : [];
            }
        }
    });

</script>
