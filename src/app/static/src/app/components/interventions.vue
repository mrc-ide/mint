<template>
    <div class="row mt-4">
        <div class="col-sm-4 col-md-3 interventions">
            <dynamic-form ref="settings"
                          v-model="options"
                          @submit="updateInterventionSettings"
                          :include-submit-button="false"></dynamic-form>
        </div>
        <div class="col-sm-8 col-md-9">
            <ul class="nav nav-tabs" style="margin-left: 22px;margin-bottom: -1px;">
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
                    <div v-if="loading" class="text-center">
                        <loading-spinner size="lg"></loading-spinner>
                        <h2>Loading data</h2>
                    </div>
                </vertical-tabs>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import verticalTabs from "./verticalTabs.vue";
    import {mapActionByName, mapMutationByName} from "../utils";
    import {RootAction} from "../actions";
    import {mapState} from "vuex";
    import {DynamicForm, DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
    import {RootMutation} from "../mutations";
    import {Project, Region} from "../models/project";
    import loadingSpinner from "./loadingSpinner.vue";

    interface ComponentData {
        verticalTabs: string[],
        activeVerticalTab: string
        activeHorizontalTab: string
        loading: boolean
    }

    interface Methods {
        submitForm: () => void
        changeVerticalTab: (name: string) => void
        changeHorizontalTab: (name: string) => void
        updateInterventionOptions: (payload: DynamicFormMeta) => void
        updateInterventionSettings: (payload: DynamicFormData) => void
        ensureData: () => void
        ensureImpactData: () => void
        ensureCostEffectivenessData: () => void
        fetchConfig: () => void
    }

    interface Computed {
        options: DynamicFormMeta
        currentProject: Project
        currentRegion: Region
    }

    let vm: any = null;

    export default Vue.extend<ComponentData, Methods, Computed, Record<string, never>>({
        data() {
            return {
            verticalTabs: ["Table", "Graphs"],
            activeVerticalTab: "Graphs",
            activeHorizontalTab: "Impact",
            loading: false
            }
        },
    computed: {
        ...mapState(["currentProject"]),
        options: {
            get() {
                return this.currentProject.currentRegion.interventionOptions
            },
            set(value: DynamicFormMeta) {
                this.updateInterventionOptions(value);
            }
        },
        currentRegion() {
            return this.currentProject.currentRegion;
        }
    },
    methods: {
        submitForm() {
            this.$nextTick(() => {
                // wait til the next tick so that the form has been updated
                const form = this.$refs.settings as any
                form.submit && form.submit();
            });
        },
        changeVerticalTab(name: string) {
            this.activeVerticalTab = name;
        },
        changeHorizontalTab(name: string) {
            this.activeHorizontalTab = name;
        },
        ensureData: function () {
            this.ensureImpactData();
            this.ensureCostEffectivenessData();
        },
        ensureImpactData: mapActionByName(RootAction.EnsureImpactData),
        ensureCostEffectivenessData: mapActionByName(RootAction.EnsureCostEffectivenessData),
        updateInterventionOptions: mapMutationByName(RootMutation.SetCurrentRegionInterventionOptions),
        updateInterventionSettings: mapMutationByName(RootMutation.SetCurrentRegionInterventionSettings),
        fetchConfig: mapActionByName(RootAction.FetchConfig)
    },
    components: {
        verticalTabs,
        impact: () => {
            vm.loading = true;
            return import("./impact.vue").then((component) => {
                vm.loading = false;
                return component
            })
        },
        costEffectiveness: () => {
            vm.loading = true;
            return import("./costEffectiveness.vue").then((component) => {
                vm.loading = false;
                return component
            })
        },
        DynamicForm,
        loadingSpinner
    },
        mounted() {
            this.ensureData();
            this.submitForm();
            this.fetchConfig();
        },
    watch: {
        options() {
            this.submitForm();
        },
        currentRegion: function () {
            this.ensureData();
        }
    },
        created() {
            vm = this;
        }
    });

</script>
