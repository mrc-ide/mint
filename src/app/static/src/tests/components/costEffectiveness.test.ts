import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import costEffectiveness from "../../app/components/costEffectiveness.vue";
import {RootState} from "../../app/store";
import {mockGraph, mockRootState} from "../mocks";
import plotlyGraph from "../../app/components/figures/graphs/plotlyGraph.vue";

describe("costEffectiveness", () => {

    const createStore = (state: Partial<RootState> = {}) => {
        return new Vuex.Store({
            state: mockRootState(state)
        });
    };

    it("renders as expected when activeTab is Table", () => {
        const store = createStore();
        const wrapper = shallowMount(costEffectiveness, {propsData: {activeTab: "Table"}, store});
        expect(wrapper.findAll(plotlyGraph).length).toBe(0);
        expect(wrapper.text()).toBe("Cost effectiveness table");
    });

    it("renders as expected when activeTab is Graphs", function () {
        const state = {
            costCasesGraphConfig:  mockGraph({
                layout: {
                    whatever: 1
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
                    costGraphData: [{cost: 1000, cases_averted: 100}]
                } as any
            } as any
        };
        const store = createStore(state);

        const wrapper = shallowMount(costEffectiveness, {propsData: {activeTab: "Graphs"}, store});

        const graph = wrapper.find(plotlyGraph);
        expect(graph.props().layout).toBe(state.costCasesGraphConfig.layout);
        expect(graph.props().metadata).toBe(state.costCasesGraphConfig.metadata);
        expect(graph.props().series).toBe(state.costCasesGraphConfig.series);
        expect(graph.props().data).toBe(state.currentProject.currentRegion.costGraphData);

        expect(wrapper.text()).toBe("");
    });

    it("does not render graph if config is null", () => {
        const store = createStore();
        const wrapper = shallowMount(costEffectiveness, {propsData: {activeTab: "Graphs"}, store});
        expect(wrapper.findAll(plotlyGraph).length).toBe(0);
        expect(wrapper.text()).toBe("");
    });
});