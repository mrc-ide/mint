import {shallowMount, Wrapper} from "@vue/test-utils";
import UserGuideLinks from "../../app/components/userGuideLinks.vue";
import {switches} from "../../app/featureSwitches";

const expectLinksToExpectedResources = (wrapper: Wrapper<any>) => {
    const links = wrapper.findAll("a");
    expect(links.at(0).attributes("href")).toBe("/public/resources/MINT v2.0 User-Guide-English.pdf");
    if (switches.frenchUserGuide) {
        expect(links.at(1).attributes("href")).toBe("/public/resources/User-Guide-fr.pdf");
    } else {
        expect(links.length).toBe(1);
    }
};

describe("User Guide links", () => {

    it("renders long version", () => {
        const wrapper = shallowMount(UserGuideLinks);
        const expectedText = switches.frenchUserGuide ? "English" : "User Guide";
        expect(wrapper.findAll("a").at(0).text()).toContain(expectedText);
        expectLinksToExpectedResources(wrapper);
    });

    it("renders short version", () => {
        const wrapper = shallowMount(UserGuideLinks, {
            propsData: {
                short: true
            }
        });
        const expectedText = switches.frenchUserGuide ? "en" : "User Guide";
        expect(wrapper.findAll("a").at(0).text()).toEqual(expectedText);
        expectLinksToExpectedResources(wrapper);
    });

    it("default frenchUserGuide switch value", () => {
        expect(!!switches.frenchUserGuide).toBe(false);
    });
});

