import {createLocalVue, mount, shallowMount, Wrapper} from "@vue/test-utils";
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

describe("region page", () => {

    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter({routes: [{path: '/projects/:project/regions/:region', component: regionPage}]});

    const createStore = (setCurrentRegionMock = jest.fn(), setCurrentRegionStepMock = jest.fn(), project = mockProject()) => {
        return new Vuex.Store({
            state: mockRootState({
                currentProject: project
            }),
            mutations: {
                [RootMutation.SetCurrentRegion]: setCurrentRegionMock,
                [RootMutation.SetCurrentRegionStep]: setCurrentRegionStepMock
            }
        });
    };

    it("shows baseline if current region's step is 1", () => {
        const store = createStore();
        const wrapper = shallowMount(regionPage,{store});

        const steps = wrapper.findAll(stepButton);
        expect(steps.at(0).props("active")).toBe(true);
        expect(steps.at(1).props("active")).toBe(false);
        expect(wrapper.findAll(interventions).length).toBe(0);
        expect(wrapper.findAll(baseline).length).toBe(1);
    });

    it("shows interventions if current region's step is 2", () => {
        const project = new Project("project 1", ["region 1"],
            {controlSections: []}, {controlSections: []});
        project.currentRegion.step = 2;

        const store = createStore(jest.fn(), jest.fn(), project);
        const wrapper = shallowMount(regionPage,{store});

        const steps = wrapper.findAll(stepButton);
        expect(steps.at(1).props("active")).toBe(true);
        expect(steps.at(0).props("active")).toBe(false);
        expect(wrapper.findAll(interventions).length).toBe(1);
        expect(wrapper.findAll(baseline).length).toBe(0);
    });

    it("sets current region when route changes", async () => {

        const setCurrentRegionMock = jest.fn();
        const store = createStore(setCurrentRegionMock);

        shallowMount(regionPage, {localVue, store, router});

        await router.push({
            path: "/projects/new-project/regions/new-region"
        });
        await Vue.nextTick();
        expect(setCurrentRegionMock.mock.calls.length).toBe(1);
        expect(setCurrentRegionMock.mock.calls[0][1]).toBe("/projects/new-project/regions/new-region");
    });

    it("sets current step when step is clicked", async () => {

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

    it("sets current step to 2 when baseline is submitted", async () => {
        const mockSetRegionStep = jest.fn();
        const store = createStore(jest.fn(), mockSetRegionStep);
        const wrapper = shallowMount(regionPage, {store});

        const baselineComp = wrapper.find(baseline);
        baselineComp.vm.$emit("submit");

        await Vue.nextTick();

        expect(mockSetRegionStep.mock.calls.length).toBe(1);
        expect(mockSetRegionStep.mock.calls[0][1]).toBe(2);
    });

    it("makes step 2 disabled when baseline is not valid", async () => {
        const store = createStore();
        const wrapper = shallowMount(regionPage, {store});

        wrapper.find(baseline).vm.$emit("validate", false);
        await Vue.nextTick();
        expect(wrapper.findAll(stepButton).at(1).props("disabled")).toBe(true);

        //should re-enable on validate(true)
        wrapper.find(baseline).vm.$emit("validate", true);
        await Vue.nextTick();
        expect(wrapper.findAll(stepButton).at(1).props("disabled")).toBe(false);
    });

});
