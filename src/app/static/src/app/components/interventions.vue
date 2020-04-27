<template>
    <vertical-tabs :tabs="tabs" @tab-selected="changeTab">
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData"
                      :settings="{}"></plotly-graph>
    </vertical-tabs>
</template>
<script lang="ts">
    import Vue from "vue";
    import verticalTabs from "./verticalTabs.vue";
    import {Tab} from "../types";
    import plotlyGraph from "./figures/plotlyGraph.vue";
    import {Data, Graph} from "../generated";
    import {mapActionByName, mapStateProp} from "../utils";
    import {RootState} from "../store";
    import {RootAction} from "../actions";

    interface ComponentData {
        tabs: Tab[],
        activeTab: string
    }

    interface Methods {
        changeTab: (name: string) => void
        getGraphData: () => void
        getGraphConfig: () => void
    }

    interface Computed {
        prevalenceGraphData: Data
        prevalenceGraphConfig: Graph | null
    }

    export default Vue.extend<ComponentData, Methods, Computed, {}>({
        data() {
            return {
                tabs: [{name: "Table", active: false}, {name: "Graphs", active: true}],
                activeTab: "Graphs"
            }
        },
        computed: {
            prevalenceGraphConfig: mapStateProp<RootState, Graph | null>(state => state.prevalenceGraphConfig),
            prevalenceGraphData: mapStateProp<RootState, Data>(state => state.prevalenceGraphData),
        },
        methods: {
            changeTab(name: string) {
                this.tabs = this.tabs.map(t => ({...t, active: false}))
                this.tabs.find(t => t.name == name)!!.active = true;
                this.activeTab = name;
            },
            getGraphData: mapActionByName(RootAction.FetchPrevalenceGraphData),
            getGraphConfig: mapActionByName(RootAction.FetchPrevalenceGraphConfig)
        },
        components: {verticalTabs, plotlyGraph},
        mounted() {
            this.getGraphConfig();
            this.getGraphData();
        }
    });

</script>
