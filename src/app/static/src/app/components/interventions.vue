<template>
    <vertical-tabs :tabs="tabs" @tab-selected="changeTab">
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
    </vertical-tabs>
</template>
<script lang="ts">
    import Vue from "vue";
    import verticalTabs from "./verticalTabs.vue";
    import {Tab} from "../types";
    import plotlyGraph from "./figures/graphs/plotlyGraph.vue";
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
            // prevalenceGraphData() {
            //     return [{"month": 0, "intervention": "ITN", "net_use": 0, "irs_use": 0, "value": 0.2315}, {
            //         "month": 0,
            //         "intervention": "none",
            //         "net_use": 0,
            //         "irs_use": 0.6,
            //         "value": 0.0168
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0, "irs_use": 0.7, "value": 0.7949}, {
            //         "month": 0,
            //         "intervention": "none",
            //         "net_use": 0,
            //         "irs_use": 0.8,
            //         "value": 0.7508
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0, "irs_use": 0.9, "value": 0.5171}, {
            //         "month": 0,
            //         "intervention": "ITN",
            //         "net_use": 0,
            //         "irs_use": 1,
            //         "value": 0.6902
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0.1, "irs_use": 0, "value": 0.2928}, {
            //         "month": 0,
            //         "intervention": "ITN",
            //         "net_use": 0.1,
            //         "irs_use": 0.6,
            //         "value": 0.4237
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0.1, "irs_use": 0.7, "value": 0.8248}, {
            //         "month": 0,
            //         "intervention": "ITN",
            //         "net_use": 0.1,
            //         "irs_use": 0.8,
            //         "value": 0.9728
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0.1, "irs_use": 0.9, "value": 0.2143}, {
            //         "month": 0,
            //         "intervention": "none",
            //         "net_use": 0.1,
            //         "irs_use": 1,
            //         "value": 0.3129
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0.2, "irs_use": 0, "value": 0.7696}, {
            //         "month": 0,
            //         "intervention": "none",
            //         "net_use": 0.2,
            //         "irs_use": 0.6,
            //         "value": 0.2612
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0.2, "irs_use": 0.7, "value": 0.3359}, {
            //         "month": 0,
            //         "intervention": "none",
            //         "net_use": 0.2,
            //         "irs_use": 0.8,
            //         "value": 0.0214
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0.2, "irs_use": 0.9, "value": 0.0592}, {
            //         "month": 0,
            //         "intervention": "none",
            //         "net_use": 0.2,
            //         "irs_use": 1,
            //         "value": 0.7332
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0.3, "irs_use": 0, "value": 0.9185}, {
            //         "month": 0,
            //         "intervention": "ITN",
            //         "net_use": 0.3,
            //         "irs_use": 0.6,
            //         "value": 0.3731
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0.3, "irs_use": 0.7, "value": 0.3723}, {
            //         "month": 0,
            //         "intervention": "noITNne",
            //         "net_use": 0.3,
            //         "irs_use": 0.8,
            //         "value": 0.0365
            //     }, {"month": 0, "intervention": "none", "net_use": 0.3, "irs_use": 0.9, "value": 0.0652}, {
            //         "month": 0,
            //         "intervention": "ITN",
            //         "net_use": 0.3,
            //         "irs_use": 1,
            //         "value": 0.6332
            //     }, {"month": 0, "intervention": "ITN", "net_use": 0.4, "irs_use": 0, "value": 0.6317}, {
            //         "month": 0,
            //         "intervention": "ITN",
            //         "net_use": 0.4,
            //         "irs_use": 0.6,
            //         "value": 0.2042
            //     }]
            // }
        },
        methods: {
            changeTab(name: string) {
                this.tabs = this.tabs.map(t => ({...t, active: false}))
                this.tabs.find(t => t.name == name)!!.active = true;
                this.activeTab = name;
            },
            getGraphData: mapActionByName(RootAction.FetchPrevalenceGraphData)
        },
        components: {verticalTabs, plotlyGraph},
        mounted() {
            this.getGraphData();
        }
    });

</script>
