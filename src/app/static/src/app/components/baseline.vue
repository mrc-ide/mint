<template>
    <div class="baseline">
        <h1>Baseline</h1>
        <dynamic-form v-model="options"
                      :include-submit-button="false"></dynamic-form>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {DynamicForm, DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
    import {Project} from "../models/project";
    import {mapState} from "vuex";

    interface Computed {
        currentProject: Project,
        options: DynamicFormMeta
    }

    export default Vue.extend<{}, {}, Computed, {}>({
        components: {DynamicForm},
        computed: {
            ...mapState(["currentProject"]),
          options:  {
              get() {
                  return this.currentProject.currentRegion.baselineOptions
              },
              set(value: DynamicFormMeta) {
                  //TODO: update by calling a mutation to set options in the current region
              }
          }
        }
    });
</script>
