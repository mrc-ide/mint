<template>
    <div>
        <ul class="nav nav-tabs" style="margin-left: 26px;margin-bottom: -1px;">
            <li class="nav-item">
                <a class="text-success nav-link"
                   :class="{active: activeOuterTab === 'Impact'}"
                   @click="() => changeOuterTab('Impact')">Impact
                </a>
            </li>
            <li class="nav-item">
                <a class="text-success nav-link"
                   :class="{active: activeOuterTab === 'Cost'}"
                   @click="() => changeOuterTab('Cost')">Cost effectiveness
                </a>
            </li>
        </ul>
        <div class="tab-content">
            <vertical-tabs :tabs="innerTabs" :active-tab="activeInnerTab" @tab-selected="changeInnerTab">
                <div v-if="activeOuterTab === 'Impact'">
                   <impact :active-tab="activeInnerTab" />
                </div>
                <div v-if="activeOuterTab === 'Cost'">
                    <cost-effectiveness :active-tab="activeInnerTab" />
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
        innerTabs: string[],
        activeInnerTab: string
        activeOuterTab: string
    }

    interface Methods {
        changeOuterTab: (name: string) => void
        changeInnerTab: (name: string) => void
        getGraphData: () => void
    }

    export default Vue.extend<ComponentData, Methods, {}, {}>({
        data() {
            return {
                innerTabs: ["Table", "Graphs"],
                activeInnerTab: "Graphs",
                activeOuterTab: "Impact"
            }
        },
        methods: {
            changeInnerTab(name: string) {
                this.activeInnerTab = name;
            },
            changeOuterTab(name: string) {
                this.activeOuterTab = name;
            },
            getGraphData: mapActionByName(RootAction.FetchPrevalenceGraphData)
        },
        components: {verticalTabs, impact, costEffectiveness},
        mounted() {
            this.getGraphData();
        }
    });

</script>
