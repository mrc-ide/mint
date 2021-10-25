import {shallowMount} from "@vue/test-utils";
import StrategyCharts from "../../../../app/components/figures/strategise/strategyCharts.vue";
import Vuex from "vuex";
import {mockProject, mockRootState} from "../../../mocks";
import Plotly from "../../../../app/components/figures/graphs/plotly/Plotly.vue";

describe("strategy charts", () => {

    it("renders charts", () => {
        const store = new Vuex.Store({
            state: mockRootState({
                currentProject: mockProject("My Project", ["Amber", "Ankh-Morpork", "Aramanth", "Asgard", "Atlantis", "Avalon"])
            })
        });
        store.state.currentProject!.regions[0].baselineSettings["population"] = 10;
        store.state.currentProject!.regions[1].baselineSettings["population"] = 20;
        store.state.currentProject!.regions[2].baselineSettings["population"] = 30;
        store.state.currentProject!.regions[3].baselineSettings["population"] = 40;
        store.state.currentProject!.regions[4].baselineSettings["population"] = 50;
        store.state.currentProject!.regions[5].baselineSettings["population"] = 60;
        const wrapper = shallowMount(StrategyCharts, {
            propsData: {
                strategy: {
                    costThreshold: 1,
                    interventions: [
                        {
                            zone: "Amber",
                            intervention: "irs",
                            cost: 1000,
                            casesAverted: 100,
                            casesAvertedErrorMinus: 80,
                            casesAvertedErrorPlus: 110
                        },
                        {
                            zone: "Ankh-Morpork",
                            intervention: "llin-pbo",
                            cost: 2000,
                            casesAverted: 200,
                            casesAvertedErrorMinus: 180,
                            casesAvertedErrorPlus: 210
                        },
                        {
                            zone: "Aramanth",
                            intervention: "irs-llin-pbo",
                            cost: 3000,
                            casesAverted: 300,
                            casesAvertedErrorMinus: 280,
                            casesAvertedErrorPlus: 310
                        },
                        {
                            zone: "Asgard",
                            intervention: "llin",
                            cost: 4000,
                            casesAverted: 400,
                            casesAvertedErrorMinus: 380,
                            casesAvertedErrorPlus: 410
                        },
                        {
                            zone: "Atlantis",
                            intervention: "irs-llin",
                            cost: 5000,
                            casesAverted: 500,
                            casesAvertedErrorMinus: 480,
                            casesAvertedErrorPlus: 510
                        },
                        {
                            zone: "Avalon",
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
        expect(chart.props("data")).toStrictEqual(    [
                {
                    error_y: { array: ["10"], arrayminus: ["20"] },
                    marker: { color: 'dbb8db' },
                    name: 'IRS* only',
                    showlegend: true,
                    type: 'bar',
                    x: [ 'Amber' ],
                    xaxis: 'x',
                    y: [ '100' ],
                    yaxis: 'y'
                },
                {
                    error_y: { array: ["1.0"], arrayminus: ["2.0"] },
                    marker: { color: 'dbb8db' },
                    name: 'IRS* only',
                    showlegend: false,
                    type: 'bar',
                    x: [ 'Amber' ],
                    xaxis: 'x2',
                    y: [ '10.0' ],
                    yaxis: 'y2'
                },
                {
                    error_y: { array: ["10"], arrayminus: ["20"] },
                    marker: { color: 'e0fae0' },
                    name: 'Pyrethroid-PBO ITN only',
                    showlegend: true,
                    type: 'bar',
                    x: [ 'Ankh-Morpork' ],
                    xaxis: 'x',
                    y: [ '200' ],
                    yaxis: 'y'
                },
                {
                    error_y: { array: ["0.5"], arrayminus: ["1.0"] },
                    marker: { color: 'e0fae0' },
                    name: 'Pyrethroid-PBO ITN only',
                    showlegend: false,
                    type: 'bar',
                    x: [ 'Ankh-Morpork' ],
                    xaxis: 'x2',
                    y: [ '10.0' ],
                    yaxis: 'y2'
                },
                {
                    error_y: { array: ["10"], arrayminus: ["20"] },
                    marker: { color: 'ffe6b8' },
                    name: 'Pyrethroid-PBO ITN with IRS*',
                    showlegend: true,
                    type: 'bar',
                    x: [ 'Aramanth' ],
                    xaxis: 'x',
                    y: [ '300' ],
                    yaxis: 'y'
                },
                {
                    error_y: { array: ["0.3"], arrayminus: ["0.7"] },
                    marker: { color: 'ffe6b8' },
                    name: 'Pyrethroid-PBO ITN with IRS*',
                    showlegend: false,
                    type: 'bar',
                    x: [ 'Aramanth' ],
                    xaxis: 'x2',
                    y: [ '10.0' ],
                    yaxis: 'y2'
                },
                {
                    error_y: { array: ["10"], arrayminus: ["20"] },
                    marker: { color: 'bbf0fb' },
                    name: 'Pyrethroid LLIN only',
                    showlegend: true,
                    type: 'bar',
                    x: [ 'Asgard' ],
                    xaxis: 'x',
                    y: [ '400' ],
                    yaxis: 'y'
                },
                {
                    error_y: { array: ["0.3"], arrayminus: ["0.5"] },
                    marker: { color: 'bbf0fb' },
                    name: 'Pyrethroid LLIN only',
                    showlegend: false,
                    type: 'bar',
                    x: [ 'Asgard' ],
                    xaxis: 'x2',
                    y: [ '10.0' ],
                    yaxis: 'y2'
                },
                {
                    error_y: { array: ["10"], arrayminus: ["20"] },
                    marker: { color: 'f5c6cb' },
                    name: 'Pyrethroid LLIN with IRS*',
                    showlegend: true,
                    type: 'bar',
                    x: [ 'Atlantis' ],
                    xaxis: 'x',
                    y: [ '500' ],
                    yaxis: 'y'
                },
                {
                    error_y: { array: ["0.2"], arrayminus: ["0.4"] },
                    marker: { color: 'f5c6cb' },
                    name: 'Pyrethroid LLIN with IRS*',
                    showlegend: false,
                    type: 'bar',
                    x: [ 'Atlantis' ],
                    xaxis: 'x2',
                    y: [ '10.0' ],
                    yaxis: 'y2'
                },
                {
                    error_y: { array: ["0"], arrayminus: ["0"] },
                    marker: { color: '' },
                    name: 'No intervention',
                    showlegend: false,
                    type: 'bar',
                    x: [ 'Avalon' ],
                    xaxis: 'x',
                    y: [ '0' ],
                    yaxis: 'y'
                },
                {
                    error_y: { array: ["0.0"], arrayminus: ["0.0"] },
                    marker: { color: '' },
                    name: 'No intervention',
                    showlegend: false,
                    type: 'bar',
                    x: [ 'Avalon' ],
                    xaxis: 'x2',
                    y: [ '0.0' ],
                    yaxis: 'y2'
                },
                {
                    error_y: { array: ["10"], arrayminus: ["20"] },
                    marker: { color: 'bbf0fb' },
                    name: 'Pyrethroid LLIN only',
                    showlegend: false,
                    type: 'bar',
                    x: [ 'Asgard' ],
                    xaxis: 'x',
                    y: [ '600' ],
                    yaxis: 'y'
                },
                {
                    error_y: { array: ["0.3"], arrayminus: ["0.5"] },
                    marker: { color: 'bbf0fb' },
                    name: 'Pyrethroid LLIN only',
                    showlegend: false,
                    type: 'bar',
                    x: [ 'Asgard' ],
                    xaxis: 'x2',
                    y: [ '15.0' ],
                    yaxis: 'y2'
                }
            ]
        );
    });

});
