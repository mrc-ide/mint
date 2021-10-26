<template>
    <div class="container-fluid my-4">
        <div class="d-flex flex-column justify-content-center align-items-center mb-4"
             @click="toggleBaseline"
             :class="{'cursor-pointer': currentStep === 2}">
            <h4>
                Setup baseline
                <component :is="caretIconComponent"
                           v-if="currentStep === 2"></component>
            </h4>
        </div>
        <b-collapse v-model="showBaseline">
            <baseline @validate="baselineValidated"
                      ref="baseline"></baseline>
        </b-collapse>
        <div v-if="currentStep === 1" class="d-flex flex-column justify-content-center align-items-center my-4">
            <button class="btn btn-primary btn-lg"
                    :disabled="interventionsDisabled"
                    @click="next">Next
            </button>
        </div>
        <b-collapse :visible="currentStep === 2">
            <interventions v-if="currentStep === 2"></interventions>
        </b-collapse>
        <div v-if="loading" class="text-center">
            <loading-spinner size="lg"></loading-spinner>
            <h2>Loading data</h2>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {RootMutation} from "../mutations";
    import {mapActionByName, mapMutationByName} from "../utils";
    import baseline from "./baseline.vue";
    import {mapState} from "vuex";
    import {Project} from "../models/project";
    import {RootAction} from "../actions";
    import {BCollapse, BIconCaretDownFill, BIconCaretUpFill} from "bootstrap-vue";
    import loadingSpinner from "./loadingSpinner.vue";

    interface Data {
        interventionsDisabled: boolean
        showBaseline: boolean
        loading: boolean
    }

    interface Methods {
        setCurrentRegion: (params: { project: string, region: string }) => void,
        setCurrentStep: (step: number) => void,
        baselineValidated: (value: boolean) => void
        next: () => void;
        toggleBaseline: () => void;
    }

    interface Computed {
        currentProject: Project | null,
        currentStep: number
        caretIconComponent: string
    }

    let vm: any = null;

    export default Vue.extend<Data, Methods, Computed, Record<string, never>>({
    components: {
        baseline,
        interventions: () => {
            vm.loading = true;
            return import("./interventions.vue").then((component) => {
                vm.loading = false;
                return component
            })
        },
        loadingSpinner,
        BCollapse, BIconCaretDownFill, BIconCaretUpFill
    },
    data() {
        return {
            interventionsDisabled: false,
            showBaseline: false,
            loading: false
        }
    },
    computed: {
        ...mapState(["currentProject"]),
        currentStep: function () {
            return this.currentProject ? this.currentProject.currentRegion.step : 0
        },
        caretIconComponent() {
            return this.showBaseline ? "b-icon-caret-up-fill" : "b-icon-caret-down-fill"
        }
    },
    methods: {
        setCurrentRegion: mapActionByName(RootAction.SetCurrentRegion),
        setCurrentStep: mapMutationByName(RootMutation.SetCurrentRegionStep),
        baselineValidated: function (valid: boolean) {
            this.interventionsDisabled = !valid;
        },
        next() {
            ((this.$refs["baseline"] as Vue).$refs["form"] as any).submit();
            this.setCurrentStep(2);
            this.showBaseline = false;
        },
        toggleBaseline() {
            if (this.currentStep === 2) {
                this.showBaseline = !this.showBaseline;
            }
        }
    },
    watch: {
        $route(to) {
            // navigation has occurred within the app, i.e. by clicking an internal link
            const params = to.params;
            this.setCurrentRegion({project: params["project"], region: params["region"]});
        },
        currentStep(step: number) {
            if (step == 1) {
                this.showBaseline = true
            }
        }
    },
    mounted() {
        // navigation has occurred outside the app, e.g. by refreshing the page, or
        // directly entering a url
        const params = this.$router.currentRoute.params;
        this.setCurrentRegion({project: params["project"], region: params["region"]});
        if (this.currentProject?.currentRegion?.step == 1) {
            this.showBaseline = true
        }
    },
    created() {
        vm = this;
    }
    });
</script>
