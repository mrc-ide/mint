import Vue from "vue";
import Vuex from "vuex";
import {createLocalVue, shallowMount} from "@vue/test-utils";
import app from "../../app/components/app.vue";
import {mockProject, mockRootState} from "../mocks";
import {Project, Region} from "../../app/models/project";
import {RootAction} from "../../app/actions";
import {BModal} from "bootstrap-vue";
import {RootMutation} from "../../app/mutations";
import VueRouter from "vue-router";
import {switches} from "../../app/featureSwitches";

describe("app", () => {

    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter({routes: [{path: '/projects/:project/regions/:region'}]});

    const getWrapper = (state = {},
                        fetchConfigMock = jest.fn(),
                        addRegionMock = jest.fn(),
                        fetchDocsMock = jest.fn()) => {
        const store = new Vuex.Store({
            state: mockRootState(state),
            actions: {
                [RootAction.FetchConfig]: fetchConfigMock,
                [RootAction.FetchDocs]: fetchDocsMock
            },
            mutations: {
                [RootMutation.AddRegion]: addRegionMock
            }
        });
        return shallowMount(app, {
            localVue,
            router,
            store,
            stubs: ['router-link', 'router-view']
        });
    };

    it("does not show project menu if currentProject is null", () => {
        const wrapper = getWrapper();
        expect(wrapper.findAll(".navbar-nav").length).toBe(0);
    });

    it("show nav bar if currentProject is not null", () => {
        const state = {
            currentProject: new Project(
                "my project", ["region1", "region2"], {controlSections: []}, {controlSections: []}
            )
        };
        const wrapper = getWrapper(state);
        expect(wrapper.findAll(".navbar-nav").length).toBe(1);
        expect(wrapper.find(".project-header span").text()).toBe("my project:");
        expect(wrapper.findAll(".dropdown-item").length).toBe(3);

        const firstNavLink = wrapper.findAll(".dropdown-item").at(0).find("router-link-stub")
        expect(firstNavLink.html())
            .toBe("<router-link-stub to=\"/projects/my-project/regions/region1\"" +
                " tag=\"a\" event=\"click\" class=\"text-success\">region1</router-link-stub>");
        if (switches.stratAcrossRegions) {
            expect(wrapper.findAll("#stratAcrossRegions").length).toBe(1);
            expect(wrapper.find("#stratAcrossRegions").text()).toBe("Strategize across regions");
            expect(wrapper.find("#stratAcrossRegions").attributes("href")).toBe("#");
        } else expect(wrapper.findAll("#stratAcrossRegions").length).toBe(0);
    });

    it("fetches config and docs before mount", () => {
        const fetchConfigMock = jest.fn();
        const fetchDocsMock = jest.fn();
        getWrapper({}, fetchConfigMock, jest.fn(), fetchDocsMock);
        expect(fetchConfigMock.mock.calls.length).toBe(1);
        expect(fetchDocsMock.mock.calls.length).toBe(1);
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

        expect(router.currentRoute.path).toBe("/projects/my-project/regions/region2");
    });

    it("clears new region input on cancel", async () => {
        const state = {
            currentProject: mockProject("my project")
        };
        const rendered = getWrapper(state);
        rendered.findAll(".dropdown-item").at(1).find("a").trigger("click");
        await Vue.nextTick();

        rendered.find(BModal).find("input").setValue("region2");
        await Vue.nextTick();
        rendered.find(BModal).vm.$emit("cancel");
        await Vue.nextTick();

        // open it up again
        rendered.findAll(".dropdown-item").at(1).find("a").trigger("click");
        await Vue.nextTick();

        expect((rendered.find(BModal).find("input").element as HTMLInputElement).value).toBe("");
    });

    it("cannot add new region without providing a name", async () => {
        const state = {
            currentProject: mockProject("my project")
        };
        const rendered = getWrapper(state);
        rendered.findAll(".dropdown-item").at(1).find("a").trigger("click");
        await Vue.nextTick();

        expect(rendered.find(BModal).vm.$props.okDisabled).toBe(true);
        rendered.find(BModal).find("input").setValue("region2");
        await Vue.nextTick();

        expect(rendered.find(BModal).vm.$props.okDisabled).toBe(false);
    });

    it("cannot add new region with the same name as an existing one", async () => {
        const state = {
            currentProject: new Project(name, ["region 1"], {controlSections: []}, {controlSections: []})
        };
        const rendered = getWrapper(state);
        rendered.findAll(".dropdown-item").at(1).find("a").trigger("click");
        await Vue.nextTick();

        expect(rendered.find(BModal).vm.$props.okDisabled).toBe(true);
        expect(rendered.find(BModal).find(".text-danger").isVisible()).toBe(false);
        rendered.find(BModal).find("input").setValue("region 1");
        await Vue.nextTick();

        expect(rendered.find(BModal).vm.$props.okDisabled).toBe(true);
        expect(rendered.find(BModal).find(".text-danger").isVisible()).toBe(true);

        rendered.find(BModal).find("input").setValue("region 2");
        await Vue.nextTick();

        expect(rendered.find(BModal).vm.$props.okDisabled).toBe(false);
        expect(rendered.find(BModal).find(".text-danger").isVisible()).toBe(false);
    });

    it("cannot add new region with a name that will result in duplicate urls", async () => {
        const state = {
            currentProject: new Project(name, ["region 1"], {controlSections: []}, {controlSections: []})
        };
        const rendered = getWrapper(state);
        rendered.findAll(".dropdown-item").at(1).find("a").trigger("click");
        await Vue.nextTick();

        expect(rendered.find(BModal).vm.$props.okDisabled).toBe(true);
        rendered.find(BModal).find("input").setValue("region 1");
        await Vue.nextTick();

        expect(rendered.find(BModal).vm.$props.okDisabled).toBe(true);

        rendered.find(BModal).find("input").setValue("REGION 1");
        await Vue.nextTick();

        expect(rendered.find(BModal).vm.$props.okDisabled).toBe(true);

        rendered.find(BModal).find("input").setValue("region-1");
        await Vue.nextTick();

        expect(rendered.find(BModal).vm.$props.okDisabled).toBe(true);
    });

});
