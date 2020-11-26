import Vue from "vue";
import {mount, shallowMount} from "@vue/test-utils";
import interventions from "../../app/components/interventions.vue";
import Vuex from "vuex";
import {mockProject, mockRootState} from "../mocks";
import {RootState} from "../../app/store";
import {RootAction} from "../../app/actions";
import impact from "../../app/components/impact.vue";
import {DynamicForm} from "@reside-ic/vue-dynamic-form";
import {RootMutation} from "../../app/mutations";
import {Project} from "../../app/models/project";
import loadingSpinner from "../../app/components/loadingSpinner.vue";

describe("interventions", () => {

    const createStore = (state: Partial<RootState> = {currentProject: mockProject()},
                         mockEnsureData = jest.fn(),
                         mockEnsureCostData = jest.fn(),
                         mockSetOptions = jest.fn(),
                         mockSetSettings = jest.fn(),
                         mockFetchConfig = jest.fn()) => {
        return new Vuex.Store({
            state: mockRootState(state),
            actions: {
                [RootAction.EnsureImpactData]: mockEnsureData,
                [RootAction.EnsureCostEffectivenessData]: mockEnsureCostData,
                [RootAction.FetchConfig]: mockFetchConfig
            },
            mutations: {
                [RootMutation.SetCurrentRegionInterventionOptions]: mockSetOptions,
                [RootMutation.SetCurrentRegionInterventionSettings]: mockSetSettings
            }
        });
    };

    it("shows loading spinner while impact is loading", () => {
        const store = createStore();
        const wrapper = shallowMount(interventions, {store});
        expect(wrapper.findAll(loadingSpinner).length).toBe(1);
    });

    it("shows loading spinner while cost effectiveness is loading", async () => {
        const store = createStore();
        const wrapper = shallowMount(interventions, {store, stubs: ["impact"]});
        expect(wrapper.findAll(loadingSpinner).length).toBe(0);
        const tabs = wrapper.findAll("a");
        tabs.at(1).trigger("click");
        await Vue.nextTick();
        expect(wrapper.findAll(loadingSpinner).length).toBe(1);
    });

    it("fetches config before mount", () => {
        const fetchConfigMock = jest.fn();
        const store = createStore({currentProject: mockProject()}, jest.fn(), jest.fn(), jest.fn(), jest.fn(), fetchConfigMock);
        shallowMount(interventions, {store});
        expect(fetchConfigMock.mock.calls.length).toBe(1);
    });

    it("initialises outer tabs", () => {
        const store = createStore();
        const stubs = ["impact", "cost-effectiveness"];
        const wrapper = shallowMount(interventions, {store, stubs});
        const tabs = wrapper.findAll("a");
        expect(tabs.at(0).text()).toBe("Impact");
        expect(tabs.at(0).classes()).toContain("active");
        expect(tabs.at(1).text()).toBe("Cost effectiveness");
        expect(tabs.at(1).classes()).not.toContain("active");
        expect(wrapper.findAll("impact-stub").length).toBe(1);
        expect(wrapper.findAll("cost-effectiveness-stub").length).toBe(0);
    });

    it("can change outer tab", async () => {
        const store = createStore();
        const stubs = ["impact", "cost-effectiveness"];
        const wrapper = shallowMount(interventions, {store, stubs});
        const tabs = wrapper.findAll("a");
        tabs.at(1).trigger("click");
        await Vue.nextTick();
        expect(tabs.at(0).classes()).not.toContain("active");
        expect(tabs.at(1).classes()).toContain("active");
        expect(wrapper.findAll("impact-stub").length).toBe(0);
        expect(wrapper.findAll("cost-effectiveness-stub").length).toBe(1);
    });

    it("initialises inner tabs", () => {
        const store = createStore();
        const wrapper = mount(interventions, {store, stubs: ["impact", "cost-effectiveness"]});
        const innerTabs = wrapper.findAll(".tab-content a");
        expect(innerTabs.at(0).text()).toBe("Table");
        expect(innerTabs.at(0).classes()).not.toContain("active");
        expect(innerTabs.at(1).text()).toBe("Graphs");
        expect(innerTabs.at(1).classes()).toContain("active");

        expect(wrapper.find("impact-stub").html()).toBe("<impact-stub active-tab=\"Graphs\"></impact-stub>");
    });

    it("can change inner tab", async () => {
        const store = createStore();
        const stubs = ["impact", "cost-effectiveness"];
        const wrapper = mount(interventions, {store, stubs});
        const innerTabs = wrapper.findAll(".tab-content a");
        expect(innerTabs.at(1).classes()).toContain("active");

        innerTabs.at(0).trigger("click");

        await Vue.nextTick();
        expect(innerTabs.at(1).classes()).not.toContain("active");
        expect(innerTabs.at(0).classes()).toContain("active");
        expect(wrapper.find("impact-stub").html()).toBe("<impact-stub active-tab=\"Table\"></impact-stub>");;
    });

    it("fetches data on mount", async () => {
        const mockFetchImpact = jest.fn();
        const mockFetchCost = jest.fn();
        const store = createStore({currentProject: mockProject()}, mockFetchImpact, mockFetchCost);
        shallowMount(interventions, {store});
        expect(mockFetchImpact.mock.calls.length).toBe(1);
        expect(mockFetchCost.mock.calls.length).toBe(1);
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
        const store = createStore({currentProject: project}, jest.fn(), jest.fn(), mockUpdateOptions);
        const wrapper = shallowMount(interventions, {store});
        wrapper.find(DynamicForm).vm.$emit("change", {
            controlSections: ["TEST" as any]
        });

        await Vue.nextTick();
        expect(mockUpdateOptions.mock.calls[0][1]).toEqual({
            controlSections: ["TEST" as any]
        })
    });

    it("updates settings on mount", async () => {
        const project = mockProject();
        project.currentRegion.interventionOptions = {
            controlSections: [{
                label: "S1",
                controlGroups: [{
                    controls: [
                        {name: "c1", type: "number", required: true, value: 3}
                    ]
                }]
            }]
        };
        const mockSetSettings = jest.fn();
        const store = createStore({currentProject: project}, jest.fn(), jest.fn(), jest.fn(), mockSetSettings);
        mount(interventions, {store});

        await Vue.nextTick();

        expect(mockSetSettings.mock.calls[0][1]).toEqual({"c1": 3});
    });

    it("updates settings when intervention options change", async () => {
        const project = mockProject()
        const mockSetSettings = jest.fn();
        const store = createStore({currentProject: project}, jest.fn(), jest.fn(), jest.fn(), mockSetSettings);
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

        expect(wrapper.find(DynamicForm).emitted("submit")!![0][0]).toEqual({}); // called on mount
        expect(wrapper.find(DynamicForm).emitted("submit")!![1][0]).toEqual({"c1": 3}); // called after change

        await Vue.nextTick();

        expect(mockSetSettings.mock.calls[0][1]).toEqual({}); // called on mount
        expect(mockSetSettings.mock.calls[1][1]).toEqual({"c1": 3}); // called after change
    });

    it("fetches data on currentRegion change", async () => {
        const mockFetch = jest.fn();

        const project = mockProject();
        const store = createStore({
            projects: [project],
            currentProject: project
        }, mockFetch);

        mount(interventions, {store});

        store.state.currentProject!!.currentRegion =
            {
                name: "newRegion",
                url: "/",
                slug: "newRegion",
                baselineOptions: {controlSections: []},
                baselineSettings: {},
                interventionOptions: {controlSections: []},
                interventionSettings: {},
                prevalenceGraphData: [],
                tableData: [],
                step: 1
            };
        await Vue.nextTick();

        expect(mockFetch.mock.calls.length).toBe(2);
    });

});
