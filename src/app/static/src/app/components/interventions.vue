<template>
    <div class="row">
        <div class="col-4 interventions">
            <dynamic-form v-model="options"
                          :include-submit-button="false"></dynamic-form>
        </div>
        <div class="col-8">
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
                        <impact :active-tab="activeVerticalTab"/>
                    </div>
                    <div v-if="activeHorizontalTab === 'Cost'">
                        <cost-effectiveness :active-tab="activeVerticalTab"/>
                    </div>
                </vertical-tabs>
            </div>
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
    import {mapState} from "vuex";
    import {DynamicForm, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
    import {Project, Region} from "../models/project";

    interface ComponentData {
        verticalTabs: string[],
        activeVerticalTab: string
        activeHorizontalTab: string
    }

    interface Methods {
        changeVerticalTab: (name: string) => void
        changeHorizontalTab: (name: string) => void
        ensureData: () => void
    }

    interface Computed {
        options: DynamicFormMeta
        currentProject: Project
        currentRegion: Region
    }

    export default Vue.extend<ComponentData, Methods, Computed, {}>({
        data() {
            return {
                verticalTabs: ["Table", "Graphs"],
                activeVerticalTab: "Graphs",
                activeHorizontalTab: "Impact"
            }
        },
        computed: {
            ...mapState(["currentProject"]),
            options: {
                get() {
                    return this.currentProject.currentRegion.interventionOptions
                },
                set(value: DynamicFormMeta) {
                    // TODO update
                }
            },
            currentRegion() {
                return this.currentProject.currentRegion;
            }
        },
        methods: {
            changeVerticalTab(name: string) {
                this.activeVerticalTab = name;
            },
            changeHorizontalTab(name: string) {
                this.activeHorizontalTab = name;
            },
            ensureData: mapActionByName(RootAction.EnsureImpactData)
        },
        components: {verticalTabs, impact, costEffectiveness, DynamicForm},
        mounted() {
            this.ensureData();
        },
        watch: {
            currentRegion: function () {
                this.ensureData();
            }
        }
    });

</script>
