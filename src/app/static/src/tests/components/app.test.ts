import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import app from "../../app/components/app.vue";
import {mockRootState} from "../mocks";
import {Project} from "../../app/models/project";
import {RootAction} from "../../app/actions";

describe("app", () => {

    const getWrapper = (state = {}, mockFetch = jest.fn()) => {
        const store = new Vuex.Store({
            state: mockRootState(state),
            actions: {
                [RootAction.FetchPrevalenceGraphConfig]: mockFetch
            }
        })
        return shallowMount(app, {store, stubs: ['router-link', 'router-view']});
    }

    it("fetches prevalence graph config on mount", () => {
        const mockFetch = jest.fn();
        getWrapper({}, mockFetch);
        expect(mockFetch.mock.calls.length).toBe(1);
    })

    it("does not show second nav bar if currentProject is null", () => {
        const wrapper = getWrapper();
        expect(wrapper.findAll(".navbar").length).toBe(1);
    });

    it("show second nav bar if currentProject is not null", () => {
        let state = {
            currentProject: new Project(
                "my project", ["region1", "region2"]
            )
        };
        const wrapper = getWrapper(state);
        expect(wrapper.findAll(".navbar").length).toBe(2);
        expect(wrapper.find(".project-header span").text()).toBe("my project:");
        expect(wrapper.findAll(".dropdown-item").length).toBe(2);

        const firstNavLink = wrapper.findAll(".dropdown-item").at(0).find("router-link-stub")
        expect(firstNavLink.html())
            .toBe("<router-link-stub to=\"/projects/my-project/regions/region1\"" +
                " class=\"text-success\">region1</router-link-stub>");
    });

});
