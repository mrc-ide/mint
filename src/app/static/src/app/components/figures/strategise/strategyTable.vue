<template>
  <b-table :items="items"></b-table>
</template>

<script lang="ts">
import Vue from "vue";
import {StrategyWithThreshold} from "../../../models/project";
import {BTable} from "bootstrap-vue";
import {
  formatCases,
  formatCost,
  formatPercentage,
  getInterventionColourName,
  getInterventionName,
  getRegionPopulations,
} from "./util";

interface Computed {
  populations: Record<string, number>
  items: Record<string, string | object>[]
}

interface Props {
  strategy: StrategyWithThreshold
}

export default Vue.extend<unknown, unknown, Computed, Props>({
  components: {
    BTable
  },
  props: {
    strategy: Object
  },
  computed: {
    populations() {
      return getRegionPopulations(this.$store.state.currentProject!);
    },
    items() {
      const totalCasesAverted = this.strategy.interventions.reduce((a, intervention) => a + intervention.casesAverted, 0);
      const totalCost = this.strategy.interventions.reduce((a, intervention) => a + intervention.cost, 0);
      return this.strategy.interventions.map(intervention => {
        const population = this.populations[intervention.zone];
        return {
          region: intervention.zone,
          intervention: getInterventionName(intervention.intervention),
          population: String(population),
          total_cases_averted: formatCases(intervention.casesAverted),
          percentage_of_total_cases_averted: formatPercentage(intervention.casesAverted / totalCasesAverted),
          total_costs: formatCost(intervention.cost),
          percentage_of_total_costs: formatPercentage(intervention.cost / totalCost),
          cost_per_case_averted: formatCost(intervention.cost / intervention.casesAverted),
          cost_per_person: formatCost(intervention.cost / population, 2),
          cases_averted_per_person: formatCases(intervention.casesAverted / population, 1),
          _cellVariants: {
            intervention: getInterventionColourName(intervention.intervention)
          }
        };
      }).concat({
        region: "Total",
        intervention: "",
        population: String(Object.values(this.populations).reduce((a, population) => a + population, 0)),
        total_cases_averted: formatCases(totalCasesAverted),
        percentage_of_total_cases_averted: "100%",
        total_costs: formatCost(totalCost),
        percentage_of_total_costs: "100%",
        cost_per_case_averted: "",
        cost_per_person: "",
        cases_averted_per_person: "",
        _cellVariants: {
          intervention: ""
        }
      });
    }
  }
});
</script>
