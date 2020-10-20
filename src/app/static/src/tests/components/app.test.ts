import Vue from "vue";
import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import app from "../../app/components/app.vue";
import {mockProject, mockRootState} from "../mocks";
import {Project, Region} from "../../app/models/project";
import {RootAction} from "../../app/actions";
import {BModal} from "bootstrap-vue";
import {RootMutation} from "../../app/mutations";
import {Route} from "vue-router";

describe("app", () => {

    let $router: Route[] = [];

    beforeEach(() => {
        $router = [];
    });

    const getWrapper = (state = {},
                        fetchConfigMock = jest.fn(),
                        addRegionMock = jest.fn()) => {
        const store = new Vuex.Store({
            state: mockRootState(state),
            actions: {
                [RootAction.FetchConfig]: fetchConfigMock
            },
            mutations: {
                [RootMutation.AddRegion]: addRegionMock
            }
        });
        return shallowMount(app, {
            store,
            stubs: ['router-link', 'router-view'],
            mocks: {$router}
        });
    };

    it("does not show second nav bar if currentProject is null", () => {
        const wrapper = getWrapper();
        expect(wrapper.findAll(".navbar").length).toBe(1);
    });

    it("show second nav bar if currentProject is not null", () => {
        const state = {
            currentProject: new Project(
                "my project", ["region1", "region2"], {controlSections: []}, {controlSections: []}
            )
        };
        const wrapper = getWrapper(state);
        expect(wrapper.findAll(".navbar").length).toBe(2);
        expect(wrapper.find(".project-header span").text()).toBe("my project:");
        expect(wrapper.findAll(".dropdown-item").length).toBe(3);

        const firstNavLink = wrapper.findAll(".dropdown-item").at(0).find("router-link-stub")
        expect(firstNavLink.html())
            .toBe("<router-link-stub to=\"/projects/my-project/regions/region1\"" +
                " class=\"text-success\">region1</router-link-stub>");
    });

    it("fetches config before mount", () => {
        const fetchConfigMock = jest.fn();
        getWrapper({}, fetchConfigMock);
        expect(fetchConfigMock.mock.calls.length).toBe(1);
    });

    it("adds new region and navigates to it", async () => {
        const state = {
            currentProject: mockProject("my project"),
            baselineOptions: {controlSections: []},
            interventionOptions: {controlSections: []}
        };
        const addRegionMock = jest.fn();
        const rendered = getWrapper(state, jest.fn(), addRegionMock);
        rendered.findAll(".dropdown-item").at(1).find("a").trigger("click");
        await Vue.nextTick();

        rendered.find(BModal).find("input").setValue("region2");
        await Vue.nextTick();
        rendered.find(BModal).vm.$emit("ok");
        await Vue.nextTick();
        expect(addRegionMock.mock.calls.length).toBe(1);
        expect(addRegionMock.mock.calls[0][1]).toEqual(
            new Region("region2",
                state.currentProject,
                {controlSections: []},
                {controlSections: []})
        );

        expect($router[0]).toEqual({path: "/projects/my-project/regions/region2"});
    });

});
