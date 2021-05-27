import {migrateSettings} from "../app/migrations";
import {RootState} from "../app/store";

describe("migrations", () => {

    const state = () => (
        {
            "projects":
                [
                    {
                        "name": "a",
                        "slug": "a",
                        "regions": [
                            {
                                "name": "b",
                                "slug": "b",
                                "url": "/projects/a/regions/b",
                                "baselineOptions": {
                                    "controlSections": [
                                        {
                                            "label": "Site Inputs",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "population",
                                                            "label": "Population Size",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 1000,
                                                            "min": 1,
                                                            "max": 10000000
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "seasonalityOfTransmission",
                                                            "label": "Seasonality of transmission",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "perennial",
                                                            "helpText": "Seasonal: a district with a transmission season.<br/>Perennial: a district with transmission throughout the year.",
                                                            "options": [
                                                                {
                                                                    "id": "seasonal",
                                                                    "label": "Seasonal"
                                                                },
                                                                {
                                                                    "id": "perennial",
                                                                    "label": "Perennial"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "currentPrevalence",
                                                            "label": "Current malaria prevalence",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "high",
                                                            "helpText": "Low = less than 10% of children under 5-years have malaria<br/>Medium = approximately 30% of children under 5-years have malaria<br/>High = approximately 65% of children  under 5-years have malaria",
                                                            "options": [
                                                                {
                                                                    "id": "low",
                                                                    "label": "Low"
                                                                },
                                                                {
                                                                    "id": "med",
                                                                    "label": "Medium"
                                                                },
                                                                {
                                                                    "id": "high",
                                                                    "label": "High"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "documentation": "<strong>Population size</strong><p>Enter the approximate population size of the district or sub-district to which vector control will be applied to enable incremental cost estimates of any change in vector control.</p><strong>Seasonality of transmission</strong><p>Select seasonal settings if the region of interest has a distinct transmission season or perennial if transmission is throughout the year.</p><strong>Current malaria prevalence</strong><p>Define the current endemicity of your setting as measured by the percentage of children 0-5 years of age who are diagnosed with falciparum malaria by microscopy. Available options are low (less than 10% of children have malaria), medium (approximately 30% of children have malaria), or high (approximately 65% of children have malaria) as measured during the transmission season.</p>"
                                        },
                                        {
                                            "label": "Mosquito Inputs",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "bitingIndoors",
                                                            "label": "Preference for biting indoors",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "high",
                                                            "helpText": "High: indicates ~97% bites taken when people are indoors.<br/>Low: indicates ~78% bites taken when people are indoors.",
                                                            "options": [
                                                                {
                                                                    "id": "high",
                                                                    "label": "High"
                                                                },
                                                                {
                                                                    "id": "low",
                                                                    "label": "Low"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "bitingPeople",
                                                            "label": "Preference for biting people",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "high",
                                                            "helpText": "High: ~92% of mosquito bites taken on humans.<br/>Low: ~74% of mosquito bites taken on humans.",
                                                            "options": [
                                                                {
                                                                    "id": "low",
                                                                    "label": "Low"
                                                                },
                                                                {
                                                                    "id": "high",
                                                                    "label": "High"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "levelOfResistance",
                                                            "label": "Level of pyrethroid resistance",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "80%",
                                                            "helpText": "Mosquito survival in 24-hour WHO discriminatory dose bioassays.<br/>0% indicates all mosquitoes die and are susceptible to the pyrethroid insecticide in ITNs.<br/>100% indicates that no mosquitoes die or are susceptible to the pyrethroid insecticide in ITNs.<br/>Select the ranges that best represent the district. For example, if the district has susceptibility bioassay test estimates that range from 23% to 42% of mosquitoes being killed, then explore both 60% and 80% pyrethroid resistance scenarios.",
                                                            "options": [
                                                                {
                                                                    "id": "0%",
                                                                    "label": "0%"
                                                                },
                                                                {
                                                                    "id": "20%",
                                                                    "label": "20%"
                                                                },
                                                                {
                                                                    "id": "40%",
                                                                    "label": "40%"
                                                                },
                                                                {
                                                                    "id": "60%",
                                                                    "label": "60%"
                                                                },
                                                                {
                                                                    "id": "80%",
                                                                    "label": "80%"
                                                                },
                                                                {
                                                                    "id": "100%",
                                                                    "label": "100%"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "metabolic",
                                                            "label": "Evidence of PBO synergy",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "yes",
                                                            "helpText": "Yes: evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide.<br/>No: no evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide.",
                                                            "options": [
                                                                {
                                                                    "id": "yes",
                                                                    "label": "Yes"
                                                                },
                                                                {
                                                                    "id": "no",
                                                                    "label": "No"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "documentation": "<p>Values chosen should represent the average mosquito transmitting malaria throughout the year. If multiple vectors are present then the characteristics should be weighted towards the dominant vector species.</p><strong>Preference for biting indoors</strong><p>Mosquitoes may show differing propensity to bite people when they are indoors. High indicates ~97% bites taken when people are indoors whilst selecting low represents ~87% bites taken when people are indoors.</p><strong>Preference for biting people</strong><p>Mosquitoes show different preference for biting humans relative to other animals. A high value for the preference for biting people corresponds to ~92% of mosquito bites that are taken on humans whilst a low value equates to ~74% of all bites taken on humans.</p><strong>Level of pyrethroid resistance</strong><p>Mosquito survival in 24-hour WHO discriminatory dose bioassays. <ul><li>0% indicates all mosquitoes die and are susceptible to the pyrethroid insecticide in LLINs.</li><li>100% indicates all mosquitoes survive and are resistant to the pyrethroid insecticide in LLINs.</li></p><strong>Evidence of PBO synergy</strong><p>Is there evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide or that metabolic mechanisms contribute resistance in the local mosquito population.</p>"
                                        },
                                        {
                                            "label": "Past Vector Control",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "itnUsage",
                                                            "label": "ITN population usage in last survey (%)",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "40%",
                                                            "helpText": "The current endemicity of a zone is partly determined by the performance and quantity of vector control leading up to now. This is required to approximate the efficacy of interventions moving forward.",
                                                            "options": [
                                                                {
                                                                    "id": "0%",
                                                                    "label": "0% usage"
                                                                },
                                                                {
                                                                    "id": "20%",
                                                                    "label": "20% usage"
                                                                },
                                                                {
                                                                    "id": "40%",
                                                                    "label": "40% usage"
                                                                },
                                                                {
                                                                    "id": "60%",
                                                                    "label": "60% usage"
                                                                },
                                                                {
                                                                    "id": "80%",
                                                                    "label": "80% usage"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "sprayInput",
                                                            "label": "What was the estimated coverage of spray campaign (last year)",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "80%",
                                                            "helpText": "If IRS was not used in the past year, select 0% coverage",
                                                            "options": [
                                                                {
                                                                    "id": "0%",
                                                                    "label": "0% coverage"
                                                                },
                                                                {
                                                                    "id": "80%",
                                                                    "label": "80% coverage"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "documentation": "<p>The endemicity of a setting is determined by the mosquito ecology, community activities and environment but also the historic pressure from interventions that are controlling malaria transmission. Therefore, please answer the following questions to put the zone into context.</p><strong>ITN population usage in last survey (%)</strong><p>This can be found from Demographic Health Surveys or other surveys on net use completed in this zone</p><strong>Recent spray campaign</strong><p>Please choose an option from the drop down tab. If there was a spray campaign in the last year please select 80%, otherwise select 0%.</p>"
                                        }
                                    ]
                                },
                                "baselineSettings": {
                                    "population": 1000,
                                    "seasonalityOfTransmission": "perennial",
                                    "currentPrevalence": "high",
                                    "bitingIndoors": "high",
                                    "bitingPeople": "high",
                                    "levelOfResistance": "80%",
                                    "metabolic": "yes",
                                    "itnUsage": "40%",
                                    "sprayInput": "80%"
                                },
                                "interventionOptions": {
                                    "controlSections": [
                                        {
                                            "label": "Intervention coverage potential",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "netUse",
                                                            "label": "Expected ITN population use given access",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "helpText": "Explore the impact of different ITNs given the expected use of nets by the community (the percentage of people sleeping under ITN). A single expected usage can be selected to represent expected ITN use immediately after a mass distribution campaign. The impact of standard pyrethroid only ITNs or PBO ITNs are show (only one net type is implemented for any single scenario).",
                                                            "options": [
                                                                {
                                                                    "id": "0",
                                                                    "label": "0% usage"
                                                                },
                                                                {
                                                                    "id": "0.2",
                                                                    "label": "20% usage"
                                                                },
                                                                {
                                                                    "id": "0.3",
                                                                    "label": "30% usage"
                                                                },
                                                                {
                                                                    "id": "0.4",
                                                                    "label": "40% usage"
                                                                },
                                                                {
                                                                    "id": "0.5",
                                                                    "label": "50% usage"
                                                                },
                                                                {
                                                                    "id": "0.6",
                                                                    "label": "60% usage"
                                                                },
                                                                {
                                                                    "id": "0.7",
                                                                    "label": "70% usage"
                                                                },
                                                                {
                                                                    "id": "0.8",
                                                                    "label": "80% usage"
                                                                },
                                                                {
                                                                    "id": "0.9",
                                                                    "label": "90% usage"
                                                                },
                                                                {
                                                                    "id": "1",
                                                                    "label": "100% usage"
                                                                }
                                                            ],
                                                            "value": "0.7"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "irsUse",
                                                            "label": "Expected IRS* coverage",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "helpText": "Indoor residual spraying can be added to areas in addition of any ITN scenarios selected. Houses to receive IRS are selected at random (irrespective of ITN coverage) and coverage estimates represents the percentage of the population living in houses with IRS. Care should be taken interpreting results as IRS is often highly clustered within smaller geographical areas. The model predicts the impact of a long-lasting IRS product (for example Actellic 300CS or Sumishield) and is repeated annually prior to the peak of the transmission season (if 'seasonal' transmission setting selected).",
                                                            "options": [
                                                                {
                                                                    "id": "0",
                                                                    "label": "0% coverage"
                                                                },
                                                                {
                                                                    "id": "0.6",
                                                                    "label": "60% coverage"
                                                                },
                                                                {
                                                                    "id": "0.7",
                                                                    "label": "70% coverage"
                                                                },
                                                                {
                                                                    "id": "0.8",
                                                                    "label": "80% coverage"
                                                                },
                                                                {
                                                                    "id": "0.9",
                                                                    "label": "90% coverage"
                                                                },
                                                                {
                                                                    "id": "1",
                                                                    "label": "100% coverage"
                                                                }
                                                            ],
                                                            "value": "0"
                                                        }
                                                    ]
                                                }
                                            ],
                                            "collapsible": true,
                                            "documentation": "<strong>Expected ITN population use given access</strong><p>User enters the expected optimal ITN usage among people in the community after the mass distribution campaign. This will determine the intervention efficacy and cost-effectiveness of the campaign. Only one net type is implemented for an intervention zone. We compare which will be most cost effective within budget.</p><strong>Expected IRS* coverage</strong><p>Indoor residual spraying can be added to zones instead, or in addition to, ITNs (of any type). Houses to receive IRS are selected at random (irrespective of ITN ownership) and IRS coverage estimates represent the percentage of the population living in houses with IRS. Care should be taken interpreting results as IRS is often highly clustered within a small geographical areas. The model predicts the impact of a long-lasting IRS product (for example Actellic 300CS or Sumishield) where spraying is repeated annually prior to the peak of the transmission season (if seasonal setting selected in baseline inputs).</p><p><i>*IRS refers to a long-lasting non-pyrethroid IRS product (impact reflects recent Actellic 300CS and SumiShield products).</i></p>"
                                        },
                                        {
                                            "label": "Procurement and distribution",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "procurePeoplePerNet",
                                                            "label": "When planning procurement, what number of people per net is used?",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 1.8
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "procureBuffer",
                                                            "label": "What percentage is your procurement buffer, if used? (%)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 7
                                                        }
                                                    ]
                                                }
                                            ],
                                            "collapsible": true,
                                            "documentation": "<p>The delivery of nets and sprays is conducted differently in each country. Please answer the following questions so that the price estimates for impact can be augmented appropriately.</p><strong>When planning procurement, what number of people per net is used?</strong><p>The default estimate is most commonly cited as the number of people per net used for planning mass distributions of nets.</p><strong>What percentage is your procurement buffer, if used?</strong><p>When nets are procured, there is a buffer to ensure there is not a short fall. Please indicate your estimate here. This is used to adjust cost estimates.</p>"
                                        },
                                        {
                                            "label": "Price of interventions",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "priceNetStandard",
                                                            "label": "Price of pyrethroid LLIN ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 1.5
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "priceNetPBO",
                                                            "label": "Price of PBO ITN ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 2.5
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "priceDelivery",
                                                            "label": "ITN mass distribution campaign delivery cost per person ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 2.75
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "priceIRSPerPerson",
                                                            "label": "Annual cost of IRS* per person ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 5.73,
                                                            "helpText": "Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "budgetAllZones",
                                                            "label": "Total available budget ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 2000000,
                                                            "helpText": "Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "zonal_budget",
                                                            "label": "Zonal budget ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 500000.05
                                                        }
                                                    ]
                                                }
                                            ],
                                            "collapsible": true,
                                            "documentation": "<p>The price of different vector control interventions will vary so can be defined by the user in $USD. For simplicity, it is assumed that there is a linear relationship between cost and population coverage, we do not consider inflation in this iteration of the tool.</p><strong>Price of pyrethroid LLIN ($USD)</strong><p>Price per pyrethroid-only ITN (expected to be replaced every 3-years).</p><strong>Price of Pyrethroid-PBO ITN ($USD)</strong><p>Price per Pyrethroid-PBO ITN (expected to be replaced every 3-years).</p><strong>ITN mass distribution campaign delivery cost per person ($USD)</strong><p>Cost to deliver nets to each person (equivalent for each ITN type). enough nets are provided to match the number of people per net and the procurement buffer.</p><strong>Annual cost of IRS* per person ($USD)</strong><p>The price per person of long-lasting IRS product averaged for each year. Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)</p><strong>Total available budget ($USD)</strong><p>The total available budget to cover the next 3-years, is required to assess the most feasible intervention options across zones. Cost effectivessness can be optimised across zones.</p><strong>Zonal budget ($USD)</strong><p>The decision makers can choose to cap the budget for each zone to some specified maximum. Please enter the budget for this zone.</p><p>To compare the cost effectiveness of products, the costs are estimated across a 3-year period to account for the different distribution schedules of net mass campaigns and IRS deployment.</p><p><i>*IRS refers to a long-lasting non-pyrethroid IRS product (impact reflects recent Actellic 300CS and SumiShield products).</i></p>"
                                        }
                                    ]
                                },
                                "interventionSettings": {
                                    "netUse": "0.7",
                                    "irsUse": "0",
                                    "procurePeoplePerNet": 1.8,
                                    "procureBuffer": 7,
                                    "priceNetStandard": 1.5,
                                    "priceNetPBO": 2.5,
                                    "priceDelivery": 2.75,
                                    "priceIRSPerPerson": 5.73,
                                    "budgetAllZones": 2000000,
                                    "zonal_budget": 500000.05
                                },
                                "prevalenceGraphData": [],
                                "tableData": [],
                                "step": 2
                            }
                        ],
                        "currentRegion": {
                            "name": "b",
                            "slug": "b",
                            "url": "/projects/a/regions/b",
                            "baselineOptions": {
                                "controlSections": [
                                    {
                                        "label": "Site Inputs",
                                        "controlGroups": [
                                            {
                                                "controls": [
                                                    {
                                                        "name": "population",
                                                        "label": "Population Size",
                                                        "type": "number",
                                                        "required": true,
                                                        "value": 1000,
                                                        "min": 1,
                                                        "max": 10000000
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "seasonalityOfTransmission",
                                                        "label": "Seasonality of transmission",
                                                        "type": "select",
                                                        "excludeNullOption": true,
                                                        "required": true,
                                                        "value": "perennial",
                                                        "helpText": "Seasonal: a district with a transmission season.<br/>Perennial: a district with transmission throughout the year.",
                                                        "options": [
                                                            {
                                                                "id": "seasonal",
                                                                "label": "Seasonal"
                                                            },
                                                            {
                                                                "id": "perennial",
                                                                "label": "Perennial"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "currentPrevalence",
                                                        "label": "Current malaria prevalence",
                                                        "type": "select",
                                                        "excludeNullOption": true,
                                                        "required": true,
                                                        "value": "high",
                                                        "helpText": "Low = less than 10% of children under 5-years have malaria<br/>Medium = approximately 30% of children under 5-years have malaria<br/>High = approximately 65% of children  under 5-years have malaria",
                                                        "options": [
                                                            {
                                                                "id": "low",
                                                                "label": "Low"
                                                            },
                                                            {
                                                                "id": "med",
                                                                "label": "Medium"
                                                            },
                                                            {
                                                                "id": "high",
                                                                "label": "High"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "documentation": "<strong>Population size</strong><p>Enter the approximate population size of the district or sub-district to which vector control will be applied to enable incremental cost estimates of any change in vector control.</p><strong>Seasonality of transmission</strong><p>Select seasonal settings if the region of interest has a distinct transmission season or perennial if transmission is throughout the year.</p><strong>Current malaria prevalence</strong><p>Define the current endemicity of your setting as measured by the percentage of children 0-5 years of age who are diagnosed with falciparum malaria by microscopy. Available options are low (less than 10% of children have malaria), medium (approximately 30% of children have malaria), or high (approximately 65% of children have malaria) as measured during the transmission season.</p>"
                                    },
                                    {
                                        "label": "Mosquito Inputs",
                                        "controlGroups": [
                                            {
                                                "controls": [
                                                    {
                                                        "name": "bitingIndoors",
                                                        "label": "Preference for biting indoors",
                                                        "type": "select",
                                                        "excludeNullOption": true,
                                                        "required": true,
                                                        "value": "high",
                                                        "helpText": "High: indicates ~97% bites taken when people are indoors.<br/>Low: indicates ~78% bites taken when people are indoors.",
                                                        "options": [
                                                            {
                                                                "id": "high",
                                                                "label": "High"
                                                            },
                                                            {
                                                                "id": "low",
                                                                "label": "Low"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "bitingPeople",
                                                        "label": "Preference for biting people",
                                                        "type": "select",
                                                        "excludeNullOption": true,
                                                        "required": true,
                                                        "value": "high",
                                                        "helpText": "High: ~92% of mosquito bites taken on humans.<br/>Low: ~74% of mosquito bites taken on humans.",
                                                        "options": [
                                                            {
                                                                "id": "low",
                                                                "label": "Low"
                                                            },
                                                            {
                                                                "id": "high",
                                                                "label": "High"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "levelOfResistance",
                                                        "label": "Level of pyrethroid resistance",
                                                        "type": "select",
                                                        "excludeNullOption": true,
                                                        "required": true,
                                                        "value": "80%",
                                                        "helpText": "Mosquito survival in 24-hour WHO discriminatory dose bioassays.<br/>0% indicates all mosquitoes die and are susceptible to the pyrethroid insecticide in ITNs.<br/>100% indicates that no mosquitoes die or are susceptible to the pyrethroid insecticide in ITNs.<br/>Select the ranges that best represent the district. For example, if the district has susceptibility bioassay test estimates that range from 23% to 42% of mosquitoes being killed, then explore both 60% and 80% pyrethroid resistance scenarios.",
                                                        "options": [
                                                            {
                                                                "id": "0%",
                                                                "label": "0%"
                                                            },
                                                            {
                                                                "id": "20%",
                                                                "label": "20%"
                                                            },
                                                            {
                                                                "id": "40%",
                                                                "label": "40%"
                                                            },
                                                            {
                                                                "id": "60%",
                                                                "label": "60%"
                                                            },
                                                            {
                                                                "id": "80%",
                                                                "label": "80%"
                                                            },
                                                            {
                                                                "id": "100%",
                                                                "label": "100%"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "metabolic",
                                                        "label": "Evidence of PBO synergy",
                                                        "type": "select",
                                                        "excludeNullOption": true,
                                                        "required": true,
                                                        "value": "yes",
                                                        "helpText": "Yes: evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide.<br/>No: no evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide.",
                                                        "options": [
                                                            {
                                                                "id": "yes",
                                                                "label": "Yes"
                                                            },
                                                            {
                                                                "id": "no",
                                                                "label": "No"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "documentation": "<p>Values chosen should represent the average mosquito transmitting malaria throughout the year. If multiple vectors are present then the characteristics should be weighted towards the dominant vector species.</p><strong>Preference for biting indoors</strong><p>Mosquitoes may show differing propensity to bite people when they are indoors. High indicates ~97% bites taken when people are indoors whilst selecting low represents ~87% bites taken when people are indoors.</p><strong>Preference for biting people</strong><p>Mosquitoes show different preference for biting humans relative to other animals. A high value for the preference for biting people corresponds to ~92% of mosquito bites that are taken on humans whilst a low value equates to ~74% of all bites taken on humans.</p><strong>Level of pyrethroid resistance</strong><p>Mosquito survival in 24-hour WHO discriminatory dose bioassays. <ul><li>0% indicates all mosquitoes die and are susceptible to the pyrethroid insecticide in LLINs.</li><li>100% indicates all mosquitoes survive and are resistant to the pyrethroid insecticide in LLINs.</li></p><strong>Evidence of PBO synergy</strong><p>Is there evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide or that metabolic mechanisms contribute resistance in the local mosquito population.</p>"
                                    },
                                    {
                                        "label": "Past Vector Control",
                                        "controlGroups": [
                                            {
                                                "controls": [
                                                    {
                                                        "name": "itnUsage",
                                                        "label": "ITN population usage in last survey (%)",
                                                        "type": "select",
                                                        "excludeNullOption": true,
                                                        "required": true,
                                                        "value": "40%",
                                                        "helpText": "The current endemicity of a zone is partly determined by the performance and quantity of vector control leading up to now. This is required to approximate the efficacy of interventions moving forward.",
                                                        "options": [
                                                            {
                                                                "id": "0%",
                                                                "label": "0% usage"
                                                            },
                                                            {
                                                                "id": "20%",
                                                                "label": "20% usage"
                                                            },
                                                            {
                                                                "id": "40%",
                                                                "label": "40% usage"
                                                            },
                                                            {
                                                                "id": "60%",
                                                                "label": "60% usage"
                                                            },
                                                            {
                                                                "id": "80%",
                                                                "label": "80% usage"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "sprayInput",
                                                        "label": "What was the estimated coverage of spray campaign (last year)",
                                                        "type": "select",
                                                        "excludeNullOption": true,
                                                        "required": true,
                                                        "value": "80%",
                                                        "helpText": "If IRS was not used in the past year, select 0% coverage",
                                                        "options": [
                                                            {
                                                                "id": "0%",
                                                                "label": "0% coverage"
                                                            },
                                                            {
                                                                "id": "80%",
                                                                "label": "80% coverage"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ],
                                        "documentation": "<p>The endemicity of a setting is determined by the mosquito ecology, community activities and environment but also the historic pressure from interventions that are controlling malaria transmission. Therefore, please answer the following questions to put the zone into context.</p><strong>ITN population usage in last survey (%)</strong><p>This can be found from Demographic Health Surveys or other surveys on net use completed in this zone</p><strong>Recent spray campaign</strong><p>Please choose an option from the drop down tab. If there was a spray campaign in the last year please select 80%, otherwise select 0%.</p>"
                                    }
                                ]
                            },
                            "baselineSettings": {
                                "population": 1000,
                                "seasonalityOfTransmission": "perennial",
                                "currentPrevalence": "high",
                                "bitingIndoors": "high",
                                "bitingPeople": "high",
                                "levelOfResistance": "80%",
                                "metabolic": "yes",
                                "itnUsage": "40%",
                                "sprayInput": "80%"
                            },
                            "interventionOptions": {
                                "controlSections": [
                                    {
                                        "label": "Intervention coverage potential",
                                        "controlGroups": [
                                            {
                                                "controls": [
                                                    {
                                                        "name": "netUse",
                                                        "label": "Expected ITN population use given access",
                                                        "type": "select",
                                                        "excludeNullOption": true,
                                                        "required": true,
                                                        "helpText": "Explore the impact of different ITNs given the expected use of nets by the community (the percentage of people sleeping under ITN). A single expected usage can be selected to represent expected ITN use immediately after a mass distribution campaign. The impact of standard pyrethroid only ITNs or PBO ITNs are show (only one net type is implemented for any single scenario).",
                                                        "options": [
                                                            {
                                                                "id": "0",
                                                                "label": "0% usage"
                                                            },
                                                            {
                                                                "id": "0.2",
                                                                "label": "20% usage"
                                                            },
                                                            {
                                                                "id": "0.3",
                                                                "label": "30% usage"
                                                            },
                                                            {
                                                                "id": "0.4",
                                                                "label": "40% usage"
                                                            },
                                                            {
                                                                "id": "0.5",
                                                                "label": "50% usage"
                                                            },
                                                            {
                                                                "id": "0.6",
                                                                "label": "60% usage"
                                                            },
                                                            {
                                                                "id": "0.7",
                                                                "label": "70% usage"
                                                            },
                                                            {
                                                                "id": "0.8",
                                                                "label": "80% usage"
                                                            },
                                                            {
                                                                "id": "0.9",
                                                                "label": "90% usage"
                                                            },
                                                            {
                                                                "id": "1",
                                                                "label": "100% usage"
                                                            }
                                                        ],
                                                        "value": "0.7"
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "irsUse",
                                                        "label": "Expected IRS* coverage",
                                                        "type": "select",
                                                        "excludeNullOption": true,
                                                        "required": true,
                                                        "helpText": "Indoor residual spraying can be added to areas in addition of any ITN scenarios selected. Houses to receive IRS are selected at random (irrespective of ITN coverage) and coverage estimates represents the percentage of the population living in houses with IRS. Care should be taken interpreting results as IRS is often highly clustered within smaller geographical areas. The model predicts the impact of a long-lasting IRS product (for example Actellic 300CS or Sumishield) and is repeated annually prior to the peak of the transmission season (if 'seasonal' transmission setting selected).",
                                                        "options": [
                                                            {
                                                                "id": "0",
                                                                "label": "0% coverage"
                                                            },
                                                            {
                                                                "id": "0.6",
                                                                "label": "60% coverage"
                                                            },
                                                            {
                                                                "id": "0.7",
                                                                "label": "70% coverage"
                                                            },
                                                            {
                                                                "id": "0.8",
                                                                "label": "80% coverage"
                                                            },
                                                            {
                                                                "id": "0.9",
                                                                "label": "90% coverage"
                                                            },
                                                            {
                                                                "id": "1",
                                                                "label": "100% coverage"
                                                            }
                                                        ],
                                                        "value": "0"
                                                    }
                                                ]
                                            }
                                        ],
                                        "collapsible": true,
                                        "documentation": "<strong>Expected ITN population use given access</strong><p>User enters the expected optimal ITN usage among people in the community after the mass distribution campaign. This will determine the intervention efficacy and cost-effectiveness of the campaign. Only one net type is implemented for an intervention zone. We compare which will be most cost effective within budget.</p><strong>Expected IRS* coverage</strong><p>Indoor residual spraying can be added to zones instead, or in addition to, ITNs (of any type). Houses to receive IRS are selected at random (irrespective of ITN ownership) and IRS coverage estimates represent the percentage of the population living in houses with IRS. Care should be taken interpreting results as IRS is often highly clustered within a small geographical areas. The model predicts the impact of a long-lasting IRS product (for example Actellic 300CS or Sumishield) where spraying is repeated annually prior to the peak of the transmission season (if seasonal setting selected in baseline inputs).</p><p><i>*IRS refers to a long-lasting non-pyrethroid IRS product (impact reflects recent Actellic 300CS and SumiShield products).</i></p>"
                                    },
                                    {
                                        "label": "Procurement and distribution",
                                        "controlGroups": [
                                            {
                                                "controls": [
                                                    {
                                                        "name": "procurePeoplePerNet",
                                                        "label": "When planning procurement, what number of people per net is used?",
                                                        "type": "number",
                                                        "required": true,
                                                        "value": 1.8
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "procureBuffer",
                                                        "label": "What percentage is your procurement buffer, if used? (%)",
                                                        "type": "number",
                                                        "required": true,
                                                        "value": 7
                                                    }
                                                ]
                                            }
                                        ],
                                        "collapsible": true,
                                        "documentation": "<p>The delivery of nets and sprays is conducted differently in each country. Please answer the following questions so that the price estimates for impact can be augmented appropriately.</p><strong>When planning procurement, what number of people per net is used?</strong><p>The default estimate is most commonly cited as the number of people per net used for planning mass distributions of nets.</p><strong>What percentage is your procurement buffer, if used?</strong><p>When nets are procured, there is a buffer to ensure there is not a short fall. Please indicate your estimate here. This is used to adjust cost estimates.</p>"
                                    },
                                    {
                                        "label": "Price of interventions",
                                        "controlGroups": [
                                            {
                                                "controls": [
                                                    {
                                                        "name": "priceNetStandard",
                                                        "label": "Price of pyrethroid LLIN ($USD)",
                                                        "type": "number",
                                                        "required": true,
                                                        "value": 1.5
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "priceNetPBO",
                                                        "label": "Price of PBO ITN ($USD)",
                                                        "type": "number",
                                                        "required": true,
                                                        "value": 2.5
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "priceDelivery",
                                                        "label": "ITN mass distribution campaign delivery cost per person ($USD)",
                                                        "type": "number",
                                                        "required": true,
                                                        "value": 2.75
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "priceIRSPerPerson",
                                                        "label": "Annual cost of IRS* per person ($USD)",
                                                        "type": "number",
                                                        "required": true,
                                                        "value": 5.73,
                                                        "helpText": "Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)"
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "budgetAllZones",
                                                        "label": "Total available budget ($USD)",
                                                        "type": "number",
                                                        "required": true,
                                                        "value": 2000000,
                                                        "helpText": "Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)"
                                                    }
                                                ]
                                            },
                                            {
                                                "controls": [
                                                    {
                                                        "name": "zonal_budget",
                                                        "label": "Zonal budget ($USD)",
                                                        "type": "number",
                                                        "required": true,
                                                        "value": 500000.05
                                                    }
                                                ]
                                            }
                                        ],
                                        "collapsible": true,
                                        "documentation": "<p>The price of different vector control interventions will vary so can be defined by the user in $USD. For simplicity, it is assumed that there is a linear relationship between cost and population coverage, we do not consider inflation in this iteration of the tool.</p><strong>Price of pyrethroid LLIN ($USD)</strong><p>Price per pyrethroid-only ITN (expected to be replaced every 3-years).</p><strong>Price of Pyrethroid-PBO ITN ($USD)</strong><p>Price per Pyrethroid-PBO ITN (expected to be replaced every 3-years).</p><strong>ITN mass distribution campaign delivery cost per person ($USD)</strong><p>Cost to deliver nets to each person (equivalent for each ITN type). enough nets are provided to match the number of people per net and the procurement buffer.</p><strong>Annual cost of IRS* per person ($USD)</strong><p>The price per person of long-lasting IRS product averaged for each year. Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)</p><strong>Total available budget ($USD)</strong><p>The total available budget to cover the next 3-years, is required to assess the most feasible intervention options across zones. Cost effectivessness can be optimised across zones.</p><strong>Zonal budget ($USD)</strong><p>The decision makers can choose to cap the budget for each zone to some specified maximum. Please enter the budget for this zone.</p><p>To compare the cost effectiveness of products, the costs are estimated across a 3-year period to account for the different distribution schedules of net mass campaigns and IRS deployment.</p><p><i>*IRS refers to a long-lasting non-pyrethroid IRS product (impact reflects recent Actellic 300CS and SumiShield products).</i></p>"
                                    }
                                ]
                            },
                            "interventionSettings": {
                                "netUse": "0.7",
                                "irsUse": "0",
                                "procurePeoplePerNet": 1.8,
                                "procureBuffer": 7,
                                "priceNetStandard": 1.5,
                                "priceNetPBO": 2.5,
                                "priceDelivery": 2.75,
                                "priceIRSPerPerson": 5.73,
                                "budgetAllZones": 2000000,
                                "zonal_budget": 500000.05
                            },
                            "prevalenceGraphData": [],
                            "tableData": [],
                            "step": 2
                        }
                    }
                ],
            "currentProject":
                {
                    "name":
                        "a",
                    "slug":
                        "a",
                    "regions":
                        [
                            {
                                "name": "b",
                                "slug": "b",
                                "url": "/projects/a/regions/b",
                                "baselineOptions": {
                                    "controlSections": [
                                        {
                                            "label": "Site Inputs",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "population",
                                                            "label": "Population Size",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 1000,
                                                            "min": 1,
                                                            "max": 10000000
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "seasonalityOfTransmission",
                                                            "label": "Seasonality of transmission",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "perennial",
                                                            "helpText": "Seasonal: a district with a transmission season.<br/>Perennial: a district with transmission throughout the year.",
                                                            "options": [
                                                                {
                                                                    "id": "seasonal",
                                                                    "label": "Seasonal"
                                                                },
                                                                {
                                                                    "id": "perennial",
                                                                    "label": "Perennial"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "currentPrevalence",
                                                            "label": "Current malaria prevalence",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "high",
                                                            "helpText": "Low = less than 10% of children under 5-years have malaria<br/>Medium = approximately 30% of children under 5-years have malaria<br/>High = approximately 65% of children  under 5-years have malaria",
                                                            "options": [
                                                                {
                                                                    "id": "low",
                                                                    "label": "Low"
                                                                },
                                                                {
                                                                    "id": "med",
                                                                    "label": "Medium"
                                                                },
                                                                {
                                                                    "id": "high",
                                                                    "label": "High"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "documentation": "<strong>Population size</strong><p>Enter the approximate population size of the district or sub-district to which vector control will be applied to enable incremental cost estimates of any change in vector control.</p><strong>Seasonality of transmission</strong><p>Select seasonal settings if the region of interest has a distinct transmission season or perennial if transmission is throughout the year.</p><strong>Current malaria prevalence</strong><p>Define the current endemicity of your setting as measured by the percentage of children 0-5 years of age who are diagnosed with falciparum malaria by microscopy. Available options are low (less than 10% of children have malaria), medium (approximately 30% of children have malaria), or high (approximately 65% of children have malaria) as measured during the transmission season.</p>"
                                        },
                                        {
                                            "label": "Mosquito Inputs",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "bitingIndoors",
                                                            "label": "Preference for biting indoors",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "high",
                                                            "helpText": "High: indicates ~97% bites taken when people are indoors.<br/>Low: indicates ~78% bites taken when people are indoors.",
                                                            "options": [
                                                                {
                                                                    "id": "high",
                                                                    "label": "High"
                                                                },
                                                                {
                                                                    "id": "low",
                                                                    "label": "Low"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "bitingPeople",
                                                            "label": "Preference for biting people",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "high",
                                                            "helpText": "High: ~92% of mosquito bites taken on humans.<br/>Low: ~74% of mosquito bites taken on humans.",
                                                            "options": [
                                                                {
                                                                    "id": "low",
                                                                    "label": "Low"
                                                                },
                                                                {
                                                                    "id": "high",
                                                                    "label": "High"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "levelOfResistance",
                                                            "label": "Level of pyrethroid resistance",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "80%",
                                                            "helpText": "Mosquito survival in 24-hour WHO discriminatory dose bioassays.<br/>0% indicates all mosquitoes die and are susceptible to the pyrethroid insecticide in ITNs.<br/>100% indicates that no mosquitoes die or are susceptible to the pyrethroid insecticide in ITNs.<br/>Select the ranges that best represent the district. For example, if the district has susceptibility bioassay test estimates that range from 23% to 42% of mosquitoes being killed, then explore both 60% and 80% pyrethroid resistance scenarios.",
                                                            "options": [
                                                                {
                                                                    "id": "0%",
                                                                    "label": "0%"
                                                                },
                                                                {
                                                                    "id": "20%",
                                                                    "label": "20%"
                                                                },
                                                                {
                                                                    "id": "40%",
                                                                    "label": "40%"
                                                                },
                                                                {
                                                                    "id": "60%",
                                                                    "label": "60%"
                                                                },
                                                                {
                                                                    "id": "80%",
                                                                    "label": "80%"
                                                                },
                                                                {
                                                                    "id": "100%",
                                                                    "label": "100%"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "metabolic",
                                                            "label": "Evidence of PBO synergy",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "yes",
                                                            "helpText": "Yes: evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide.<br/>No: no evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide.",
                                                            "options": [
                                                                {
                                                                    "id": "yes",
                                                                    "label": "Yes"
                                                                },
                                                                {
                                                                    "id": "no",
                                                                    "label": "No"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "documentation": "<p>Values chosen should represent the average mosquito transmitting malaria throughout the year. If multiple vectors are present then the characteristics should be weighted towards the dominant vector species.</p><strong>Preference for biting indoors</strong><p>Mosquitoes may show differing propensity to bite people when they are indoors. High indicates ~97% bites taken when people are indoors whilst selecting low represents ~87% bites taken when people are indoors.</p><strong>Preference for biting people</strong><p>Mosquitoes show different preference for biting humans relative to other animals. A high value for the preference for biting people corresponds to ~92% of mosquito bites that are taken on humans whilst a low value equates to ~74% of all bites taken on humans.</p><strong>Level of pyrethroid resistance</strong><p>Mosquito survival in 24-hour WHO discriminatory dose bioassays. <ul><li>0% indicates all mosquitoes die and are susceptible to the pyrethroid insecticide in LLINs.</li><li>100% indicates all mosquitoes survive and are resistant to the pyrethroid insecticide in LLINs.</li></p><strong>Evidence of PBO synergy</strong><p>Is there evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide or that metabolic mechanisms contribute resistance in the local mosquito population.</p>"
                                        },
                                        {
                                            "label": "Past Vector Control",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "itnUsage",
                                                            "label": "ITN population usage in last survey (%)",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "40%",
                                                            "helpText": "The current endemicity of a zone is partly determined by the performance and quantity of vector control leading up to now. This is required to approximate the efficacy of interventions moving forward.",
                                                            "options": [
                                                                {
                                                                    "id": "0%",
                                                                    "label": "0% usage"
                                                                },
                                                                {
                                                                    "id": "20%",
                                                                    "label": "20% usage"
                                                                },
                                                                {
                                                                    "id": "40%",
                                                                    "label": "40% usage"
                                                                },
                                                                {
                                                                    "id": "60%",
                                                                    "label": "60% usage"
                                                                },
                                                                {
                                                                    "id": "80%",
                                                                    "label": "80% usage"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "sprayInput",
                                                            "label": "What was the estimated coverage of spray campaign (last year)",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "value": "80%",
                                                            "helpText": "If IRS was not used in the past year, select 0% coverage",
                                                            "options": [
                                                                {
                                                                    "id": "0%",
                                                                    "label": "0% coverage"
                                                                },
                                                                {
                                                                    "id": "80%",
                                                                    "label": "80% coverage"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ],
                                            "documentation": "<p>The endemicity of a setting is determined by the mosquito ecology, community activities and environment but also the historic pressure from interventions that are controlling malaria transmission. Therefore, please answer the following questions to put the zone into context.</p><strong>ITN population usage in last survey (%)</strong><p>This can be found from Demographic Health Surveys or other surveys on net use completed in this zone</p><strong>Recent spray campaign</strong><p>Please choose an option from the drop down tab. If there was a spray campaign in the last year please select 80%, otherwise select 0%.</p>"
                                        }
                                    ]
                                },
                                "baselineSettings": {
                                    "population": 1000,
                                    "seasonalityOfTransmission": "perennial",
                                    "currentPrevalence": "high",
                                    "bitingIndoors": "high",
                                    "bitingPeople": "high",
                                    "levelOfResistance": "80%",
                                    "metabolic": "yes",
                                    "itnUsage": "40%",
                                    "sprayInput": "80%"
                                },
                                "interventionOptions": {
                                    "controlSections": [
                                        {
                                            "label": "Intervention coverage potential",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "netUse",
                                                            "label": "Expected ITN population use given access",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "helpText": "Explore the impact of different ITNs given the expected use of nets by the community (the percentage of people sleeping under ITN). A single expected usage can be selected to represent expected ITN use immediately after a mass distribution campaign. The impact of standard pyrethroid only ITNs or PBO ITNs are show (only one net type is implemented for any single scenario).",
                                                            "options": [
                                                                {
                                                                    "id": "0",
                                                                    "label": "0% usage"
                                                                },
                                                                {
                                                                    "id": "0.2",
                                                                    "label": "20% usage"
                                                                },
                                                                {
                                                                    "id": "0.3",
                                                                    "label": "30% usage"
                                                                },
                                                                {
                                                                    "id": "0.4",
                                                                    "label": "40% usage"
                                                                },
                                                                {
                                                                    "id": "0.5",
                                                                    "label": "50% usage"
                                                                },
                                                                {
                                                                    "id": "0.6",
                                                                    "label": "60% usage"
                                                                },
                                                                {
                                                                    "id": "0.7",
                                                                    "label": "70% usage"
                                                                },
                                                                {
                                                                    "id": "0.8",
                                                                    "label": "80% usage"
                                                                },
                                                                {
                                                                    "id": "0.9",
                                                                    "label": "90% usage"
                                                                },
                                                                {
                                                                    "id": "1",
                                                                    "label": "100% usage"
                                                                }
                                                            ],
                                                            "value": "0.7"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "irsUse",
                                                            "label": "Expected IRS* coverage",
                                                            "type": "select",
                                                            "excludeNullOption": true,
                                                            "required": true,
                                                            "helpText": "Indoor residual spraying can be added to areas in addition of any ITN scenarios selected. Houses to receive IRS are selected at random (irrespective of ITN coverage) and coverage estimates represents the percentage of the population living in houses with IRS. Care should be taken interpreting results as IRS is often highly clustered within smaller geographical areas. The model predicts the impact of a long-lasting IRS product (for example Actellic 300CS or Sumishield) and is repeated annually prior to the peak of the transmission season (if 'seasonal' transmission setting selected).",
                                                            "options": [
                                                                {
                                                                    "id": "0",
                                                                    "label": "0% coverage"
                                                                },
                                                                {
                                                                    "id": "0.6",
                                                                    "label": "60% coverage"
                                                                },
                                                                {
                                                                    "id": "0.7",
                                                                    "label": "70% coverage"
                                                                },
                                                                {
                                                                    "id": "0.8",
                                                                    "label": "80% coverage"
                                                                },
                                                                {
                                                                    "id": "0.9",
                                                                    "label": "90% coverage"
                                                                },
                                                                {
                                                                    "id": "1",
                                                                    "label": "100% coverage"
                                                                }
                                                            ],
                                                            "value": "0"
                                                        }
                                                    ]
                                                }
                                            ],
                                            "collapsible": true,
                                            "documentation": "<strong>Expected ITN population use given access</strong><p>User enters the expected optimal ITN usage among people in the community after the mass distribution campaign. This will determine the intervention efficacy and cost-effectiveness of the campaign. Only one net type is implemented for an intervention zone. We compare which will be most cost effective within budget.</p><strong>Expected IRS* coverage</strong><p>Indoor residual spraying can be added to zones instead, or in addition to, ITNs (of any type). Houses to receive IRS are selected at random (irrespective of ITN ownership) and IRS coverage estimates represent the percentage of the population living in houses with IRS. Care should be taken interpreting results as IRS is often highly clustered within a small geographical areas. The model predicts the impact of a long-lasting IRS product (for example Actellic 300CS or Sumishield) where spraying is repeated annually prior to the peak of the transmission season (if seasonal setting selected in baseline inputs).</p><p><i>*IRS refers to a long-lasting non-pyrethroid IRS product (impact reflects recent Actellic 300CS and SumiShield products).</i></p>"
                                        },
                                        {
                                            "label": "Procurement and distribution",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "procurePeoplePerNet",
                                                            "label": "When planning procurement, what number of people per net is used?",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 1.8
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "procureBuffer",
                                                            "label": "What percentage is your procurement buffer, if used? (%)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 7
                                                        }
                                                    ]
                                                }
                                            ],
                                            "collapsible": true,
                                            "documentation": "<p>The delivery of nets and sprays is conducted differently in each country. Please answer the following questions so that the price estimates for impact can be augmented appropriately.</p><strong>When planning procurement, what number of people per net is used?</strong><p>The default estimate is most commonly cited as the number of people per net used for planning mass distributions of nets.</p><strong>What percentage is your procurement buffer, if used?</strong><p>When nets are procured, there is a buffer to ensure there is not a short fall. Please indicate your estimate here. This is used to adjust cost estimates.</p>"
                                        },
                                        {
                                            "label": "Price of interventions",
                                            "controlGroups": [
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "priceNetStandard",
                                                            "label": "Price of pyrethroid LLIN ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 1.5
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "priceNetPBO",
                                                            "label": "Price of PBO ITN ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 2.5
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "priceDelivery",
                                                            "label": "ITN mass distribution campaign delivery cost per person ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 2.75
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "priceIRSPerPerson",
                                                            "label": "Annual cost of IRS* per person ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 5.73,
                                                            "helpText": "Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "budgetAllZones",
                                                            "label": "Total available budget ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 2000000,
                                                            "helpText": "Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "controls": [
                                                        {
                                                            "name": "zonal_budget",
                                                            "label": "Zonal budget ($USD)",
                                                            "type": "number",
                                                            "required": true,
                                                            "value": 500000.05
                                                        }
                                                    ]
                                                }
                                            ],
                                            "collapsible": true,
                                            "documentation": "<p>The price of different vector control interventions will vary so can be defined by the user in $USD. For simplicity, it is assumed that there is a linear relationship between cost and population coverage, we do not consider inflation in this iteration of the tool.</p><strong>Price of pyrethroid LLIN ($USD)</strong><p>Price per pyrethroid-only ITN (expected to be replaced every 3-years).</p><strong>Price of Pyrethroid-PBO ITN ($USD)</strong><p>Price per Pyrethroid-PBO ITN (expected to be replaced every 3-years).</p><strong>ITN mass distribution campaign delivery cost per person ($USD)</strong><p>Cost to deliver nets to each person (equivalent for each ITN type). enough nets are provided to match the number of people per net and the procurement buffer.</p><strong>Annual cost of IRS* per person ($USD)</strong><p>The price per person of long-lasting IRS product averaged for each year. Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)</p><strong>Total available budget ($USD)</strong><p>The total available budget to cover the next 3-years, is required to assess the most feasible intervention options across zones. Cost effectivessness can be optimised across zones.</p><strong>Zonal budget ($USD)</strong><p>The decision makers can choose to cap the budget for each zone to some specified maximum. Please enter the budget for this zone.</p><p>To compare the cost effectiveness of products, the costs are estimated across a 3-year period to account for the different distribution schedules of net mass campaigns and IRS deployment.</p><p><i>*IRS refers to a long-lasting non-pyrethroid IRS product (impact reflects recent Actellic 300CS and SumiShield products).</i></p>"
                                        }
                                    ]
                                },
                                "interventionSettings": {
                                    "netUse": "0.7",
                                    "irsUse": "0",
                                    "procurePeoplePerNet": 1.8,
                                    "procureBuffer": 7,
                                    "priceNetStandard": 1.5,
                                    "priceNetPBO": 2.5,
                                    "priceDelivery": 2.75,
                                    "priceIRSPerPerson": 5.73,
                                    "budgetAllZones": 2000000,
                                    "zonal_budget": 500000.05
                                },
                                "prevalenceGraphData": [],
                                "tableData": [],
                                "step": 2
                            }
                        ],
                    "currentRegion":
                        {
                            "name":
                                "b",
                            "slug":
                                "b",
                            "url":
                                "/projects/a/regions/b",
                            "baselineOptions":
                                {
                                    "controlSections":
                                        [
                                            {
                                                "label": "Site Inputs",
                                                "controlGroups": [
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "population",
                                                                "label": "Population Size",
                                                                "type": "number",
                                                                "required": true,
                                                                "value": 1000,
                                                                "min": 1,
                                                                "max": 10000000
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "seasonalityOfTransmission",
                                                                "label": "Seasonality of transmission",
                                                                "type": "select",
                                                                "excludeNullOption": true,
                                                                "required": true,
                                                                "value": "perennial",
                                                                "helpText": "Seasonal: a district with a transmission season.<br/>Perennial: a district with transmission throughout the year.",
                                                                "options": [
                                                                    {
                                                                        "id": "seasonal",
                                                                        "label": "Seasonal"
                                                                    },
                                                                    {
                                                                        "id": "perennial",
                                                                        "label": "Perennial"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "currentPrevalence",
                                                                "label": "Current malaria prevalence",
                                                                "type": "select",
                                                                "excludeNullOption": true,
                                                                "required": true,
                                                                "value": "high",
                                                                "helpText": "Low = less than 10% of children under 5-years have malaria<br/>Medium = approximately 30% of children under 5-years have malaria<br/>High = approximately 65% of children  under 5-years have malaria",
                                                                "options": [
                                                                    {
                                                                        "id": "low",
                                                                        "label": "Low"
                                                                    },
                                                                    {
                                                                        "id": "med",
                                                                        "label": "Medium"
                                                                    },
                                                                    {
                                                                        "id": "high",
                                                                        "label": "High"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "documentation": "<strong>Population size</strong><p>Enter the approximate population size of the district or sub-district to which vector control will be applied to enable incremental cost estimates of any change in vector control.</p><strong>Seasonality of transmission</strong><p>Select seasonal settings if the region of interest has a distinct transmission season or perennial if transmission is throughout the year.</p><strong>Current malaria prevalence</strong><p>Define the current endemicity of your setting as measured by the percentage of children 0-5 years of age who are diagnosed with falciparum malaria by microscopy. Available options are low (less than 10% of children have malaria), medium (approximately 30% of children have malaria), or high (approximately 65% of children have malaria) as measured during the transmission season.</p>"
                                            },
                                            {
                                                "label": "Mosquito Inputs",
                                                "controlGroups": [
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "bitingIndoors",
                                                                "label": "Preference for biting indoors",
                                                                "type": "select",
                                                                "excludeNullOption": true,
                                                                "required": true,
                                                                "value": "high",
                                                                "helpText": "High: indicates ~97% bites taken when people are indoors.<br/>Low: indicates ~78% bites taken when people are indoors.",
                                                                "options": [
                                                                    {
                                                                        "id": "high",
                                                                        "label": "High"
                                                                    },
                                                                    {
                                                                        "id": "low",
                                                                        "label": "Low"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "bitingPeople",
                                                                "label": "Preference for biting people",
                                                                "type": "select",
                                                                "excludeNullOption": true,
                                                                "required": true,
                                                                "value": "high",
                                                                "helpText": "High: ~92% of mosquito bites taken on humans.<br/>Low: ~74% of mosquito bites taken on humans.",
                                                                "options": [
                                                                    {
                                                                        "id": "low",
                                                                        "label": "Low"
                                                                    },
                                                                    {
                                                                        "id": "high",
                                                                        "label": "High"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "levelOfResistance",
                                                                "label": "Level of pyrethroid resistance",
                                                                "type": "select",
                                                                "excludeNullOption": true,
                                                                "required": true,
                                                                "value": "80%",
                                                                "helpText": "Mosquito survival in 24-hour WHO discriminatory dose bioassays.<br/>0% indicates all mosquitoes die and are susceptible to the pyrethroid insecticide in ITNs.<br/>100% indicates that no mosquitoes die or are susceptible to the pyrethroid insecticide in ITNs.<br/>Select the ranges that best represent the district. For example, if the district has susceptibility bioassay test estimates that range from 23% to 42% of mosquitoes being killed, then explore both 60% and 80% pyrethroid resistance scenarios.",
                                                                "options": [
                                                                    {
                                                                        "id": "0%",
                                                                        "label": "0%"
                                                                    },
                                                                    {
                                                                        "id": "20%",
                                                                        "label": "20%"
                                                                    },
                                                                    {
                                                                        "id": "40%",
                                                                        "label": "40%"
                                                                    },
                                                                    {
                                                                        "id": "60%",
                                                                        "label": "60%"
                                                                    },
                                                                    {
                                                                        "id": "80%",
                                                                        "label": "80%"
                                                                    },
                                                                    {
                                                                        "id": "100%",
                                                                        "label": "100%"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "metabolic",
                                                                "label": "Evidence of PBO synergy",
                                                                "type": "select",
                                                                "excludeNullOption": true,
                                                                "required": true,
                                                                "value": "yes",
                                                                "helpText": "Yes: evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide.<br/>No: no evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide.",
                                                                "options": [
                                                                    {
                                                                        "id": "yes",
                                                                        "label": "Yes"
                                                                    },
                                                                    {
                                                                        "id": "no",
                                                                        "label": "No"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "documentation": "<p>Values chosen should represent the average mosquito transmitting malaria throughout the year. If multiple vectors are present then the characteristics should be weighted towards the dominant vector species.</p><strong>Preference for biting indoors</strong><p>Mosquitoes may show differing propensity to bite people when they are indoors. High indicates ~97% bites taken when people are indoors whilst selecting low represents ~87% bites taken when people are indoors.</p><strong>Preference for biting people</strong><p>Mosquitoes show different preference for biting humans relative to other animals. A high value for the preference for biting people corresponds to ~92% of mosquito bites that are taken on humans whilst a low value equates to ~74% of all bites taken on humans.</p><strong>Level of pyrethroid resistance</strong><p>Mosquito survival in 24-hour WHO discriminatory dose bioassays. <ul><li>0% indicates all mosquitoes die and are susceptible to the pyrethroid insecticide in LLINs.</li><li>100% indicates all mosquitoes survive and are resistant to the pyrethroid insecticide in LLINs.</li></p><strong>Evidence of PBO synergy</strong><p>Is there evidence that PBO (piperonyl butoxide) synergises pyrethroid insecticide or that metabolic mechanisms contribute resistance in the local mosquito population.</p>"
                                            },
                                            {
                                                "label": "Past Vector Control",
                                                "controlGroups": [
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "itnUsage",
                                                                "label": "ITN population usage in last survey (%)",
                                                                "type": "select",
                                                                "excludeNullOption": true,
                                                                "required": true,
                                                                "value": "40%",
                                                                "helpText": "The current endemicity of a zone is partly determined by the performance and quantity of vector control leading up to now. This is required to approximate the efficacy of interventions moving forward.",
                                                                "options": [
                                                                    {
                                                                        "id": "0%",
                                                                        "label": "0% usage"
                                                                    },
                                                                    {
                                                                        "id": "20%",
                                                                        "label": "20% usage"
                                                                    },
                                                                    {
                                                                        "id": "40%",
                                                                        "label": "40% usage"
                                                                    },
                                                                    {
                                                                        "id": "60%",
                                                                        "label": "60% usage"
                                                                    },
                                                                    {
                                                                        "id": "80%",
                                                                        "label": "80% usage"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "sprayInput",
                                                                "label": "What was the estimated coverage of spray campaign (last year)",
                                                                "type": "select",
                                                                "excludeNullOption": true,
                                                                "required": true,
                                                                "value": "80%",
                                                                "helpText": "If IRS was not used in the past year, select 0% coverage",
                                                                "options": [
                                                                    {
                                                                        "id": "0%",
                                                                        "label": "0% coverage"
                                                                    },
                                                                    {
                                                                        "id": "80%",
                                                                        "label": "80% coverage"
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "documentation": "<p>The endemicity of a setting is determined by the mosquito ecology, community activities and environment but also the historic pressure from interventions that are controlling malaria transmission. Therefore, please answer the following questions to put the zone into context.</p><strong>ITN population usage in last survey (%)</strong><p>This can be found from Demographic Health Surveys or other surveys on net use completed in this zone</p><strong>Recent spray campaign</strong><p>Please choose an option from the drop down tab. If there was a spray campaign in the last year please select 80%, otherwise select 0%.</p>"
                                            }
                                        ]
                                }
                            ,
                            "baselineSettings":
                                {
                                    "population":
                                        1000,
                                    "seasonalityOfTransmission":
                                        "perennial",
                                    "currentPrevalence":
                                        "high",
                                    "bitingIndoors":
                                        "high",
                                    "bitingPeople":
                                        "high",
                                    "levelOfResistance":
                                        "80%",
                                    "metabolic":
                                        "yes",
                                    "itnUsage":
                                        "40%",
                                    "sprayInput":
                                        "80%"
                                }
                            ,
                            "interventionOptions":
                                {
                                    "controlSections":
                                        [
                                            {
                                                "label": "Intervention coverage potential",
                                                "controlGroups": [
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "netUse",
                                                                "label": "Expected ITN population use given access",
                                                                "type": "select",
                                                                "excludeNullOption": true,
                                                                "required": true,
                                                                "helpText": "Explore the impact of different ITNs given the expected use of nets by the community (the percentage of people sleeping under ITN). A single expected usage can be selected to represent expected ITN use immediately after a mass distribution campaign. The impact of standard pyrethroid only ITNs or PBO ITNs are show (only one net type is implemented for any single scenario).",
                                                                "options": [
                                                                    {
                                                                        "id": "0",
                                                                        "label": "0% usage"
                                                                    },
                                                                    {
                                                                        "id": "0.2",
                                                                        "label": "20% usage"
                                                                    },
                                                                    {
                                                                        "id": "0.3",
                                                                        "label": "30% usage"
                                                                    },
                                                                    {
                                                                        "id": "0.4",
                                                                        "label": "40% usage"
                                                                    },
                                                                    {
                                                                        "id": "0.5",
                                                                        "label": "50% usage"
                                                                    },
                                                                    {
                                                                        "id": "0.6",
                                                                        "label": "60% usage"
                                                                    },
                                                                    {
                                                                        "id": "0.7",
                                                                        "label": "70% usage"
                                                                    },
                                                                    {
                                                                        "id": "0.8",
                                                                        "label": "80% usage"
                                                                    },
                                                                    {
                                                                        "id": "0.9",
                                                                        "label": "90% usage"
                                                                    },
                                                                    {
                                                                        "id": "1",
                                                                        "label": "100% usage"
                                                                    }
                                                                ],
                                                                "value": "0.7"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "irsUse",
                                                                "label": "Expected IRS* coverage",
                                                                "type": "select",
                                                                "excludeNullOption": true,
                                                                "required": true,
                                                                "helpText": "Indoor residual spraying can be added to areas in addition of any ITN scenarios selected. Houses to receive IRS are selected at random (irrespective of ITN coverage) and coverage estimates represents the percentage of the population living in houses with IRS. Care should be taken interpreting results as IRS is often highly clustered within smaller geographical areas. The model predicts the impact of a long-lasting IRS product (for example Actellic 300CS or Sumishield) and is repeated annually prior to the peak of the transmission season (if 'seasonal' transmission setting selected).",
                                                                "options": [
                                                                    {
                                                                        "id": "0",
                                                                        "label": "0% coverage"
                                                                    },
                                                                    {
                                                                        "id": "0.6",
                                                                        "label": "60% coverage"
                                                                    },
                                                                    {
                                                                        "id": "0.7",
                                                                        "label": "70% coverage"
                                                                    },
                                                                    {
                                                                        "id": "0.8",
                                                                        "label": "80% coverage"
                                                                    },
                                                                    {
                                                                        "id": "0.9",
                                                                        "label": "90% coverage"
                                                                    },
                                                                    {
                                                                        "id": "1",
                                                                        "label": "100% coverage"
                                                                    }
                                                                ],
                                                                "value": "0"
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "collapsible": true,
                                                "documentation": "<strong>Expected ITN population use given access</strong><p>User enters the expected optimal ITN usage among people in the community after the mass distribution campaign. This will determine the intervention efficacy and cost-effectiveness of the campaign. Only one net type is implemented for an intervention zone. We compare which will be most cost effective within budget.</p><strong>Expected IRS* coverage</strong><p>Indoor residual spraying can be added to zones instead, or in addition to, ITNs (of any type). Houses to receive IRS are selected at random (irrespective of ITN ownership) and IRS coverage estimates represent the percentage of the population living in houses with IRS. Care should be taken interpreting results as IRS is often highly clustered within a small geographical areas. The model predicts the impact of a long-lasting IRS product (for example Actellic 300CS or Sumishield) where spraying is repeated annually prior to the peak of the transmission season (if seasonal setting selected in baseline inputs).</p><p><i>*IRS refers to a long-lasting non-pyrethroid IRS product (impact reflects recent Actellic 300CS and SumiShield products).</i></p>"
                                            },
                                            {
                                                "label": "Procurement and distribution",
                                                "controlGroups": [
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "procurePeoplePerNet",
                                                                "label": "When planning procurement, what number of people per net is used?",
                                                                "type": "number",
                                                                "required": true,
                                                                "value": 1.8
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "procureBuffer",
                                                                "label": "What percentage is your procurement buffer, if used? (%)",
                                                                "type": "number",
                                                                "required": true,
                                                                "value": 7
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "collapsible": true,
                                                "documentation": "<p>The delivery of nets and sprays is conducted differently in each country. Please answer the following questions so that the price estimates for impact can be augmented appropriately.</p><strong>When planning procurement, what number of people per net is used?</strong><p>The default estimate is most commonly cited as the number of people per net used for planning mass distributions of nets.</p><strong>What percentage is your procurement buffer, if used?</strong><p>When nets are procured, there is a buffer to ensure there is not a short fall. Please indicate your estimate here. This is used to adjust cost estimates.</p>"
                                            },
                                            {
                                                "label": "Price of interventions",
                                                "controlGroups": [
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "priceNetStandard",
                                                                "label": "Price of pyrethroid LLIN ($USD)",
                                                                "type": "number",
                                                                "required": true,
                                                                "value": 1.5
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "priceNetPBO",
                                                                "label": "Price of PBO ITN ($USD)",
                                                                "type": "number",
                                                                "required": true,
                                                                "value": 2.5
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "priceDelivery",
                                                                "label": "ITN mass distribution campaign delivery cost per person ($USD)",
                                                                "type": "number",
                                                                "required": true,
                                                                "value": 2.75
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "priceIRSPerPerson",
                                                                "label": "Annual cost of IRS* per person ($USD)",
                                                                "type": "number",
                                                                "required": true,
                                                                "value": 5.73,
                                                                "helpText": "Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "budgetAllZones",
                                                                "label": "Total available budget ($USD)",
                                                                "type": "number",
                                                                "required": true,
                                                                "value": 2000000,
                                                                "helpText": "Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "controls": [
                                                            {
                                                                "name": "zonal_budget",
                                                                "label": "Zonal budget ($USD)",
                                                                "type": "number",
                                                                "required": true,
                                                                "value": 500000.05
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "collapsible": true,
                                                "documentation": "<p>The price of different vector control interventions will vary so can be defined by the user in $USD. For simplicity, it is assumed that there is a linear relationship between cost and population coverage, we do not consider inflation in this iteration of the tool.</p><strong>Price of pyrethroid LLIN ($USD)</strong><p>Price per pyrethroid-only ITN (expected to be replaced every 3-years).</p><strong>Price of Pyrethroid-PBO ITN ($USD)</strong><p>Price per Pyrethroid-PBO ITN (expected to be replaced every 3-years).</p><strong>ITN mass distribution campaign delivery cost per person ($USD)</strong><p>Cost to deliver nets to each person (equivalent for each ITN type). enough nets are provided to match the number of people per net and the procurement buffer.</p><strong>Annual cost of IRS* per person ($USD)</strong><p>The price per person of long-lasting IRS product averaged for each year. Include the average cost for both the IRS product and implementation of IRS. If different IRS products are used in different years, please average the product costs and provide an annual cost per person protected by IRS (in $USD)</p><strong>Total available budget ($USD)</strong><p>The total available budget to cover the next 3-years, is required to assess the most feasible intervention options across zones. Cost effectivessness can be optimised across zones.</p><strong>Zonal budget ($USD)</strong><p>The decision makers can choose to cap the budget for each zone to some specified maximum. Please enter the budget for this zone.</p><p>To compare the cost effectiveness of products, the costs are estimated across a 3-year period to account for the different distribution schedules of net mass campaigns and IRS deployment.</p><p><i>*IRS refers to a long-lasting non-pyrethroid IRS product (impact reflects recent Actellic 300CS and SumiShield products).</i></p>"
                                            }
                                        ]
                                }
                            ,
                            "interventionSettings":
                                {
                                    "netUse":
                                        "0.7",
                                    "irsUse":
                                        "0",
                                    "procurePeoplePerNet":
                                        1.8,
                                    "procureBuffer":
                                        7,
                                    "priceNetStandard":
                                        1.5,
                                    "priceNetPBO":
                                        2.5,
                                    "priceDelivery":
                                        2.75,
                                    "priceIRSPerPerson":
                                        5.73,
                                    "budgetAllZones":
                                        2000000,
                                    "zonal_budget":
                                        500000.05
                                }
                            ,
                            "prevalenceGraphData":
                                [],
                            "tableData":
                                [],
                            "step":
                                2
                        }
                }
        } as Partial<RootState>
    );

    it("can migrate settings", () => {
        const expectedState = state();
        expectedState.currentProject!.currentRegion.baselineSettings["currentPrevalence"] = "60%";
        expectedState.currentProject!.regions[0].baselineSettings["currentPrevalence"] = "60%";
        expectedState.projects![0].currentRegion.baselineSettings["currentPrevalence"] = "60%";
        expectedState.projects![0].regions[0].baselineSettings["currentPrevalence"] = "60%";
        const receivedState = state();
        migrateSettings(receivedState);
        expect(receivedState).toEqual(expectedState);
    });
});
