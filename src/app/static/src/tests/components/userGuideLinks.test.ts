import {shallowMount} from "@vue/test-utils";
import UserGuideLinks from "../../app/components/userGuideLinks.vue";

describe("User Guide links", () => {

    it("renders long version", () => {
        const wrapper = shallowMount(UserGuideLinks);
        expect(wrapper.findAll("a").at(0).text()).toContain("User Guide")
    });

    it("renders short version", () => {
        const wrapper = shallowMount(UserGuideLinks, {
            propsData: {
                short: true
            }
        });
        expect(wrapper.findAll("a").at(0).text()).toEqual("User Guide")
    });
});

