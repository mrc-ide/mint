<template>
    <div>
        <ul class="nav nav-tabs" style="margin-left: 26px;margin-bottom: -1px;">
            <li class="nav-item">
                <a class="text-success nav-link"
                   :class="{active: activeHorizontalTab === 'Impact'}"
                   @click="() => changeHorizontalTab('Impact')">Impact
                </a>
            </li>
            <li class="nav-item">
                <a class="text-success nav-link"
                   :class="{active: activeHorizontalTab === 'Cost'}"
                   @click="() => changeHorizontalTab('Cost')">Cost effectiveness
                </a>
            </li>
        </ul>
        <div class="tab-content">
            <vertical-tabs :tabs="verticalTabs"
                           :active-tab="activeVerticalTab"
                           @tab-selected="changeVerticalTab">
                <div v-if="activeHorizontalTab === 'Impact'">
                   <impact :active-tab="activeVerticalTab" />
                </div>
                <div v-if="activeHorizontalTab === 'Cost'">
                    <cost-effectiveness :active-tab="activeVerticalTab" />
                </div>
            </vertical-tabs>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import verticalTabs from "./verticalTabs.vue";
    import {mapActionByName} from "../utils";
    import {RootAction} from "../actions";
    import impact from "./impact.vue";
    import costEffectiveness from "./costEffectiveness.vue";

    interface ComponentData {
        verticalTabs: string[],
        activeVerticalTab: string
        activeHorizontalTab: string
    }

    interface Methods {
        changeVerticalTab: (name: string) => void
        changeHorizontalTab: (name: string) => void
        getGraphData: () => void
        getTableData: () => void
    }

    export default Vue.extend<ComponentData, Methods, {}, {}>({
        data() {
            return {
                verticalTabs: ["Table", "Graphs"],
                activeVerticalTab: "Graphs",
                activeHorizontalTab: "Impact"
            }
        },
        methods: {
            changeVerticalTab(name: string) {
                this.activeVerticalTab = name;
            },
            changeHorizontalTab(name: string) {
                this.activeHorizontalTab = name;
            },
            getGraphData: mapActionByName(RootAction.FetchPrevalenceGraphData),
            getTableData: mapActionByName(RootAction.FetchImpactTableData)
        },
        components: {verticalTabs, impact, costEffectiveness},
        mounted() {
            this.getGraphData();
            this.getTableData();
        }
    });

</script>
