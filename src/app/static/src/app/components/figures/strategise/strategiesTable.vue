<template>
    <b-table :items="items" hover selectable select-mode="single" @row-selected="onRowSelected"
             selected-variant=""></b-table>
</template>

<script lang="ts">
    import {BTable} from "bootstrap-vue";
    import Vue from "vue";
    import {StrategyWithThreshold} from "../../../models/project";
    import {formatCases, formatCost, getInterventionColourName, getInterventionName} from "./util";

    interface Methods {
        onRowSelected: (rows: Record<string, any>[]) => void
    }

    interface Computed {
        items: Record<string, any>[]
    }

    interface Props {
        strategies: StrategyWithThreshold[]
    }

    export default Vue.extend<void, Methods, Computed, Props>({
        methods: {
            onRowSelected([item]) {
                this.$emit("strategy-selected", this.strategies[this.items.indexOf(item)]);
            }
        },
        components: {
            BTable
        },
        props: {
            strategies: Array
        },
        computed: {
            items() {
                return this.strategies.map((strategy, i) => ({
                    " ": `Strategy ${i + 1}`,
                    maximum_cost_vs_budget: `${strategy.costThreshold * 100}%`,
                    ...strategy.interventions.reduce((a, intervention) => ({
                        ...a,
                        [intervention.zone]: getInterventionName(intervention.intervention)
                    }), {}),
                    total_cases_averted: formatCases(strategy.interventions.reduce((a, intervention) => a + intervention.casesAverted, 0)),
                    total_cost: formatCost(strategy.interventions.reduce((a, intervention) => a + intervention.cost, 0)),
                    _cellVariants: strategy.interventions.reduce((a, intervention) => ({
                        ...a,
                        [intervention.zone]: getInterventionColourName(intervention.intervention)
                    }), {})
                }));
            }
        }
    });
</script>
