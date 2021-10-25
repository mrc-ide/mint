<template>
    <div>
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData"
                      :settings="settings"></plotly-graph>

        <plotly-graph v-if="activeTab === 'Graphs' && casesGraphConfig"
                      :layout="casesGraphConfig.layout"
                      :metadata="casesGraphConfig.metadata"
                      :series="casesGraphConfig.series"
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
    import {mapStateProp} from "../utils";
    import {RootState} from "../store";
    import {Data, Graph, TableDefinition} from "../generated";
    import plotlyGraph from "./figures/graphs/plotlyGraph.vue";
    import dynamicTable from "./figures/dynamicTable.vue";
    import {DynamicFormData} from "@reside-ic/vue-dynamic-form";
    import {Project} from "../models/project";
    import collapsibleDocs from "./collapsibleDocs.vue";

    interface Computed {
        prevalenceGraphConfig: Graph | null,
        casesGraphConfig: Graph | null,
        tableConfig: TableDefinition | null,
        currentProject: Project | null,
        prevalenceGraphData: Data,
        tableData: Data,
        settings: DynamicFormData | null
        docs: string,
    }

    export default Vue.extend<Record<string, never>, Record<string, never>, Computed, "activeTab">({
    components: {
        plotlyGraph,
        dynamicTable,
        collapsibleDocs
    },
    props: ["activeTab"],
    computed: {
        settings: mapStateProp<RootState, DynamicFormData | null>
        (state => state.currentProject && state.currentProject.currentRegion.interventionSettings),
        prevalenceGraphConfig: mapStateProp<RootState, Graph | null>(state => state.prevalenceGraphConfig),
        casesGraphConfig: mapStateProp<RootState, Graph | null>(state => state.casesGraphConfig),
        tableConfig: mapStateProp<RootState, TableDefinition | null>(state => state.impactTableConfig),
        currentProject: mapStateProp<RootState, Project | null>(state => state.currentProject),
        docs: mapStateProp<RootState, string>(state => state.impactDocs),
        prevalenceGraphData() {
            return this.currentProject ? this.currentProject.currentRegion.prevalenceGraphData : [];
        },
        tableData() {
            return this.currentProject ? this.currentProject.currentRegion.tableData : [];
        }
    }
    });

</script>
