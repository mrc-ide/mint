<template>
    <b-table :items="items" hover selectable select-mode="single" @row-selected="onRowSelected" selected-variant="">
        <template #cell(total_cases_averted)="data">
            <abbr
                :title="`${formatCases(data.value.median)} +${formatCases(data.value.maximum - data.value.median)} / -${formatCases(data.value.median - data.value.minimum)}`">
                {{ formatCases(data.value.median) }}
            </abbr>
        </template>
    </b-table>
</template>

<script lang="ts">
    import {BTable} from "bootstrap-vue";
    import Vue from "vue";
    import {StrategyWithThreshold} from "../../../models/project";
    import {formatCases, formatCost, getInterventionColourName, getInterventionName} from "./util";

    interface Methods {
        onRowSelected: (rows: Record<string, any>[]) => void,
        formatCases: (value: number) => string
    }

    interface Computed {
        items: Record<string, any>[]
    }

    interface Props {
        strategies: StrategyWithThreshold[]
    }

    export default Vue.extend<Record<string, never>, Methods, Computed, Props>({
        methods: {
            onRowSelected([item]) {
                this.$emit("strategy-selected", this.strategies[this.items.indexOf(item)]);
            },
            formatCases
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
                    total_cases_averted: {
                        minimum: strategy.interventions.reduce((a, intervention) => a + intervention.casesAvertedErrorMinus, 0),
                        median: strategy.interventions.reduce((a, intervention) => a + intervention.casesAverted, 0),
                        maximum: strategy.interventions.reduce((a, intervention) => a + intervention.casesAvertedErrorPlus, 0)
                    },
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
