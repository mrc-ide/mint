<template>
    <div class="baseline">
        <h1>Baseline</h1>
        <dynamic-form v-model="options"
                      :include-submit-button="true"
                      submit-text="Next"
                      @submit="$emit('submit')"></dynamic-form>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {DynamicForm, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
    import {Project} from "../models/project";
    import {mapState} from "vuex";
    import {mapMutationByName} from "../utils";
    import {RootMutation} from "../mutations";

    interface Computed {
        currentProject: Project
        options: DynamicFormMeta
    }

    interface Methods {
        update: (value: DynamicFormMeta) => void
    }

    export default Vue.extend<{}, Methods, Computed, {}>({
        components: {DynamicForm},
        methods: {
            update: mapMutationByName(RootMutation.SetCurrentRegionBaselineOptions)
        },
        computed: {
            ...mapState(["currentProject"]),
            options:  {
                get() {
                    return this.currentProject.currentRegion.baselineOptions
                },
                set(value: DynamicFormMeta) {
                      this.update(value);
                }
             }
        }
    });
</script>
