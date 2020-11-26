import {shallowMount} from "@vue/test-utils";
import LoadingSpinner from "../../app/components/loadingSpinner.vue";

describe("Loading spinner", () => {

    it("is 200px by default", () => {
        const wrapper = shallowMount(LoadingSpinner);
        expect(wrapper.attributes().height).toBe("200px");
        expect(wrapper.attributes().width).toBe("200px");
    });

    it("is 40px when xs", () => {
        const wrapper = shallowMount(LoadingSpinner, {
            propsData: {
                size: "xs"
            }
        });
        expect(wrapper.attributes().height).toBe("40px");
        expect(wrapper.attributes().width).toBe("40px");
    });

    it("is 100px when sm", () => {
        const wrapper = shallowMount(LoadingSpinner, {
            propsData: {
                size: "sm"
            }
        });
        expect(wrapper.attributes().height).toBe("100px");
        expect(wrapper.attributes().width).toBe("100px");
    });

    it("gets size as class", () => {
        const wrapper = shallowMount(LoadingSpinner, {
            propsData: {
                size: "xs"
            }
        });
        expect(wrapper.classes()).toContain("xs");
    });

});

