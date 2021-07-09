<template>
  <div class="strategise container mt-5">
    <h1 class="h3 text-center">
      Strategize across regions
      <span class="icon-small" v-tooltip="'<p>This tool can investigate how different interventions could be ' +
        'distributed cross wider regions to minimise the overall number of malaria cases whilst achieving local ' +
        'goals.</p>' +
        '<p>In some circumstances the next best option might be substantially lower cost. To investigate this the ' +
        'tool outputs not only the best option but shows which combination of interventions give slightly reduced ' +
        'budgets. The tool presents 5 potential strategies, allowing the user to determine and explore potential ' +
        'strategies for vector control across regions.</p>' +
        '<p>Please see the user manual for more information.</p>'">
        <help-circle-icon></help-circle-icon>
      </span>
    </h1>
    <div class="summary mt-5">
      <strategies-table v-if="strategies.length" :strategies="strategies"></strategies-table>
      <loading-spinner v-else size="lg"></loading-spinner>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {mapState} from "vuex";
import {mapActionByName} from "../utils";
import {Project, StrategyWithThreshold} from "../models/project";
import {RootAction} from "../actions";
import {VTooltip} from "v-tooltip";
import {HelpCircleIcon} from "vue-feather-icons";
import loadingSpinner from "./loadingSpinner.vue";
import strategiesTable from "./figures/strategise/strategiesTable.vue";

interface Methods {
  strategise: () => void
}

interface Computed {
  currentProject: Project
  strategies: StrategyWithThreshold[]
}

export default Vue.extend<void, Methods, Computed>({
  components: {
    strategiesTable,
    HelpCircleIcon,
    loadingSpinner
  },
  directives: {
    tooltip: VTooltip
  },
  computed: {
    ...mapState(["currentProject"]),
    strategies() {
      return this.currentProject ? this.currentProject.strategies : [];
    }
  },
  mounted() {
    this.strategise();
  },
  methods: {
    strategise: mapActionByName(RootAction.Strategise)
  }
});
</script>
