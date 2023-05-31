import {shallowMount, Wrapper} from "@vue/test-utils";
import UserGuideLinks from "../../app/components/userGuideLinks.vue";

const expectLinksToExpectedResources = (wrapper: Wrapper<any>) => {
    const links = wrapper.findAll("a");
    expect(links.at(0).attributes("href")).toBe("/public/resources/MINT v2.0 User-Guide-English.pdf");
    expect(links.at(1).attributes("href")).toBe("/public/resources/User-Guide-fr.pdf");
};

describe("User Guide links", () => {

    it("renders long version", () => {
        const wrapper = shallowMount(UserGuideLinks);
        expect(wrapper.findAll("a").at(0).text()).toContain("English");
        expectLinksToExpectedResources(wrapper);
    });

    it("renders short version", () => {
        const wrapper = shallowMount(UserGuideLinks, {
            propsData: {
                short: true
            }
        });
        expect(wrapper.findAll("a").at(0).text()).toEqual("en");
        expectLinksToExpectedResources(wrapper);
    });
});

