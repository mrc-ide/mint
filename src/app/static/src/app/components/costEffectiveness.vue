<template>
    <div>
        <plotly-graph v-if="activeTab === 'Graphs' && efficacyGraphConfig"
                      :layout="efficacyGraphConfig.layout"
                      :metadata="efficacyGraphConfig.metadata"
                      :series="efficacyGraphConfig.series"
                      :data="graphData"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && casesAvertedGraphConfig"
                      :layout="casesAvertedGraphConfig.layout"
                      :metadata="casesAvertedGraphConfig.metadata"
                      :series="casesAvertedGraphConfig.series"
                      :data="graphData"></plotly-graph>

        <div v-if="activeTab === 'Table'">
            Cost effectiveness table
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {Project} from "../models/project";
    import {Data, Graph} from "../generated";
    import plotlyGraph from "./figures/graphs/plotlyGraph.vue";
    import {mapStateProp} from "../utils";
    import {RootState} from "../store";

    interface Computed {
        currentProject: Project | null,
        graphData: Data,
        efficacyGraphConfig: Graph,
        casesAvertedGraphConfig: Graph,
    }

    export default Vue.extend<{}, {}, Computed, {}>({
        components: {plotlyGraph},
        props: ["activeTab"],
        computed: {
            currentProject: mapStateProp<RootState, Project | null>(state => state.currentProject),
            efficacyGraphConfig: mapStateProp<RootState, Graph | null>(state => state.costEfficacyGraphConfig),
            casesAvertedGraphConfig: mapStateProp<RootState, Graph | null>(state => state.costCasesGraphConfig),
            graphData() {
                return this.currentProject ? this.currentProject.currentRegion.costGraphData : [];
            }
        }
    });
</script>
