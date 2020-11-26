import {createLocalVue, mount, shallowMount} from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import regionPage from "../../app/components/regionPage.vue";
import {mockProject, mockRegion, mockRootState} from "../mocks";
import {RootMutation} from "../../app/mutations";
import interventions from "../../app/components/interventions.vue";
import baseline from "../../app/components/baseline.vue";
import {Project} from "../../app/models/project";
import {RootAction} from "../../app/actions";
import {BCollapse, BIconCaretDownFill, BIconCaretUpFill} from "bootstrap-vue";

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
                [RootMutation.SetCurrentRegionStep]: setCurrentRegionStepMock
            },
            actions: {
                [RootAction.SetCurrentRegion]: setCurrentRegionMock,
                [RootAction.SetCurrentRegionBaselineSettings]: setBaselineSettingsMock
            }
        });
    };

    it("shows baseline if current region's step is 1", async () => {
        const store = createStore();
        const wrapper = shallowMount(regionPage, {store, localVue, router});
        expect(wrapper.findAll(interventions).length).toBe(0);
        expect(wrapper.findAll(baseline).length).toBe(1);

        // should not be able to toggle at this point
        expect(wrapper.find("h4").findAll(BIconCaretDownFill).length).toBe(0);
        expect(wrapper.find("h4").element.parentElement!!.classList).not.toContain("cursor-pointer");
        wrapper.find("h4").trigger("click");

        await Vue.nextTick();
        expect(wrapper.findAll(interventions).length).toBe(0);
        expect(wrapper.findAll(baseline).length).toBe(1);
    });

    it("shows interventions if current region's step is 2", () => {
        const project = new Project("project 1", ["region 1"],
            {controlSections: []}, {controlSections: []});
        project.currentRegion.step = 2;

        const store = createStore(jest.fn(), jest.fn(), project);
        const stubs = ["interventions"];
        const wrapper = shallowMount(regionPage, {store, stubs, localVue, router});

        const sections = wrapper.findAll(BCollapse);
        expect(sections.at(0).props("visible")).toBe(false);
        expect(sections.at(1).props("visible")).toBe(true);
    });

    it("shows baseline toggle when on step 2", () => {
        const project = new Project("project 1", ["region 1"],
            {controlSections: []}, {controlSections: []});
        project.currentRegion.step = 2;

        const store = createStore(jest.fn(), jest.fn(), project);
        const stubs = ["interventions"];
        const wrapper = shallowMount(regionPage, {store, stubs, localVue, router});
        expect(wrapper.find("h4").findAll(BIconCaretDownFill).length).toBe(1);
        expect(wrapper.find("h4").element.parentElement!!.classList).toContain("cursor-pointer");
    });

    it("can toggle baseline when on step 2", async () => {
        const project = new Project("project 1", ["region 1"],
            {controlSections: []}, {controlSections: []});
        project.currentRegion.step = 2;

        const store = createStore(jest.fn(), jest.fn(), project);
        const stubs = ["interventions"];
        const wrapper = shallowMount(regionPage, {store, stubs, localVue, router});
        expect(wrapper.find("h4").findAll(BIconCaretDownFill).length).toBe(1);
        expect(wrapper.find("h4").element.parentElement!!.classList).toContain("cursor-pointer");

        wrapper.find("h4").trigger("click");

        await Vue.nextTick();

        let sections = wrapper.findAll(BCollapse);
        expect(sections.at(0).props("visible")).toBe(true);
        // interventions should remain visible
        expect(sections.at(1).props("visible")).toBe(true);

        expect(wrapper.find("h4").findAll(BIconCaretUpFill).length).toBe(1);

        wrapper.find("h4").trigger("click");

        await Vue.nextTick();

        sections = wrapper.findAll(BCollapse);
        expect(sections.at(0).props("visible")).toBe(false);
        // interventions should remain visible
        expect(sections.at(1).props("visible")).toBe(true);
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

    it("shows baseline if current step changes to 1", async () => {

        const proj = mockProject()
        proj.currentRegion.step = 2;
        const store = createStore(jest.fn(), jest.fn(), proj);
        const wrapper = shallowMount(regionPage, {localVue, store, router});

        const sections = wrapper.findAll(BCollapse);
        expect(sections.at(0).props("visible")).toBe(false);
        expect(sections.at(1).props("visible")).toBe(true);

        proj.currentRegion.step = 1;
        wrapper.setProps({currentProject: {...proj}});

        await Vue.nextTick();

        expect(sections.at(0).props("visible")).toBe(true);
        expect(sections.at(1).props("visible")).toBe(false);
    });

    it("saves baseline settings and sets current step to 2 when next button is clicked", async () => {
        const mockSetRegionStep = jest.fn();
        const mockSetBaselineSettings = jest.fn();
        const store = createStore(jest.fn(), mockSetRegionStep, mockProject(), mockSetBaselineSettings);
        const wrapper = mount(regionPage, {localVue, store, router});

        wrapper.find("button").trigger("click");

        await Vue.nextTick();

        // sets step
        expect(mockSetRegionStep.mock.calls.length).toBe(1);
        expect(mockSetRegionStep.mock.calls[0][1]).toBe(2);

        // toggles baseline closed
        const sections = wrapper.findAll(BCollapse);
        expect(sections.at(0).props("visible")).toBe(false);

        // saves baseline settings
        expect(mockSetBaselineSettings.mock.calls.length).toBe(1);
    });

    it("makes next button disabled when baseline is not valid", async () => {
        const store = createStore();
        const wrapper = shallowMount(regionPage, {store, localVue, router});

        wrapper.find(baseline).vm.$emit("validate", false);

        await Vue.nextTick();
        expect(wrapper.find("button").attributes("disabled")).toBe("disabled");

        //should re-enable on validate(true)
        wrapper.find(baseline).vm.$emit("validate", true);
        await Vue.nextTick();
        expect(wrapper.find("button").attributes("disabled")).toBeUndefined();
    });

});
