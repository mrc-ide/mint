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

    interface Data{
        options: DynamicFormMeta
    }

    export default Vue.extend<Data, {}, {}, {}>({
        components: {DynamicForm},
        data(): Data {
            return {
                options: baselineOptions
            }
        }
    });

    //TODO: These should be fetched from the backend
    const baselineOptions: DynamicFormMeta = {
        controlSections: [
            {
                label: "Site Inputs",
                controlGroups: [
                    {
                        controls: [
                            {
                                name: "population",
                                label: "Population Size",
                                type: "number",
                                required: true,
                                value: 1000,
                                min: 1,
                                max: 1e7
                            }
                        ]
                    },
                    {
                        controls: [
                            {
                                name: "seasonality",
                                label: "Seasonality of transmission",
                                type: "select",
                                required: true,
                                value: "seasonal",
                                helpText: "Seasonal: a district with a transmission season.<br/>" +
                                    "Perennial: a district with transmission throughout the year.",
                                options: [
                                    {id: "seasonal", label: "Seasonal"},
                                    {id: "perennial", label: "Perennial"}
                                ]
                            }
                        ]
                    },
                    {
                        controls: [
                            {
                                name: "prevalence",
                                label: "Current malaria prevalence",
                                type: "select",
                                required: true,
                                value: "low",
                                helpText: "Low = less than 10% of children under 5-years have malaria<br/>" +
                                    "Medium = approximately 30% of children under 5-years have malaria<br/>" +
                                    "High = approximately 65% of children  under 5-years have malaria",
                                options: [
                                    {id: "low", label: "Low"},
                                    {id: "med", label: "Medium"},
                                    {id: "high", label: "High"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                label: "Mosquito Inputs",
                controlGroups: [
                    {
                        controls: [
                            {
                                name: "biting_indoors",
                                label: "Preference for biting indoors",
                                type: "select",
                                required: true,
                                value: "high",
                                helpText: "High: indicates ~97% bites taken when people are indoors.<br/>" +
                                    "Low: indicates ~78% bites taken when people are indoors.",
                                options: [
                                    {id: "high", label: "High"},
                                    {id: "low", label: "Low"}
                                ]
                            }
                        ]
                    },
                    {
                        controls: [
                            {
                                name: "anthrophilic",
                                label: "Preference for biting people",
                                type: "select",
                                required: true,
                                value: "low",
                                helpText: "High: ~92% of mosquito bites taken on humans.<br/>" +
                                    "Low: ~74% of mosquito bites taken on humans.",
                                options: [
                                    {id: "low", label: "Low"},
                                    {id: "high", label: "High"}
                                ]
                            },
                        ]
                    },
                    {
                        controls: [
                            {
                                name: "resistance",
                                label: "Level of pyrethoid resistance",
                                type: "select",
                                required: true,
                                value: "0",
                                helpText: "Mosquito survival in 24-hour WHO discriminatory dose bioassays.<br/>" +
                                    "0% indicates all mosquitoes die and are susceptible to the pyrethroid insecticide in ITNs.<br/>" +
                                    "100% indicates that no mosquitoes die or are susceptible to the pyrethroid insecticide in ITNs.<br/>" +
                                    "Select the ranges that best represent the district. For example, if the district has susceptibility " +
                                    "bioassay test estimates that range from 23% to 42% of mosquitoes being killed, then explore both 60% " +
                                    "and 80% pyrethroid resistance scenarios.",
                                options: [
                                    {id: "0", label: "0"},
                                    {id: "0.2", label: "20%"},
                                    {id: "0.4", label: "40%"},
                                    {id: "0.6", label: "60%"},
                                    {id: "0.8", label: "80%"},
                                    {id: "1", label: "100%"},
                                ]
                            }
                        ]
                    },
                    {
                        controls: [
                            {
                                name: "metabolic",
                                label: "Evidence of PBO synergy",
                                type: "select",
                                required: true,
                                value: "yes",
                                helpText: "Yes: evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide.<br/>" +
                                    "No: no evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide.",
                                options: [
                                    {id: "yes", label: "Yes"},
                                    {id: "no", label: "No"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                label: "Past Vector Control",
                controlGroups: [
                    {
                        controls: [
                            {
                                name: "net",
                                label: "ITN population usage in last survey (%)",
                                type: "select",
                                required: true,
                                value: "0",
                                helpText: "The current endemicity of a zone is partly determined by the performance and " +
                                    "quantity of vector control leading up to now. This is required to approximate the " +
                                    "efficacy of interventions moving forward.",
                                options: [
                                    {id: "0", label: "0% usage"},
                                    {id: "0.2", label: "20% usage"},
                                    {id: "0.4", label: "40% usage"},
                                    {id: "0.6", label: "60% usage"},
                                    {id: "0.8", label: "80% usage"}
                                ]
                            }
                        ],
                    },
                    {
                        controls: [
                            {
                                name: "irs",
                                label: "What was the estimated coverage of spray campaign (last year)",
                                type: "select",
                                required: true,
                                value: "0",
                                helpText: "If IRS was not used in the past year, select 0% coverage",
                                options: [
                                    {id: "0", label: "0% coverage"},
                                    {id: "0.8", label: "80% coverage"}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

</script>
