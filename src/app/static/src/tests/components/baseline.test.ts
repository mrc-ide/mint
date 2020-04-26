import {shallowMount} from "@vue/test-utils";
import {DynamicForm} from "@reside-ic/vue-dynamic-form";
import Baseline from "../../app/components/baseline.vue";
import Vuex from "vuex";
import {mockRootState} from "../mocks";
import {Project} from "../../app/models/project";

describe("baseline", () => {

    const baselineOptions = {
        controlSections: [
            { label: "section1", controlGroups: [] },
            { label: "section2", controlGroups: [] },
            { label: "section3", controlGroups: [] }
        ]
    };
    const getWrapper = (addProjectMock = jest.fn()) => {
        const store =  new Vuex.Store({
            state: mockRootState({
                currentProject: new Project("project 1", ["region 1"], null, baselineOptions)
            })
        });

        return shallowMount(Baseline, {store});
    };

    it("renders baseline options from current region", () => {
        const wrapper = getWrapper();
        expect(wrapper.find(DynamicForm).exists()).toBe(true);
        expect(wrapper.find(DynamicForm).props("formMeta").controlSections.length).toBe(3);
    });
});