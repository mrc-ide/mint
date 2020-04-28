<template>
    <div class="pt-5">
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import { mapStateProp} from "../utils";
    import {RootState} from "../store";
    import {Data, Graph} from "../generated";
    import plotlyGraph from "./figures/graphs/plotlyGraph.vue";

    export default Vue.extend({
        components: {plotlyGraph},
        props: ["activeTab"],
        computed: {
            prevalenceGraphConfig: mapStateProp<RootState, Graph | null>(state => state.prevalenceGraphConfig),
            prevalenceGraphData: mapStateProp<RootState, Data>(state => state.prevalenceGraphData),
        }
    });

</script>
