import {mockRootState} from "../mocks";
import Vuex from "vuex";
import {mount} from "@vue/test-utils";
import VersionDropDown from "../../app/components/versionDropDown.vue";

describe("versionDropDown", () =>{
    it("renders as expected", () => {
        const state = mockRootState({
            versions: {
                mint: "1.2.3",
                mintr: "4.5.6",
                data: "20230421"
            }
        });
        const store = new Vuex.Store({state});
        const wrapper = mount(VersionDropDown, {store});
        expect(wrapper.find(".dropdown-toggle").text()).toBe("v20230421");
        expect(wrapper.find(".dropdown-item").text()).toBe("News");
        const versionItems = wrapper.findAll(".dropdown-item-unclickable");
        expect(versionItems.length).toBe(3);
        expect(versionItems.at(0).text()).toBe("data: v20230421");
        expect(versionItems.at(1).text()).toBe("mint: v1.2.3");
        expect(versionItems.at(2).text()).toBe("mintr: v4.5.6");
    });
});