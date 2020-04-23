<template>
    <div class="container mt-5">
        <div class="stepper mb-5">
            <step-button number="1"
                         text="Setup baseline"
                         :active="currentStep === 1"
                         @click="setCurrentStep(1)"></step-button>
            <div class="col step-connector">
                <hr/>
            </div>
            <step-button number="2"
                         text="Explore interventions"
                         :active="currentStep === 2"
                         @click="setCurrentStep(2)"></step-button>
        </div>
        <baseline v-if="currentStep === 1"></baseline>
        <interventions v-if="currentStep === 2"></interventions>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {RootMutation} from "../mutations";
    import {mapMutationByName} from "../utils";
    import stepButton from "./stepButton.vue";
    import interventions from "./interventions.vue";
    import baseline from "./baseline.vue";

    export default Vue.extend({
        components: {stepButton, baseline, interventions},
        data() {
            return {currentStep: 1}
        },
        methods: {
            setCurrentRegion: mapMutationByName(RootMutation.SetCurrentRegion),
            setCurrentStep(step: number) {
                this.currentStep = step;
            }
        },
        watch: {
            $route(to) {
                this.setCurrentRegion(to.path);
            }
        }
    });
</script>
