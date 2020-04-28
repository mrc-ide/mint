import Vue from "vue";
import {mount, shallowMount} from "@vue/test-utils";
import interventions from "../../app/components/interventions.vue";
import Vuex from "vuex";
import {mockGraph, mockRootState} from "../mocks";
import plotlyGraph from "../../app/components/figures/graphs/plotlyGraph.vue";
import {RootState} from "../../app/store";
import {RootAction} from "../../app/actions";

describe("interventions", () => {

    const createStore = (state: Partial<RootState> = {}, mockFetch = jest.fn()) => {
        return new Vuex.Store({
            state: mockRootState(state),
            actions: {
                [RootAction.FetchPrevalenceGraphData]: mockFetch
            }
        });
    };

    it("initialises tabs", () => {
        const store = createStore();
        const wrapper = mount(interventions, {store});
        const tabs = wrapper.findAll("a");
        expect(tabs.at(0).text()).toBe("Table");
        expect(tabs.at(0).classes()).not.toContain("active");
        expect(tabs.at(1).text()).toBe("Graphs");
        expect(tabs.at(1).classes()).toContain("active");
    });

    it("can change tab", async () => {
        const store = createStore();
        const wrapper = mount(interventions, {store});
        const tabs = wrapper.findAll("a");
        expect(tabs.at(1).classes()).toContain("active");

        tabs.at(0).trigger("click");

        await Vue.nextTick();
        expect(tabs.at(1).classes()).not.toContain("active");
        expect(tabs.at(0).classes()).toContain("active");
    });

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
        const wrapper = shallowMount(interventions, {store});
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

    it("does not show prevalence graph under table tab", async () => {
        const store = createStore({prevalenceGraphConfig: mockGraph()});
        const wrapper = mount(interventions, {store});
        expect(wrapper.findAll(plotlyGraph).length).toBe(1);
        const tabs = wrapper.findAll("a");
        tabs.at(0).trigger("click");

        await Vue.nextTick();
        expect(wrapper.findAll(plotlyGraph).length).toBe(0);
    });

    it("does not show prevalence graph if graph config does not exist", () => {
        const store = createStore();
        const wrapper = shallowMount(interventions, {store});
        expect(wrapper.findAll(plotlyGraph).length).toBe(0);
    });

    it("fetches graph data", async () => {
        const mockFetch = jest.fn();
        const store = createStore({
            prevalenceGraphConfig: mockGraph()
        }, mockFetch);
        shallowMount(interventions, {store});
        expect(mockFetch.mock.calls.length).toBe(1);
    });

});
