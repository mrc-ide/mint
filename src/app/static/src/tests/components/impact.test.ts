import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import impact from "../../app/components/impact.vue";
import {mockGraph, mockRootState} from "../mocks";
import plotlyGraph from "../../app/components/figures/graphs/plotlyGraph.vue";
import {RootState} from "../../app/store";
import dynamicTable from "../../app/components/figures/dynamicTable.vue";

describe("impact", () => {

    const createStore = (state: Partial<RootState> = {}) => {
        return new Vuex.Store({
            state: mockRootState(state)
        });
    };

    it("shows prevalence graph under graph tab if graph config exists", () => {
        const store = createStore({
            prevalenceGraphConfig: mockGraph({
                layout: {
                    whatever: 1
                },
                series: [{
                    x: [1, 2],
                    y: [100, 200]
                }],
                metadata: {
                    format: "wide",
                    id_col: "intervention",
                    cols: ["cases"]
                }
            })
        });
        const wrapper = shallowMount(impact, {propsData: {activeTab: "Graphs"}, store});
        expect(wrapper.findAll(plotlyGraph).length).toBe(1);
        const graph = wrapper.findAll(plotlyGraph).at(0);
        expect(graph.props("layout")).toEqual({whatever: 1});
        expect(graph.props("metadata")).toEqual({
            format: "wide",
            id_col: "intervention",
            cols: ["cases"]
        });
        expect(graph.props("series")).toEqual([{
            x: [1, 2],
            y: [100, 200]
        }])
    });

    it("does not show prevalence graph under table tab", () => {
        const store = createStore({prevalenceGraphConfig: mockGraph()});
        const wrapper = shallowMount(impact, {propsData: {activeTab: "Table"}, store});
        expect(wrapper.findAll(plotlyGraph).length).toBe(0);
    });

    it("does not show prevalence graph if graph config does not exist", () => {
        const store = createStore();
        const wrapper = shallowMount(impact, {propsData: {activeTab: "Graphs"}, store});
        expect(wrapper.findAll(plotlyGraph).length).toBe(0);
    });

    it("shows table under table tab if table config exists", () => {
        const store = createStore({
            impactTableConfig: {"col": "Column name"},
            impactTableData: [{col: 1}]
        });
        const wrapper = shallowMount(impact, {propsData: {activeTab: "Table"}, store});
        expect(wrapper.findAll(dynamicTable).length).toBe(1);
        const table = wrapper.findAll(dynamicTable).at(0);
        expect(table.props("columns")).toEqual({"col": "Column name"});
        expect(table.props("data")).toEqual([{col: 1}]);
    });

    it("does not show table under graph tab", () => {
        const store = createStore({impactTableConfig: {"col": "Column name"}});
        const wrapper = shallowMount(impact, {propsData: {activeTab: "Graphs"}, store});
        expect(wrapper.findAll(dynamicTable).length).toBe(0);
    });

    it("does not show table if table config does not exist", () => {
        const store = createStore();
        const wrapper = shallowMount(impact, {propsData: {activeTab: "Table"}, store});
        expect(wrapper.findAll(dynamicTable).length).toBe(0);
    });

});
