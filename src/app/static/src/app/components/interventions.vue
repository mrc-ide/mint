<template>
    <div class="row">
        <div class="col-4 interventions">
            <dynamic-form ref="settings"
                          v-model="options"
                          @submit="updateInterventionSettings"
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
    import {mapActionByName, mapMutationByName} from "../utils";
    import {RootAction} from "../actions";
    import impact from "./impact.vue";
    import costEffectiveness from "./costEffectiveness.vue";
    import {mapState} from "vuex";
    import {DynamicForm, DynamicFormData, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
    import {RootMutation} from "../mutations";
    import {Project, Region} from "../models/project";

    interface ComponentData {
        verticalTabs: string[],
        activeVerticalTab: string
        activeHorizontalTab: string
    }

    interface Methods {
        submitForm: () => void
        changeVerticalTab: (name: string) => void
        changeHorizontalTab: (name: string) => void
        updateInterventionOptions: (payload: DynamicFormMeta) => void
        updateInterventionSettings: (payload: DynamicFormData) => void
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
            ensureData: mapActionByName(RootAction.EnsureImpactData),
            updateInterventionOptions: mapMutationByName(RootMutation.SetCurrentRegionInterventionOptions),
            updateInterventionSettings: mapMutationByName(RootMutation.SetCurrentRegionInterventionSettings)
        },
        components: {verticalTabs, impact, costEffectiveness, DynamicForm},
        mounted() {
            this.ensureData();
            this.submitForm();
        },
        watch: {
            options() {
                this.submitForm();
            },
            currentRegion: function () {
                this.ensureData();
            }
        }
    });

</script>
