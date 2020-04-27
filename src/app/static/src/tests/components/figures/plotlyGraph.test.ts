import {Plotly} from "vue-plotly";
import {mount} from "@vue/test-utils";
import plotlyGraph from "../../../app/components/figures/graphs/plotlyGraph.vue";

describe("plotly graph", () => {

    it("renders long format data graph", async () => {

        const wrapper = mount(plotlyGraph, {
            propsData: {
                series: [{
                    id: "none",
                    name: "No intervention",
                    type: "lines",
                    marker: {color: "grey"}
                }],
                metadata: {
                    x_col: "month",
                    y_col: "value",
                    id_col: "intervention",
                    format: "long"
                },
                layout: {title: "Test title"},
                data: [
                    {"month": 1, "intervention": "none", "net_use": 0, "value": 0.2315},
                    {"month": 2, "intervention": "none", "net_use": 0, "value": 0.7949},
                    {"month": 3, "intervention": "none", "net_use": 0, "value": 0.5171}
                ],
                settings: {
                    net_use: 0
                }
            }
        });

        expect(wrapper.find(Plotly).props("layout")).toEqual({title: "Test title"});
        expect(wrapper.find(Plotly).props("data").length).toBe(1);
        expect(wrapper.find(Plotly).props("data")[0]).toEqual({
            id: "none",
            name: "No intervention",
            type: "lines",
            marker: {color: "grey"},
            x: [1, 2, 3],
            y: [0.2315, 0.7949, 0.5171]
        });
    });

    it("renders wide format data graph", async () => {

        const wrapper = mount(plotlyGraph, {
            propsData: {
                series: [
                    {
                        x: ["ITN"],
                        id: "ITN",
                        type: "bar",
                        name: "Pyrethoid ITN",
                        marker: {
                            color: "blue"
                        }
                    },
                    {
                        x: ["PBO"],
                        id: "PBO",
                        type: "bar",
                        name: "Switch to Pyrethoid-PBO ITN",
                        marker: {
                            color: "aquamarine"
                        }
                    }
                ],
                metadata: {
                    cols: ["cases_averted"],
                    id_col: "intervention",
                    format: "wide"
                },
                layout: {title: "Test title"},
                data: [
                    {"intervention": "ITN", "net_use": 0, "prevalence": 0.2315, "cases_averted": 1000},
                    {"intervention": "PBO", "net_use": 0, "prevalence": 0.7949, "cases_averted": 500}
                ],
                settings: {
                    net_use: 0
                }
            }
        });

        expect(wrapper.find(Plotly).props("layout")).toEqual({title: "Test title"});
        expect(wrapper.find(Plotly).props("data").length).toBe(2);
        expect(wrapper.find(Plotly).props("data")[0]).toEqual({
            id: "ITN",
            name: "Pyrethoid ITN",
            type: "bar",
            marker: {color: "blue"},
            x: ["ITN"],
            y: [1000]
        });
        expect(wrapper.find(Plotly).props("data")[1]).toEqual({
            id: "PBO",
            name: "Switch to Pyrethoid-PBO ITN",
            type: "bar",
            marker: {color: "aquamarine"},
            x: ["PBO"],
            y: [500]
        });
    });

});
