<template>
    <div>
        <plotly-graph v-if="activeTab === 'Graphs' && casesAvertedGraphConfig"
                      :layout="casesAvertedGraphConfig.layout"
                      :metadata="casesAvertedGraphConfig.metadata"
                      :series="casesAvertedGraphConfig.series"
                      :data="graphData"
                      :settings="settings"></plotly-graph>

        <div v-if="activeTab === 'Table'">
            Cost effectiveness table
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {Project} from "../models/project";
    import {Data, Graph, TableDefinition} from "../generated";
    import plotlyGraph from "./figures/graphs/plotlyGraph.vue";
    import {mapStateProp} from "../utils";
    import {RootState} from "../store";

    interface Computed {
        currentProject: Project | null,
        graphData: Data,
        casesAvertedGraphConfig: Graph
    }

    export default Vue.extend<{}, {}, Computed, {}>({
        components: {plotlyGraph},
        props: ["activeTab"],
        data() {
            return {
                settings: {'net_use': 0, 'irs_use': 0}
            }
        },
        computed: {
            currentProject: mapStateProp<RootState, Project | null>(state => state.currentProject),
            casesAvertedGraphConfig: mapStateProp<RootState, Graph | null>(state => state.costCasesGraphConfig),
            graphData() {
                return this.currentProject ? this.currentProject.currentRegion.costGraphData : [];
            }
        }
    });
</script>
