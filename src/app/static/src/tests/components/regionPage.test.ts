import {createLocalVue, mount, shallowMount} from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import regionPage from "../../app/components/regionPage.vue";
import {mockProject, mockRootState} from "../mocks";
import {RootMutation} from "../../app/mutations";
import stepButton from "../../app/components/stepButton.vue";
import interventions from "../../app/components/interventions.vue";
import baseline from "../../app/components/baseline.vue";
import {Project} from "../../app/models/project";
import {RootAction} from "../../app/actions";
import loadingSpinner from "../../app/components/loadingSpinner.vue";

describe("region page", () => {

    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter({routes: [{path: '/projects/:project/regions/:region', component: regionPage}]});

    const createStore = (setCurrentRegionMock = jest.fn(),
                         setCurrentRegionStepMock = jest.fn(),
                         project = mockProject(),
                         setBaselineSettingsMock = jest.fn()) => {
        return new Vuex.Store({
            state: mockRootState({
                currentProject: project
            }),
            mutations: {
                [RootMutation.SetCurrentRegionStep]: setCurrentRegionStepMock,
                [RootMutation.SetCurrentRegionBaselineSettings]: setBaselineSettingsMock,
                [RootMutation.SetCurrentRegionInterventionSettings]: jest.fn(),
            },
            actions: {
                [RootAction.SetCurrentRegion]: setCurrentRegionMock,
                [RootAction.FetchConfig]: jest.fn(),
                [RootAction.EnsureImpactData]: jest.fn(),
                [RootAction.EnsureCostEffectivenessData]: jest.fn()
            }
        });
    };

    it("shows baseline if current region's step is 1", () => {
        const store = createStore();
        const wrapper = shallowMount(regionPage, {store, localVue, router});

        const steps = wrapper.findAll(stepButton);
        expect(steps.at(0).props("active")).toBe(true);
        expect(steps.at(1).props("active")).toBe(false);
        expect(wrapper.findAll(interventions).length).toBe(0);
        expect(wrapper.findAll(baseline).length).toBe(1);
    });

    it("shows loading spinner while interventions component is loading", () => {
        const project = new Project("project 1", ["region 1"],
            {controlSections: []}, {controlSections: []});
        project.currentRegion.step = 2;

        const store = createStore(jest.fn(), jest.fn(), project);
        const wrapper = shallowMount(regionPage, {store, localVue, router});

        expect(wrapper.findAll(loadingSpinner).length).toBe(1);
    });

    it("shows interventions if current region's step is 2", () => {
        const project = new Project("project 1", ["region 1"],
            {controlSections: []}, {controlSections: []});
        project.currentRegion.step = 2;

        const store = createStore(jest.fn(), jest.fn(), project);
        const stubs = ["interventions"];
        const wrapper = shallowMount(regionPage, {store, stubs, localVue, router});

        const steps = wrapper.findAll(stepButton);
        expect(steps.at(1).props("active")).toBe(true);
        expect(steps.at(0).props("active")).toBe(false);
        expect(wrapper.findAll("interventions-stub").length).toBe(1);
        expect(wrapper.findAll(baseline).length).toBe(0);
    });

    it("sets current region when route changes", async () => {

        const setCurrentRegionMock = jest.fn();
        const store = createStore(setCurrentRegionMock);

        shallowMount(regionPage, {localVue, store, router});
        expect(setCurrentRegionMock.mock.calls.length).toBe(1);

        await router.push({
            path: "/projects/new-project/regions/new-region"
        });
        await Vue.nextTick();

        expect(setCurrentRegionMock.mock.calls.length).toBe(2);
        expect(setCurrentRegionMock.mock.calls[1][1]).toEqual({project: "new-project", region: "new-region"});
    });

    it("sets current step to 1 when step 1 is clicked", async () => {
        const mockSetRegionStep = jest.fn();
        const store = createStore(jest.fn(), mockSetRegionStep);
        const wrapper = mount(regionPage, {localVue, store, router});

        const buttons = wrapper.findAll("button");
        buttons.at(1).trigger("click");

        await Vue.nextTick();

        expect(mockSetRegionStep.mock.calls.length).toBe(1);
        expect(mockSetRegionStep.mock.calls[0][1]).toBe(2);

        buttons.at(0).trigger("click");

        await Vue.nextTick();

        expect(mockSetRegionStep.mock.calls.length).toBe(2);
        expect(mockSetRegionStep.mock.calls[1][1]).toBe(1);
    });

    it("saves baseline settings and sets current step to 2 when step 2 is clicked", async () => {
        const mockSetRegionStep = jest.fn();
        const mockSetBaselineSettings = jest.fn();
        const store = createStore(jest.fn(), mockSetRegionStep, mockProject(), mockSetBaselineSettings);
        const wrapper = mount(regionPage, {localVue, store, router});

        const buttons = wrapper.findAll("button");
        buttons.at(1).trigger("click");

        await Vue.nextTick();

        expect(mockSetBaselineSettings.mock.calls.length).toBe(1);
        expect(mockSetRegionStep.mock.calls.length).toBe(1);
        expect(mockSetRegionStep.mock.calls[0][1]).toBe(2);
    });

    it("sets current step to 2 when baseline is submitted", async () => {
        const mockSetRegionStep = jest.fn();
        const store = createStore(jest.fn(), mockSetRegionStep);
        const wrapper = shallowMount(regionPage, {store, localVue, router});

        const baselineComp = wrapper.find(baseline);
        baselineComp.vm.$emit("submit");

        await Vue.nextTick();

        expect(mockSetRegionStep.mock.calls.length).toBe(1);
        expect(mockSetRegionStep.mock.calls[0][1]).toBe(2);
    });

    it("makes step 2 disabled when baseline is not valid", async () => {
        const store = createStore();
        const wrapper = shallowMount(regionPage, {store, localVue, router});

        wrapper.find(baseline).vm.$emit("validate", false);
        await Vue.nextTick();
        expect(wrapper.findAll(stepButton).at(1).props("disabled")).toBe(true);

        //should re-enable on validate(true)
        wrapper.find(baseline).vm.$emit("validate", true);
        await Vue.nextTick();
        expect(wrapper.findAll(stepButton).at(1).props("disabled")).toBe(false);
    });

});
