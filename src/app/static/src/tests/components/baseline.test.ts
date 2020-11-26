import {mount, shallowMount} from "@vue/test-utils";
import {DynamicForm} from "@reside-ic/vue-dynamic-form";
import Baseline from "../../app/components/baseline.vue";
import Vuex from "vuex";
import {mockProject, mockRootState} from "../mocks";
import {Project} from "../../app/models/project";
import {RootMutation} from "../../app/mutations";
import Vue from "vue";
import {RootAction} from "../../app/actions";

describe("baseline", () => {

    const baselineOptions = {
        controlSections: [
            {label: "section1", controlGroups: []},
            {label: "section2", controlGroups: []},
            {label: "section3", controlGroups: []}
        ]
    };
    const getWrapper = (setBaselineMock = jest.fn(),
                        setBaselineSettingsMock = jest.fn(),
                        currentProject = new Project("project 1", ["region 1"], baselineOptions, {controlSections: []})) => {
        const store = new Vuex.Store({
            state: mockRootState({
                currentProject
            }),
            mutations: {
                [RootMutation.SetCurrentRegionBaselineOptions]: setBaselineMock
            },
            actions: {
                [RootAction.SetCurrentRegionBaselineSettings]: setBaselineSettingsMock
            }
        });

        return shallowMount(Baseline, {store});
    };

    it("renders baseline options from current region", () => {
        const wrapper = getWrapper();
        expect(wrapper.find(DynamicForm).exists()).toBe(true);
        expect(wrapper.find(DynamicForm).props("formMeta").controlSections.length).toBe(3);
        expect(wrapper.find(DynamicForm).props("includeSubmitButton")).toBe(false);
    });

    it("if on step 1, just commits mutation when form data changes", async () => {
        const mockMutation = jest.fn();
        const mockAction = jest.fn();
        const project = mockProject();
        const store = new Vuex.Store({
            state: mockRootState({
                currentProject: project
            }),
            mutations: {
                [RootMutation.SetCurrentRegionBaselineOptions]: mockMutation
            },
            actions: {
                [RootAction.SetCurrentRegionBaselineSettings]: mockAction
            }
        });

        const wrapper = mount(Baseline, {store});
        const newBaseline = {controlSections: "NEW FORM DATA"};
        wrapper.find(DynamicForm).vm.$emit("change", [newBaseline]);

        await Vue.nextTick();
        expect(mockMutation.mock.calls.length).toBe(1);
        expect(mockMutation.mock.calls[0][1][0]).toBe(newBaseline);

        await Vue.nextTick();
        expect(wrapper.find(DynamicForm)!!.emitted("submit")).toBeUndefined();
    });

    it("if on step 2, submits form when form data changes", async () => {
        const mockMutation = jest.fn();
        const mockAction = jest.fn();
        const project = mockProject();
        project.currentRegion.step = 2;
        const store = new Vuex.Store({
            state: mockRootState({
                currentProject: project
            }),
            mutations: {
                [RootMutation.SetCurrentRegionBaselineOptions]: mockMutation
            },
            actions: {
                [RootAction.SetCurrentRegionBaselineSettings]: mockAction
            }
        });

        const wrapper = mount(Baseline, {store});
        const newBaseline = {controlSections: "NEW FORM DATA"};
        wrapper.find(DynamicForm).vm.$emit("change", [newBaseline]);

        await Vue.nextTick();
        expect(mockMutation.mock.calls.length).toBe(1);
        expect(mockMutation.mock.calls[0][1][0]).toBe(newBaseline);

        await Vue.nextTick();
        expect(wrapper.find(DynamicForm)!!.emitted("submit")!!.length).toBe(1);
    });

    it("dispatches update baseline settings when form is submitted", async () => {
        const mockSetBaselineSettings = jest.fn();
        const wrapper = getWrapper(jest.fn(), mockSetBaselineSettings);
        const mockSettings = {population: 1000};
        wrapper.find(DynamicForm).vm.$emit("submit", mockSettings);

        await Vue.nextTick();
        expect(mockSetBaselineSettings.mock.calls.length).toBe(1);
        expect(mockSetBaselineSettings.mock.calls[0][1]).toBe(mockSettings);
    });

    it("emits validate event when form is validated", async () => {
        const wrapper = getWrapper();
        wrapper.find(DynamicForm).vm.$emit("validate", true);

        await Vue.nextTick();
        expect(wrapper.emitted("validate")!!.length).toBe(1);
        expect(wrapper.emitted("validate")!![0][0]).toBe(true);
    });
});
