import {shallowMount} from "@vue/test-utils";
import {DynamicForm} from "@reside-ic/vue-dynamic-form";
import Baseline from "../../app/components/baseline.vue";


describe("baseline", () => {

    it("renders dynamic form", () => {
        const wrapper = shallowMount(Baseline);
        expect(wrapper.find(DynamicForm).exists()).toBe(true);
        expect(wrapper.find(DynamicForm).props("formMeta").controlSections.length).toBe(3);
    });
});