<template>
  <b-table :items="items"></b-table>
</template>

<script lang="ts">
import {BTable} from "bootstrap-vue";
import Vue from "vue";
import {StrategyWithThreshold} from "../../../models/project";

const names: Record<string, string> = {
  "irs": "IRS* only",
  "llin-pbo": "Pyrethroid-PBO ITN only",
  "irs-llin-pbo": "Pyrethroid-PBO ITN with IRS*",
  "llin": "Pyrethroid LLIN only",
  "irs-llin": "Pyrethroid LLIN with IRS*",
  "none": "No intervention"
};

// BTable uses Bootstrap colour variants for styling: https://bootstrap-vue.org/docs/components/table#items-record-data
const colours: Record<string, string> = {
  "irs": "primary",
  "llin-pbo": "secondary",
  "irs-llin-pbo": "danger",
  "llin": "success",
  "irs-llin": "warning",
  "none": ""
};

const costFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const casesFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
});

interface Computed {
  items: Record<string, any>[]
}

interface Props {
  strategies: StrategyWithThreshold[]
}

export default Vue.extend<void, void, Computed, Props>({
  components: {
    BTable
  },
  props: {
    strategies: Array
  },
  computed: {
    items() {
      return this.strategies.map((e: any, i: number) => ({
        " ": `Strategy ${i + 1}`,
        "maximum_cost_vs_budget": `${e.costThreshold * 100}%`,
        ...e.interventions.reduce((a: any, f: any) => ({...a, [f.zone]: names[f.intervention]}), {}),
        "total_cases_averted": casesFormatter.format(e.interventions.reduce((a: Number, g: any) => a + g.casesAverted, 0)),
        "total_cost": costFormatter.format(e.interventions.reduce((a: Number, g: any) => a + g.cost, 0)),
        "_cellVariants": e.interventions.reduce((a: any, f: any) => ({
          ...a,
          [f.zone]: colours[f.intervention]
        }), {})
      }));
    }
  }
});
</script>
