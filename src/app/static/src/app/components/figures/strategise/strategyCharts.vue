<template>
  <plotly :data="data" :layout="layout" :display-mode-bar="false"></plotly>
</template>

<script lang="ts">
import Vue from "vue";
import {StrategyWithThreshold} from "../../../models/project";
import Plotly from "../graphs/plotly/Plotly.vue";
import {formatCases, getInterventionColourValue, getInterventionName, getRegionPopulations} from "./util";

interface Computed {
  populations: Record<string, number>
  data: Record<string, any>[]
  layout: Record<string, any>
}

interface Props {
  strategy: StrategyWithThreshold
}

export default Vue.extend<unknown, unknown, Computed, Props>({
  components: {
    Plotly
  },
  props: {
    strategy: Object
  },
  computed: {
    populations() {
      return getRegionPopulations(this.$store.state.currentProject!);
    },
    data() {
      // We have two subplots so we would normally just return two traces each containing x and y arrays
      // But this doesn't allow a grouped legend: https://plotly.com/javascript/legend/#subplot-grouped-legend
      // So we have to separate the traces, and selectively show legends to avoid repetition
      const interventionsSeen = ["none"];
      const showLegend = (intervention: string) => {
        if (interventionsSeen.includes(intervention)) {
          return false;
        }
        interventionsSeen.push(intervention);
        return true;
      }
      return this.strategy.interventions.flatMap(intervention => [
        {
          marker: {
            color: getInterventionColourValue(intervention.intervention)
          },
          name: getInterventionName(intervention.intervention),
          showlegend: showLegend(intervention.intervention),
          type: "bar",
          x: [intervention.zone],
          xaxis: "x",
          y: [formatCases(intervention.casesAverted)],
          yaxis: "y"
        },
        {
          marker: {
            color: getInterventionColourValue(intervention.intervention)
          },
          name: getInterventionName(intervention.intervention),
          showlegend: showLegend(intervention.intervention),
          type: "bar",
          x: [intervention.zone],
          xaxis: "x2",
          y: [formatCases(intervention.casesAverted / this.populations[intervention.zone], 1)],
          yaxis: "y2"
        }
      ]);
    },
    layout() {
      return {
        grid: {
          rows: 1,
          columns: 2,
          pattern: "independent"
        },
        yaxis: {
          title: "Total cases averted"
        },
        yaxis2: {
          title: "Cases averted per person"
        },
        title: "Cases averted per region"
      };
    }
  }
});
</script>
