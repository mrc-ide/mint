import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import app from "../../app/components/app.vue";
import {mockRootState} from "../mocks";
import {Project} from "../../app/models/project";
import {RootAction} from "../../app/actions";

describe("app", () => {

    const getWrapper = (state = {},
                        fetchOptionsMock = jest.fn(),
                        fetchConfigMock = jest.fn(),
                        fetchTableConfigMock = jest.fn()) => {
        const store = new Vuex.Store({
            state: mockRootState(state),
            actions: {
                [RootAction.FetchBaselineOptions]: fetchOptionsMock,
                [RootAction.FetchPrevalenceGraphConfig]: fetchConfigMock,
                [RootAction.FetchImpactTableConfig]: fetchTableConfigMock
            }
        });
        return shallowMount(app, {store, stubs: ['router-link', 'router-view']});
    };

    it("does not show second nav bar if currentProject is null", () => {
        const wrapper = getWrapper();
        expect(wrapper.findAll(".navbar").length).toBe(1);
    });

    it("show second nav bar if currentProject is not null", () => {
        let state = {
            currentProject: new Project(
                "my project", ["region1", "region2"], {controlSections: []}
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

    it("fetches baseline options, prevalence graph config and impact table config before mount", () => {
        const fetchOptionsMock = jest.fn();
        const fetchConfigMock = jest.fn();
        const fetchTableConfigMock = jest.fn();
        getWrapper({}, fetchOptionsMock, fetchConfigMock, fetchTableConfigMock);

        expect(fetchOptionsMock.mock.calls.length).toBe(1);
        expect(fetchConfigMock.mock.calls.length).toBe(1);
        expect(fetchTableConfigMock.mock.calls.length).toBe(1);
    });

});
