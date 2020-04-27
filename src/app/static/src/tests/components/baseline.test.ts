import {shallowMount} from "@vue/test-utils";
import {DynamicForm} from "@reside-ic/vue-dynamic-form";
import Baseline from "../../app/components/baseline.vue";
import Vuex from "vuex";
import {mockRootState} from "../mocks";
import {Project} from "../../app/models/project";
import {RootMutation} from "../../app/mutations";
import Vue from "vue";

describe("baseline", () => {

    const baselineOptions = {
        controlSections: [
            { label: "section1", controlGroups: [] },
            { label: "section2", controlGroups: [] },
            { label: "section3", controlGroups: [] }
        ]
    };
    const getWrapper = (setBaselineMock = jest.fn()) => {
        const store =  new Vuex.Store({
            state: mockRootState({
                currentProject: new Project("project 1", ["region 1"], baselineOptions)
            }),
            mutations: {
                [RootMutation.SetCurrentRegionBaselineOptions]: setBaselineMock
            }
        });

        return shallowMount(Baseline, {store});
    };

    it("renders baseline options from current region", () => {
        const wrapper = getWrapper();
        expect(wrapper.find(DynamicForm).exists()).toBe(true);
        expect(wrapper.find(DynamicForm).props("formMeta").controlSections.length).toBe(3);
    });

    it("commits mutation when form data changes", async () => {
        const mockMutation = jest.fn();

        const wrapper = getWrapper(mockMutation);
        const newBaseline = {controlSections: "NEW FORM DATA"};
        wrapper.find(DynamicForm).vm.$emit("change", [newBaseline]);

        await Vue.nextTick();
        expect(mockMutation.mock.calls.length).toBe(1);
        expect(mockMutation.mock.calls[0][1][0]).toBe(newBaseline);
    });
});