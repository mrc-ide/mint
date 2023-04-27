import PrivacyPage from "../../app/components/privacyPage.vue";
import {mount} from "@vue/test-utils";

describe("Privacy Page", ()=> {
    it("renders as expected", () => {
        const wrapper = mount(PrivacyPage);
        expect(wrapper.find("h1").text()).toBe("Privacy notice for mint.dide.ic.ac.uk");
    });
});