<template>
    <div class="baseline">
        <dynamic-form v-model="options"
                      :include-submit-button="true"
                      submit-text="Next"
                      @submit="submit"
                      @validate="$emit('validate', $event)" ></dynamic-form>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {DynamicForm, DynamicFormMeta, DynamicFormData} from "@reside-ic/vue-dynamic-form";
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
        submit: (settings: DynamicFormData) => void
        updateBaselineSettings: (settings: DynamicFormData) => void
    }

    export default Vue.extend<{}, Methods, Computed, {}>({
        components: {DynamicForm},
        methods: {
            submit: function(settings: DynamicFormData) {
                this.updateBaselineSettings(settings);
                this.$emit('submit');
            },
            update: mapMutationByName(RootMutation.SetCurrentRegionBaselineOptions),
            updateBaselineSettings: mapMutationByName(RootMutation.SetCurrentRegionBaselineSettings)
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
