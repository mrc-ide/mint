<template>
    <div class="pt-5">
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
    import { mapStateProp} from "../utils";
    import {RootState} from "../store";
    import {Data, Graph, TableDefinition} from "../generated";
    import plotlyGraph from "./figures/graphs/plotlyGraph.vue";
    import dynamicTable from "./figures/dynamicTable.vue";

    export default Vue.extend({
        components: {plotlyGraph, dynamicTable},
        props: ["activeTab"],
        data() {
            return {
                settings: {'net_use': 0, 'irs_use': 0}
            }
        },
        computed: {
            prevalenceGraphConfig: mapStateProp<RootState, Graph | null>(state => state.prevalenceGraphConfig),
            prevalenceGraphData: mapStateProp<RootState, Data>(state => state.prevalenceGraphData),
            tableData: mapStateProp<RootState, Data>(state => state.impactTableData),
            tableConfig: mapStateProp<RootState, TableDefinition | null>(state => state.impactTableConfig)
        }
    });

</script>
