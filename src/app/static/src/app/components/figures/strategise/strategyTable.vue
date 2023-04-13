<template>
    <b-table :items="items">
        <template #cell(total_cases_averted)="data">
            <abbr
                :title="`${formatCases(data.value.median)} +${formatCases(data.value.maximum - data.value.median)} / -${formatCases(data.value.median - data.value.minimum)}`">
                {{ formatCases(data.value.median) }}
            </abbr>
        </template>
        <template #cell(percentage_of_total_cases_averted)="data">
            <abbr v-if="data.value"
                  :title="`${formatPercentage(data.value.median)} +${formatCases((data.value.maximum - data.value.median) * 100, 1)} / -${formatCases((data.value.median - data.value.minimum) * 100, 1)}`">
                {{ formatPercentage(data.value.median) }}
            </abbr>
            <span v-else>
        100%
      </span>
        </template>
        <template #cell(cost_per_case_averted)="data">
            <abbr v-if="data.value"
                  :title="`${formatCost(data.value.median)} +${formatCost(data.value.maximum - data.value.median)} / -${formatCost(data.value.median - data.value.minimum)}`">
                {{ formatCost(data.value.median) }}
            </abbr>
        </template>
        <template #cell(cases_averted_per_person)="data">
            <abbr v-if="data.value"
                  :title="`${formatCases(data.value.median, 1)} +${formatCases(data.value.maximum - data.value.median, 1)} / -${formatCases(data.value.median - data.value.minimum, 1)}`">
                {{ formatCases(data.value.median, 1) }}
            </abbr>
        </template>
    </b-table>
</template>

<script lang="ts">
    import Vue from "vue";
    import {StrategyWithThreshold} from "../../../models/project";
    import {BTable} from "bootstrap-vue";
    import {
        formatCases,
        formatCost,
        formatPercentage,
        getInterventionName,
        getRegionPopulations
    } from "./util";

    interface Methods {
        formatCases: (value: number) => string,
        formatCost: (value: number) => string,
        formatPercentage: (value: number) => string
    }

    interface Computed {
        populations: Record<string, number>
        items: Record<string, string | object>[]
    }

    interface Props {
        strategy: StrategyWithThreshold
    }

    export default Vue.extend<unknown, Methods, Computed, Props>({
        methods: {
            formatCases,
            formatCost,
            formatPercentage
        },
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
                const totalCost = this.strategy.interventions.reduce((a, intervention) => a + intervention.cost, 0);
                return this.strategy.interventions.map(intervention => {
                    const population = this.populations[intervention.zone];
                    return {
                        region: intervention.zone,
                        intervention: getInterventionName(intervention.intervention),
                        population: String(population),
                        total_cases_averted: {
                            minimum: intervention.casesAvertedErrorMinus,
                            median: intervention.casesAverted,
                            maximum: intervention.casesAvertedErrorPlus
                        },
                        percentage_of_total_cases_averted: {
                            minimum: intervention.casesAvertedErrorMinus / this.strategy.interventions.reduce((a, intervention) => a + intervention.casesAvertedErrorPlus, 0),
                            median: intervention.casesAverted / this.strategy.interventions.reduce((a, intervention) => a + intervention.casesAverted, 0),
                            maximum: intervention.casesAvertedErrorPlus / this.strategy.interventions.reduce((a, intervention) => a + intervention.casesAvertedErrorMinus, 0)
                        } as any,
                        total_costs: formatCost(intervention.cost),
                        percentage_of_total_costs: formatPercentage(intervention.cost / totalCost),
                        cost_per_case_averted: {
                            minimum: intervention.cost / intervention.casesAvertedErrorPlus,
                            median: intervention.cost / intervention.casesAverted,
                            maximum: intervention.cost / intervention.casesAvertedErrorMinus
                        } as any,
                        cost_per_person: formatCost(intervention.cost / population, 2),
                        cases_averted_per_person: {
                            minimum: intervention.casesAvertedErrorMinus / population,
                            median: intervention.casesAverted / population,
                            maximum: intervention.casesAvertedErrorPlus / population
                        } as any,
                        _cellVariants: {
                            intervention: intervention.intervention
                        }
                    };
                }).concat({
                    region: "Total",
                    intervention: "",
                    population: String(Object.values(this.populations).reduce((a, population) => a + population, 0)),
                    total_cases_averted: {
                        minimum: this.strategy.interventions.reduce((a, intervention) => a + intervention.casesAvertedErrorMinus, 0),
                        median: this.strategy.interventions.reduce((a, intervention) => a + intervention.casesAverted, 0),
                        maximum: this.strategy.interventions.reduce((a, intervention) => a + intervention.casesAvertedErrorPlus, 0)
                    },
                    percentage_of_total_cases_averted: "",
                    total_costs: formatCost(totalCost),
                    percentage_of_total_costs: "100%",
                    cost_per_case_averted: "",
                    cost_per_person: "",
                    cases_averted_per_person: "",
                    _cellVariants: {
                        intervention: ""
                    }
                })
            }
        }
    });
</script>
