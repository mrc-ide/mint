import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import app from "../../app/components/app.vue";
import {mockProject, mockRootState} from "../mocks";

describe("app", () => {

    const getWrapper = (state = {}) => {
        const store = new Vuex.Store({
            state: mockRootState(state)
        })
        return shallowMount(app, {store, stubs: ['router-link', 'router-view']});
    }

    it("does not show second nav bar if currentProject is null", () => {
        const wrapper = getWrapper();
        expect(wrapper.findAll(".navbar").length).toBe(1);
    });

    it("show second nav bar if currentProject is not null", () => {
        const state = {
            currentProject: mockProject({
                name: "my project",
                regions: [{name: "region1"}, {name: "region2"}],
                currentRegion: {name: "region1"}
            })
        }
        const wrapper = getWrapper(state);
        expect(wrapper.findAll(".navbar").length).toBe(2);
        expect(wrapper.find(".project-header span").text()).toBe("my project:");
        expect(wrapper.findAll(".dropdown-item").length).toBe(2);

        const firstNavLink = wrapper.findAll(".dropdown-item").at(0).find("router-link-stub")
        expect(firstNavLink.text()).toBe("region1");
        expect(firstNavLink.props("to")).toBe("/projects/my-project/regions/region1");
    });

});
