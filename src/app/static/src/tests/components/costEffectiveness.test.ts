import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import costEffectiveness from "../../app/components/costEffectiveness.vue";
import {RootState} from "../../app/store";
import {mockGraph, mockRootState} from "../mocks";
import plotlyGraph from "../../app/components/figures/graphs/plotlyGraph.vue";
import dynamicTable from "../../app/components/figures/dynamicTable.vue";
import collapsibleDocs from "../../app/components/collapsibleDocs.vue";

describe("costPerCase", () => {

    const createStore = (state: Partial<RootState> = {}) => {
        return new Vuex.Store({
            state: mockRootState(state)
        });
    };

    it("renders as expected when activeTab is Table", () => {
        const state = {
            costTableConfig: [{displayName: "Cost", valueCol: "cost"}],
            currentProject: {
                currentRegion: {
                    tableData: [{cost: 1000, cases_averted: 100}],
                    interventionSettings: {setting: 1}
                } as any
            } as any
        };
        const store = createStore(state);

        const wrapper = shallowMount(costEffectiveness, {propsData: {activeTab: "Table"}, store});

        const table = wrapper.find(dynamicTable);
        expect(table.props().config).toBe(state.costTableConfig);
        expect(table.props().data).toBe(state.currentProject.currentRegion.tableData);
        expect(table.props().settings).toEqual(state.currentProject.currentRegion.interventionSettings);
        expect(wrapper.findAll(plotlyGraph).length).toBe(0);
    });

    it("renders as expected when activeTab is Graphs", function () {
        const state = {
            costPerCaseGraphConfig:  mockGraph({
                layout: {
                    xaxis: {title: "x1"},
                    yaxis: {title: "y1"}
                },
                series: [{
                    id: "none"
                }],
                metadata: {
                    format: "long",
                    id_col: "intervention",
                    x_col: "intervention",
                    y_col: "cost"
                }
            }),
            costCasesGraphConfig:  mockGraph({
                layout: {
                    xaxis: {title: "x2"},
                    yaxis: {title: "y2"}
                },
                series: [{
                    id: "none"
                }],
                metadata: {
                    format: "long",
                    id_col: "intervention",
                    x_col: "cases_averted",
                    y_col: "cost"
                }
            }),
            currentProject: {
                currentRegion: {
                    tableData: [{cost: 1000, cases_averted: 100}]
                } as any
            } as any
        };
        const store = createStore(state);

        const wrapper = shallowMount(costEffectiveness, {propsData: {activeTab: "Graphs"}, store});

        const costPerCaseGraph = wrapper.findAll(plotlyGraph).at(1);
        expect(costPerCaseGraph.props().layout).toBe(state.costPerCaseGraphConfig.layout);
        expect(costPerCaseGraph.props().metadata).toBe(state.costPerCaseGraphConfig.metadata);
        expect(costPerCaseGraph.props().series).toBe(state.costPerCaseGraphConfig.series);
        expect(costPerCaseGraph.props().data).toBe(state.currentProject.currentRegion.tableData);

        const casesGraph = wrapper.findAll(plotlyGraph).at(0);
        expect(casesGraph.props().layout).toBe(state.costCasesGraphConfig.layout);
        expect(casesGraph.props().metadata).toBe(state.costCasesGraphConfig.metadata);
        expect(casesGraph.props().series).toBe(state.costCasesGraphConfig.series);
        expect(casesGraph.props().data).toBe(state.currentProject.currentRegion.tableData);

        expect(wrapper.findAll(dynamicTable).length).toBe(0);
    });

    it("does not render graph if config is null", () => {
        const store = createStore();
        const wrapper = shallowMount(costEffectiveness, {propsData: {activeTab: "Graphs"}, store});
        expect(wrapper.findAll(plotlyGraph).length).toBe(0);
    });

    it("does not render table if config is null", () => {
        const store = createStore();
        const wrapper = shallowMount(costEffectiveness, {propsData: {activeTab: "Table"}, store});
        expect(wrapper.findAll(dynamicTable).length).toBe(0);
    });

    it("renders collapsible docs", () => {
        const store = createStore({costDocs: "cost docs"});
        const wrapper = shallowMount(costEffectiveness, {propsData: {activeTab: "Table"}, store});
        const table = wrapper.find(collapsibleDocs);
        expect(table.props("docs")).toEqual("cost docs");
    });
});
