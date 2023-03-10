import $ from 'jquery';
import Plotly from "../../../app/components/figures/graphs/plotly/Plotly.vue";
import {mount, shallowMount, Wrapper} from "@vue/test-utils";
import plotlyGraph from "../../../app/components/figures/graphs/plotlyGraph.vue";

describe("plotly graph", () => {

    let wrapper: Wrapper<plotlyGraph> | null;
    const expectedFontSettings = {
        // use the same font settings as Bootstrap, which the rest of the app uses
        family: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
        size: '1rem',
        color: '#212529'
    }

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("renders long format data graph", async () => {

        wrapper = mount(plotlyGraph, {
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

        expect(wrapper.find(Plotly).props("layout")).toEqual({title: "Test title", font: expectedFontSettings});
        expect(wrapper.find(Plotly).props("data").length).toBe(1);
        expect(wrapper.find(Plotly).props("data")[0]).toEqual({
            id: "none",
            name: "No intervention",
            type: "lines",
            marker: {color: "grey"},
            x: [1, 2, 3],
            y: [0.2315, 0.7949, 0.5171]
        });

        const dataSummary = wrapper.find(".mint-plot-data-summary");
        expect(dataSummary.attributes("hidden")).toBe("hidden");
        const dataSummarySeries = dataSummary.findAll(".mint-plot-data-summary-series");
        expect(dataSummarySeries.length).toBe(1);
        const summary = dataSummarySeries.at(0);
        expect(summary.attributes("name")).toBe("No intervention");
        expect(summary.attributes("id")).toBe("none");
        expect(summary.attributes("type")).toBe("lines");
        expect(summary.attributes("count")).toBe("3");
        expect(summary.attributes("x-first")).toBe("1");
        expect(summary.attributes("x-last")).toBe("3");
        expect(summary.attributes("y-min")).toBe("0.2315");
        expect(summary.attributes("y-max")).toBe("0.7949");
    });

    it("renders wide format data graph", async () => {

        wrapper = mount(plotlyGraph, {
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

        expect(wrapper.find(Plotly).props("layout")).toEqual({title: "Test title", font: expectedFontSettings});
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

        const dataSummary = wrapper.find(".mint-plot-data-summary");
        expect(dataSummary.attributes("hidden")).toBe("hidden");
        const dataSummarySeries = dataSummary.findAll(".mint-plot-data-summary-series");
        expect(dataSummarySeries.length).toBe(2);
        const summary1 = dataSummarySeries.at(0);
        expect(summary1.attributes("name")).toBe("Pyrethoid ITN");
        expect(summary1.attributes("id")).toBe("ITN");
        expect(summary1.attributes("type")).toBe("bar");
        expect(summary1.attributes("count")).toBe("1");
        expect(summary1.attributes("x-first")).toBe("ITN");
        expect(summary1.attributes("x-first")).toBe("ITN");
        expect(summary1.attributes("y-min")).toBe("1000");
        expect(summary1.attributes("y-max")).toBe("1000");
        const summary2 = dataSummarySeries.at(1);
        expect(summary2.attributes("name")).toBe("Switch to Pyrethoid-PBO ITN");
        expect(summary2.attributes("id")).toBe("PBO");
        expect(summary2.attributes("type")).toBe("bar");
        expect(summary2.attributes("count")).toBe("1");
        expect(summary2.attributes("x-first")).toBe("PBO");
        expect(summary2.attributes("x-first")).toBe("PBO");
        expect(summary2.attributes("y-min")).toBe("500");
        expect(summary2.attributes("y-max")).toBe("500");
    });

    it("uses transformed layout", () => {
        const layout = {
            shapes: [
                {type: "line", y_formula: "{net_use}", x0: 0, x1: 1}
            ]
        };
        wrapper = mount(plotlyGraph, {
            propsData: {
                series: [],
                metadata: {
                    x_col: "month",
                    y_col: "value",
                    id_col: "intervention",
                    format: "long"
                },
                layout,
                data: [],
                settings: {
                    net_use: 0.5
                }
            }
        });

        expect(wrapper.find(Plotly).props("layout").shapes).toStrictEqual([{
            ...layout.shapes[0],
            y0: 0.5,
            y1: 0.5
        }]);
    });

    const hoverbelowPropsData = {
        series: [
            {x: ["ITN"], id: "ITN", name: "Pyrethoid ITN"},
        ],
        metadata: {cols: ["cases_averted"], id_col: "intervention", format: "wide"},
        data: [
            {"intervention": "ITN", "net_use": 0, "prevalence": 0.2315, "cases_averted": 1000}
        ],
        layout: {
            mintcustom: {
                hoverposition: "below"
            }
        }
    };

    it("does not set up hoverbelow if not configured in layout", () => {
        wrapper = shallowMount(plotlyGraph, {
            attachToDocument: true,
            propsData: {
                ...hoverbelowPropsData,
                layout: {
                    mintcustom: {
                        hoverposition: "none"
                    }
                }
            }
        });

        expect(wrapper.find("div").classes()).not.toContain("hoverbelow");
        expect((wrapper.vm as any).observer).toBeNull();
    });

    it("sets up hoverbelow if configured in layout", () => {
        wrapper = shallowMount(plotlyGraph, {
            attachToDocument: true,
            propsData: {
                ...hoverbelowPropsData
            }
        });

        expect(wrapper.find("div").classes()).toContain("hoverbelow");
        expect((wrapper.vm as any).observer).not.toBeNull();
    });

    it("hoverbelow sets y value of new hover text elements to 0", (done) => {
        wrapper = shallowMount(plotlyGraph, {
            attachToDocument: true,
            propsData: {
                ...hoverbelowPropsData
            }
        });

        $(".hoverbelow").append(`
            <g class='hoverlayer'>
                <g id='test-y-add' class='hovertext'/>
            </g>`);
        $("#test-y-add").append("<text x='100' y='100'/>");

        setTimeout(() => {
            expect(wrapper!!.find("#test-y-add text").attributes().x).toBe("100");
            expect(wrapper!!.find("#test-y-add text").attributes().y).toBe("0");
            done();
        });
    });

    it("hoverbelow sets y value of mutated hover text elements to 0", (done) => {
        wrapper = shallowMount(plotlyGraph, {
            attachToDocument: true,
            propsData: {
                ...hoverbelowPropsData
            }
        });

        $(".hoverbelow").append(`
            <g class='hoverlayer'>
                <g id='test-y-mutate' class='hovertext'>
                    <text x='100' y='50'/>
                </g>
            </g>`);

        $("#test-y-mutate text").attr("y", "200");

        setTimeout(() => {
            expect(wrapper!!.find("#test-y-mutate text").attributes().x).toBe("100");
            expect(wrapper!!.find("#test-y-mutate text").attributes().y).toBe("0");
            done();
        });
    });

    it("hoverbelow sets expected path and classes of new hover elements", (done) => {
        wrapper = shallowMount(plotlyGraph, {
            attachToDocument: true,
            propsData: {
                ...hoverbelowPropsData
            }
        });

        $(".hoverbelow").append(`
            <g class='hoverlayer'>
                <g id='test-path-add' class='hovertext'></g>
            </g>`);
        $("#test-path-add").append("<rect x='60' y='0' width='200' height='40'></rect><path d='some default path'></path>");

        setTimeout(() => {
            expect(wrapper!!.find("#test-path-add path").attributes().d).toBe("M4,-20v40H60v-40h-40l-6,-6l-6,6Z");
            expect(wrapper!!.find("#test-path-add path").classes()).toContain("hoverbelow-right");
            expect(wrapper!!.find("#test-path-add rect").classes()).toContain("hoverbelow-right");
            done();
        });
    });

    it("hoverbelow sets expected path and classes of mutated hover elements", (done) => {
        wrapper = shallowMount(plotlyGraph, {
            attachToDocument: true,
            propsData: {
                ...hoverbelowPropsData
            }
        });

        $(".hoverbelow").append(`
            <g class='hoverlayer'>
                <g id='test-path-mutate' class='hovertext'>
                    <rect x='90' y='0' width='200' height='40'></rect>
                    <path d='some default path'></path>
            </g>`);
        $("#test-path-mutate rect").attr("x", "60");
        $("#test-path-mutate path").attr("d", "some new path");

        setTimeout(() => {
            expect(wrapper!!.find("#test-path-mutate path").attributes().d).toBe("M4,-20v40H60v-40h-40l-6,-6l-6,6Z");
            expect(wrapper!!.find("#test-path-mutate path").classes()).toContain("hoverbelow-right");
            expect(wrapper!!.find("#test-path-mutate rect").classes()).toContain("hoverbelow-right");
            done();
        });
    });

    it("hoverbelow sets expected path and classes of new hover elements when label is to left", (done) => {
        wrapper = shallowMount(plotlyGraph, {
            attachToDocument: true,
            propsData: {
                ...hoverbelowPropsData
            }
        });

        $(".hoverbelow").append(`
            <g class='hoverlayer'>
                <g id='test-path-add' class='hovertext'></g>
            </g>`);
        $("#test-path-add").append("<rect x='-260' y='0' width='200' height='40'/></rect><path d='some default path'></path>");

        setTimeout(() => {
            expect(wrapper!!.find("#test-path-add path").attributes().d).toBe("M-4,-20v40H-60v-40h40l6,-6l6,6Z");
            expect(wrapper!!.find("#test-path-add path").classes()).toContain("hoverbelow-left");
            expect(wrapper!!.find("#test-path-add rect").classes()).toContain("hoverbelow-left");
            done();
        });
    });

});
