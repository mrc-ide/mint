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
import {RootMutation} from "../../app/mutations";

describe("interventions", () => {

    const createStore = (state: Partial<RootState> = {currentProject: mockProject()},
                         mockFetchData = jest.fn(),
                         mockSetOptions = jest.fn(),
                         mockSetSettings = jest.fn()) => {
        return new Vuex.Store({
            state: mockRootState(state),
            actions: {
                [RootAction.FetchImpactData]: mockFetchData
            },
            mutations: {
                [RootMutation.SetCurrentRegionInterventionOptions]: mockSetOptions,
                [RootMutation.SetCurrentRegionInterventionSettings]: mockSetSettings
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

    it("fetches data", () => {
        const mockFetch = jest.fn();
        const store = createStore({currentProject: mockProject()}, mockFetch);
        shallowMount(interventions, {store});
        expect(mockFetch.mock.calls.length).toBe(1);
    });

    it("renders intervention options", () => {
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

    it("updates intervention options when the form changes", async () => {
        const project = mockProject()
        const mockUpdateOptions = jest.fn();
        const store = createStore({currentProject: project}, jest.fn(), mockUpdateOptions);
        const wrapper = shallowMount(interventions, {store});
        wrapper.find(DynamicForm).vm.$emit("change", {
            controlSections: ["TEST" as any]
        });

        await Vue.nextTick();
        expect(mockUpdateOptions.mock.calls[0][1]).toEqual({
            controlSections: ["TEST" as any]
        })
    });

    it("submits form and updates settings when intervention options change", async () => {
        const project = mockProject()
        const mockSetSettings = jest.fn();
        const store = createStore({currentProject: project}, jest.fn(), jest.fn(), mockSetSettings);
        const wrapper = mount(interventions, {store});

        store.state.currentProject!!.currentRegion.interventionOptions =
            {
                controlSections: [{
                    label: "S1",
                    controlGroups: [{
                        controls: [
                            {name: "c1", type: "number", required: true, value: 3}
                        ]
                    }]
                }]
            };

        await Vue.nextTick();

        expect(wrapper.find(DynamicForm).emitted("submit")!![0][0]).toEqual({"c1": 3})

        await Vue.nextTick();

        expect(mockSetSettings.mock.calls[0][1]).toEqual({"c1": 3})
    });


});
