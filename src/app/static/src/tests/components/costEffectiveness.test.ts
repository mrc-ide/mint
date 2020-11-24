import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import costEffectiveness from "../../app/components/costEffectiveness.vue";
import {RootState} from "../../app/store";
import {mockGraph, mockRootState} from "../mocks";
import plotlyGraph from "../../app/components/figures/graphs/plotlyGraph.vue";
import dynamicTable from "../../app/components/figures/dynamicTable.vue";
import collapsibleDocs from "../../app/components/collapsibleDocs.vue";

describe("costEffectiveness", () => {

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
            costEfficacyGraphConfig:  mockGraph({
                layout: {
                    whatever: 1
                },
                series: [{
                    id: "none"
                }],
                metadata: {
                    format: "long",
                    id_col: "intervention",
                    x_col: "efficacy",
                    y_col: "cost"
                }
            }),
            costCasesGraphConfig:  mockGraph({
                layout: {
                    whatever: 2
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

        const efficacyGraph = wrapper.findAll(plotlyGraph).at(0);
        expect(efficacyGraph.props().layout).toBe(state.costEfficacyGraphConfig.layout);
        expect(efficacyGraph.props().metadata).toBe(state.costEfficacyGraphConfig.metadata);
        expect(efficacyGraph.props().series).toBe(state.costEfficacyGraphConfig.series);
        expect(efficacyGraph.props().data).toBe(state.currentProject.currentRegion.tableData);

        const casesGraph = wrapper.findAll(plotlyGraph).at(1);
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
