<template>
    <div class="baseline" v-if="currentProject">
        <dynamic-form v-model="options"
                      ref="form"
                      :include-submit-button="false"
                      @submit="submit"
                      @validate="$emit('validate', $event)"></dynamic-form>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {DynamicForm, DynamicFormMeta, DynamicFormData} from "@reside-ic/vue-dynamic-form";
    import {Project} from "../models/project";
    import {mapState} from "vuex";
    import {mapActionByName, mapMutationByName} from "../utils";
    import {RootMutation} from "../mutations";
    import {RootAction} from "../actions";

    interface Computed {
        currentProject: Project
        options: DynamicFormMeta
    }

    interface Methods {
        update: (value: DynamicFormMeta) => void
        submit: (settings: DynamicFormData) => void
        updateBaselineSettings: (settings: DynamicFormData) => void
    }

    export default Vue.extend<Record<string, never>, Methods, Computed, Record<string, never>>({
        components: {DynamicForm},
        methods: {
            submit: function (settings: DynamicFormData) {
                this.updateBaselineSettings(settings);
                this.$emit("submit");
            },
            update: mapMutationByName(RootMutation.SetCurrentRegionBaselineOptions),
            updateBaselineSettings: mapActionByName(RootAction.SetCurrentRegionBaselineSettings)
        },
        computed: {
            ...mapState(["currentProject"]),
            options: {
                get() {
                    return this.currentProject.currentRegion.baselineOptions
                },
                set(value: DynamicFormMeta) {
                    this.update(value);
                    if (this.currentProject.currentRegion.step == 2) {
                        // this means we are viewing the figures, so need to
                        // update data in real time - but wait for next
                        // tick so that values have been updated in the store
                        Vue.nextTick().then(() => (this.$refs["form"] as any).submit())
                    }
                }
            }
        }
    });
</script>
