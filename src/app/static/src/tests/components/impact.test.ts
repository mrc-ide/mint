import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import impact from "../../app/components/impact.vue";
import {mockGraph, mockProject, mockRootState} from "../mocks";
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
        const project = mockProject();
        project.currentRegion.interventionSettings = {"test": 1}
        const store = createStore({
            currentProject: project,
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
        }]);
        expect(graph.props("settings")).toEqual({
            "test": 1
        });
    });

    it("shows cases averted graph under graph tab if graph config exists", () => {
        const project = mockProject();
        project.currentRegion.interventionSettings = {"test": 1}
        const store = createStore({
            currentProject: project,
            casesGraphConfig: mockGraph({
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
        }]);
        expect(graph.props("settings")).toEqual({
            "test": 1
        });
    });

    it("does not show graphs under table tab", () => {
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
            currentProject: {
                currentRegion: {
                    tableData: [{col: 1}],
                    interventionSettings: {"test": 1}
                }
            }
        } as any);
        const wrapper = shallowMount(impact, {propsData: {activeTab: "Table"}, store});
        expect(wrapper.findAll(dynamicTable).length).toBe(1);
        const table = wrapper.findAll(dynamicTable).at(0);
        expect(table.props("columns")).toEqual({"col": "Column name"});
        expect(table.props("data")).toEqual([{col: 1}]);
        expect(table.props("settings")).toEqual({"test": 1});
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

    it("graph data is empty if no current project", () => {
        const store = createStore({
            prevalenceGraphConfig: {config: "TEST CONFIG"},
            casesGraphConfig: {config: "TEST CONFIG"}
        } as any);
        const wrapper = shallowMount(impact, {propsData: {activeTab: "Graphs"}, store});
        const graphs = wrapper.findAll(plotlyGraph);
        expect(graphs.at(0).props("data")).toEqual([]);
        expect(graphs.at(1).props("data")).toEqual([]);
    });

    it("table data is empty if no current project", () => {
        const store = createStore({impactTableConfig: {"col": "Column name"}});
        const wrapper = shallowMount(impact, {propsData: {activeTab: "Table"}, store});
        const table = wrapper.find(dynamicTable);
        expect(table.props("data")).toEqual([]);
    });

});
