<template>
    <div class="container-fluid my-5">
        <div class="stepper mb-5">
            <step-button number="1"
                         text="Setup baseline"
                         :active="currentStep === 1"
                         :disabled="false"
                         @click="setCurrentStep(1)"></step-button>
            <div class="col step-connector">
                <hr/>
            </div>
            <step-button number="2"
                         text="Explore interventions"
                         :active="currentStep === 2"
                         :disabled="interventionsDisabled"
                         @click="setCurrentStep(2)"></step-button>
        </div>
        <baseline v-if="currentStep === 1" @submit="setCurrentStep(2)" @validate="baselineValidated"></baseline>
        <interventions v-if="currentStep === 2"></interventions>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {RootMutation} from "../mutations";
    import {mapMutationByName} from "../utils";
    import stepButton from "./stepButton.vue";
    import baseline from "./baseline.vue";
    import {mapState} from "vuex";
    import {Project, Region} from "../models/project";
    // @ts-ignore Dynamic imports not supported error
    const interventions = async () => import("./interventions.vue");

    interface Data {
        interventionsDisabled: Boolean
    }

    interface Methods {
        setCurrentRegion: (region: Region) => void,
        setCurrentStep: (step: Number) => void,
        baselineValidated: (value: Boolean) => void
    }

    interface Computed {
        currentProject: Project | null,
        currentStep: Number
    }

    export default Vue.extend<Data, Methods, Computed, {}>({
        components: {stepButton, baseline, interventions},
        data() {
            return {
                interventionsDisabled: false
            }
        },
        computed: {
            ...mapState(["currentProject"]),
            currentStep: function() {
                return this.currentProject ? this.currentProject.currentRegion.step : 0
            }
        },
        methods: {
            setCurrentRegion: mapMutationByName(RootMutation.SetCurrentRegion),
            setCurrentStep: mapMutationByName(RootMutation.SetCurrentRegionStep),
            baselineValidated: function(valid: Boolean) {
                this.interventionsDisabled = !valid;
            }
        },
        watch: {
            $route(to) {
                this.setCurrentRegion(to.path);
            }
        },
        mounted() {
            if (!this.currentProject) {
                this.$router.push({
                    path: "/"
                })
            }
        }
    });

    interventions().then(); //async load js from server
</script>
