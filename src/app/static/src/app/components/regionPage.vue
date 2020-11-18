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
                         @click="next"></step-button>
        </div>
        <baseline v-if="currentStep === 1"
                  @submit="setCurrentStep(2)"
                  @validate="baselineValidated"
                  ref="baseline"></baseline>
        <interventions v-if="currentStep === 2"></interventions>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {RootMutation} from "../mutations";
    import {mapActionByName, mapMutationByName} from "../utils";
    import stepButton from "./stepButton.vue";
    import baseline from "./baseline.vue";
    import {mapState} from "vuex";
    import {Project} from "../models/project";
    import {RootAction} from "../actions";
    // @ts-ignore Dynamic imports not supported error
    const interventions = async () => import("./interventions.vue");

    interface Data {
        interventionsDisabled: boolean
    }

    interface Methods {
        setCurrentRegion: (params: { project: string, region: string }) => void,
        setCurrentStep: (step: number) => void,
        baselineValidated: (value: boolean) => void
        next: () => void;
    }

    interface Computed {
        currentProject: Project | null,
        currentStep: number
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
            currentStep: function () {
                return this.currentProject ? this.currentProject.currentRegion.step : 0
            }
        },
        methods: {
            setCurrentRegion: mapActionByName(RootAction.SetCurrentRegion),
            setCurrentStep: mapMutationByName(RootMutation.SetCurrentRegionStep),
            baselineValidated: function (valid: Boolean) {
                this.interventionsDisabled = !valid;
            },
            next() {
                ((this.$refs['baseline'] as Vue).$refs["form"] as any).submit();
            }
        },
        watch: {
            $route(to) {
                // navigation has occurred within the app, i.e. by clicking an internal link
                const params = to.params;
                this.setCurrentRegion({project: params["project"], region: params["region"]});
            }
        },
        mounted() {
            // navigation has occurred outside the app, e.g. by refreshing the page, or
            // directly entering a url
            const params = this.$router.currentRoute.params;
            this.setCurrentRegion({project: params["project"], region: params["region"]});
        }
    });

    interventions().then(); //async load js from server
</script>
