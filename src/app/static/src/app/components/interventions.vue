<template>
    <vertical-tabs :tabs="tabs" @tab-selected="changeTab">
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData1"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData2"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData3"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData4"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData5"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData6"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData7"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData8"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData9"
                      :settings="{'net_use': 0, 'irs_use': 0}"></plotly-graph>
        <plotly-graph v-if="activeTab === 'Graphs' && prevalenceGraphConfig"
                      :layout="prevalenceGraphConfig.layout"
                      :metadata="prevalenceGraphConfig.metadata"
                      :series="prevalenceGraphConfig.series"
                      :data="prevalenceGraphData10"
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
    import {Region} from "../models/project";

    interface ComponentData {
        tabs: Tab[],
        activeTab: string
    }

    interface Methods {
        changeTab: (name: string) => void
        getGraphData: () => void
    }

    interface Computed {
        currentRegion: Region
        prevalenceGraphData1: Data
        prevalenceGraphData2: Data
        prevalenceGraphData3: Data
        prevalenceGraphData4: Data
        prevalenceGraphData5: Data
        prevalenceGraphData6: Data
        prevalenceGraphData7: Data
        prevalenceGraphData8: Data
        prevalenceGraphData9: Data
        prevalenceGraphData10: Data

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
            currentRegion: mapStateProp<RootState, Region | null>(state => state.currentProject && state.currentProject.currentRegion),
            prevalenceGraphConfig: mapStateProp<RootState, Graph | null>(state => state.prevalenceGraphConfig),

            prevalenceGraphData1: mapStateProp<RootState, Data>(state => state.prevalenceGraphData1),
            prevalenceGraphData2: mapStateProp<RootState, Data>(state => state.prevalenceGraphData2),
            prevalenceGraphData3: mapStateProp<RootState, Data>(state => state.prevalenceGraphData3),
            prevalenceGraphData4: mapStateProp<RootState, Data>(state => state.prevalenceGraphData4),
            prevalenceGraphData5: mapStateProp<RootState, Data>(state => state.prevalenceGraphData5),
            prevalenceGraphData6: mapStateProp<RootState, Data>(state => state.prevalenceGraphData6),
            prevalenceGraphData7: mapStateProp<RootState, Data>(state => state.prevalenceGraphData7),
            prevalenceGraphData8: mapStateProp<RootState, Data>(state => state.prevalenceGraphData8),
            prevalenceGraphData9: mapStateProp<RootState, Data>(state => state.prevalenceGraphData9),
            prevalenceGraphData10: mapStateProp<RootState, Data>(state => state.prevalenceGraphData10)
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
        watch: {
          currentRegion: function() {
              if (this.currentRegion)
              {
                  this.getGraphData();
              }
          }
        },
        mounted() {
            this.getGraphData();
        }
    });

</script>
