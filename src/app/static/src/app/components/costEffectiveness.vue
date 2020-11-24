<template>
    <div>
        <plotly-graph v-if="activeTab === 'Graphs' && efficacyGraphConfig"
                      :layout="efficacyGraphConfig.layout"
                      :metadata="efficacyGraphConfig.metadata"
                      :series="efficacyGraphConfig.series"
                      :data="tableData"
                      :settings="settings"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && casesAvertedGraphConfig"
                      :layout="casesAvertedGraphConfig.layout"
                      :metadata="casesAvertedGraphConfig.metadata"
                      :series="casesAvertedGraphConfig.series"
                      :data="tableData"
                      :settings="settings"></plotly-graph>

        <dynamic-table v-if="activeTab === 'Table' && tableConfig"
                       :data="tableData"
                       :config="tableConfig"
                       :settings="settings"></dynamic-table>
        <collapsible-docs :docs="docs"></collapsible-docs>
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
    import collapsibleDocs from "./collapsibleDocs.vue";

    interface Computed {
        settings: DynamicFormData | null,
        currentProject: Project | null,
        efficacyGraphConfig: Graph,
        casesAvertedGraphConfig: Graph,
        tableData: Data,
        tableConfig: TableDefinition | null
        docs: string
    }

    export default Vue.extend<{}, {}, Computed, {}>({
        components: {plotlyGraph, dynamicTable, collapsibleDocs},
        props: ["activeTab"],
        computed: {
            settings: mapStateProp<RootState, DynamicFormData | null>
            (state => state.currentProject && {
                ...state.currentProject.currentRegion.interventionSettings,
                ...state.currentProject.currentRegion.baselineSettings
            }),
            currentProject: mapStateProp<RootState, Project | null>(state => state.currentProject),
            efficacyGraphConfig: mapStateProp<RootState, Graph | null>(state => state.costEfficacyGraphConfig),
            casesAvertedGraphConfig: mapStateProp<RootState, Graph | null>(state => state.costCasesGraphConfig),
            tableConfig: mapStateProp<RootState, TableDefinition | null>(state => state.costTableConfig),
            docs: mapStateProp<RootState, string>(state => state.costDocs),
            tableData() {
                return this.currentProject ? this.currentProject.currentRegion.tableData : [];
            }
        }
    });
</script>
