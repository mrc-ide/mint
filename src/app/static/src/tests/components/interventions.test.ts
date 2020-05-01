import Vue from "vue";
import {mount, shallowMount} from "@vue/test-utils";
import interventions from "../../app/components/interventions.vue";
import Vuex from "vuex";
import {mockProject, mockRootState} from "../mocks";
import {RootState} from "../../app/store";
import {RootAction} from "../../app/actions";
import impact from "../../app/components/impact.vue";
import costEffectiveness from "../../app/components/costEffectiveness.vue";
import {DynamicForm} from "@reside-ic/vue-dynamic-form";

describe("interventions", () => {

    const createStore = (state: Partial<RootState> = {currentProject: mockProject()},
                         mockFetchData = jest.fn()) => {
        return new Vuex.Store({
            state: mockRootState(state),
            actions: {
                [RootAction.FetchImpactData]: mockFetchData
            }
        });
    };

    it("initialises outer tabs", () => {
        const store = createStore();
        const wrapper = shallowMount(interventions, {store});
        const tabs = wrapper.findAll("a");
        expect(tabs.at(0).text()).toBe("Impact");
        expect(tabs.at(0).classes()).toContain("active");
        expect(tabs.at(1).text()).toBe("Cost effectiveness");
        expect(tabs.at(1).classes()).not.toContain("active");
        expect(wrapper.findAll(impact).length).toBe(1);
        expect(wrapper.findAll(costEffectiveness).length).toBe(0);
    });

    it("can change outer tab", async () => {
        const store = createStore();
        const wrapper = shallowMount(interventions, {store});
        const tabs = wrapper.findAll("a");
        tabs.at(1).trigger("click");
        await Vue.nextTick();
        expect(tabs.at(0).classes()).not.toContain("active");
        expect(tabs.at(1).classes()).toContain("active");
        expect(wrapper.findAll(impact).length).toBe(0);
        expect(wrapper.findAll(costEffectiveness).length).toBe(1);
    });

    it("initialises inner tabs", () => {
        const store = createStore();
        const wrapper = mount(interventions, {store});
        const innerTabs = wrapper.findAll(".tab-content a");
        expect(innerTabs.at(0).text()).toBe("Table");
        expect(innerTabs.at(0).classes()).not.toContain("active");
        expect(innerTabs.at(1).text()).toBe("Graphs");
        expect(innerTabs.at(1).classes()).toContain("active");
        expect(wrapper.find(impact).props("activeTab")).toBe("Graphs");
    });

    it("can change inner tab", async () => {
        const store = createStore();
        const wrapper = mount(interventions, {store});
        const innerTabs = wrapper.findAll(".tab-content a");
        expect(innerTabs.at(1).classes()).toContain("active");

        innerTabs.at(0).trigger("click");

        await Vue.nextTick();
        expect(innerTabs.at(1).classes()).not.toContain("active");
        expect(innerTabs.at(0).classes()).toContain("active");
        expect(wrapper.find(impact).props("activeTab")).toBe("Table");
    });

    it("fetches data on mount", async () => {
        const mockFetch = jest.fn();
        const store = createStore({currentProject: mockProject()}, mockFetch);
        shallowMount(interventions, {store});
        expect(mockFetch.mock.calls.length).toBe(1);
    });

    it("renders intervention options", async () => {
        const project = mockProject()
        project.currentRegion
            .interventionOptions
            .controlSections.push({controlGroups: [], label: "S1"})
        const store = createStore({currentProject: project});
        const wrapper = shallowMount(interventions, {store});
        const form = wrapper.find(DynamicForm);
        expect(form.exists()).toBe(true);
        expect(form.props("includeSubmitButton")).toBe(false);
        expect(form.props("formMeta")).toEqual({
            controlSections: [
                {
                    controlGroups: [],
                    label: "S1"
                }
            ]
        });
    });

    it("fetches data on currentRegion change", async () => {
        const mockFetch = jest.fn();

        const project = mockProject();
        const store = createStore({
            projects: [project],
            currentProject: project
        }, mockFetch);

        shallowMount(interventions, {store});

        store.state.currentProject!!.currentRegion =
            {
                name: "newRegion",
                url: "/",
                baselineOptions: {controlSections: []},
                interventionOptions: {controlSections: []},
                step: 1
            };
        await Vue.nextTick();

        expect(mockFetch.mock.calls.length).toBe(2);
    });

});
