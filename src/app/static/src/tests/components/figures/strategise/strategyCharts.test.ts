import {shallowMount} from "@vue/test-utils";
import StrategyCharts from "../../../../app/components/figures/strategise/strategyCharts.vue";
import Vuex from "vuex";
import {mockProject, mockRootState} from "../../../mocks";
import Plotly from "../../../../app/components/figures/graphs/plotly/Plotly.vue";

describe("strategy charts", () => {

    it("renders charts", () => {
        const store = new Vuex.Store({
            state: mockRootState({
                currentProject: mockProject("My Project", ["Avalon", "Atlantis", "Asgard"])
            })
        });
        store.state.currentProject!.regions[0].baselineSettings["population"] = 1000;
        store.state.currentProject!.regions[1].baselineSettings["population"] = 2000;
        store.state.currentProject!.regions[2].baselineSettings["population"] = 3000;
        const wrapper = shallowMount(StrategyCharts, {
            propsData: {
                strategy: {
                    costThreshold: 1,
                    interventions: [
                        {
                            zone: "Avalon",
                            intervention: "irs",
                            cost: 500,
                            casesAverted: 300,
                            casesAvertedErrorMinus: 290,
                            casesAvertedErrorPlus: 320
                        },
                        {
                            zone: "Atlantis",
                            intervention: "none",
                            cost: 0,
                            casesAverted: 0,
                            casesAvertedErrorMinus: 0,
                            casesAvertedErrorPlus: 0
                        },
                        {
                            zone: "Asgard",
                            intervention: "llin",
                            cost: 750,
                            casesAverted: 600,
                            casesAvertedErrorMinus: 580,
                            casesAvertedErrorPlus: 610
                        }
                    ]
                }
            },
            store
        });

        const chart = wrapper.findComponent(Plotly);
        expect(chart.isVisible()).toBe(true);
        expect(chart.props("layout")).toStrictEqual(
            {
                "grid": {
                    "columns": 2, "pattern": "independent", "rows": 1
                },
                "title": "Cases averted per region",
                "yaxis": {
                    "title": "Total cases averted"
                },
                "yaxis2": {
                    "title": "Cases averted per person"
                }
            }
        );
        expect(chart.props("data")).toStrictEqual(
            [
                {
                    "error_y": {
                        "array": ["20"],
                        "arrayminus": ["10"]
                    },
                    marker: {color: "dbb8db"},
                    name: "IRS* only",
                    showlegend: true,
                    type: "bar",
                    x: ["Avalon"],
                    xaxis: "x",
                    y: ["300"],
                    yaxis: "y"
                },
                {
                    "error_y": {
                        "array": ["0.0"],
                        "arrayminus": ["0.0"]
                    },
                    marker: {color: "dbb8db"},
                    name: "IRS* only",
                    showlegend: false,
                    type: "bar",
                    x: ["Avalon"],
                    xaxis: "x2",
                    y: ["0.3"],
                    yaxis: "y2"
                },
                {
                    "error_y": {
                        "array": ["0"],
                        "arrayminus": ["0"]
                    },
                    marker: {color: ""},
                    name: "No intervention",
                    showlegend: false,
                    type: "bar",
                    x: ["Atlantis"],
                    xaxis: "x",
                    y: ["0"],
                    yaxis: "y"
                },
                {
                    "error_y": {
                        "array": ["0.0"],
                        "arrayminus": ["0.0"]
                    },
                    marker: {color: ""},
                    name: "No intervention",
                    showlegend: false,
                    type: "bar",
                    x: ["Atlantis"],
                    xaxis: "x2",
                    y: ["0.0"],
                    yaxis: "y2"
                },
                {
                    "error_y": {
                        "array": ["10"],
                        "arrayminus": ["20"]
                    },
                    marker: {color: "bbf0fb"},
                    name: "Pyrethroid LLIN only",
                    showlegend: true,
                    type: "bar",
                    x: ["Asgard"],
                    xaxis: "x",
                    y: ["600"],
                    yaxis: "y"
                },
                {
                    "error_y": {
                        "array": ["0.0"],
                        "arrayminus": ["0.0"]
                    },
                    marker: {color: "bbf0fb"},
                    name: "Pyrethroid LLIN only",
                    showlegend: false,
                    type: "bar",
                    x: ["Asgard"],
                    xaxis: "x2",
                    y: ["0.2"],
                    yaxis: "y2"
                }
            ]
        );
    });

});
