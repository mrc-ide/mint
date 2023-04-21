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
import {MAX_REGIONS} from "../../app";

describe("app", () => {
    const oldStratAcrossRegions = switches.stratAcrossRegions;
    afterEach(() => {
        switches.stratAcrossRegions = oldStratAcrossRegions;
    });

    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter({routes: [{path: '/projects/:project/regions/:region'}]});

    const getWrapper = (state = {},
                        addRegionMock = jest.fn(),
                        fetchDocsMock = jest.fn(),
                        fetchBaselineMock = jest.fn(),
                        fetchInterventionsMock = jest.fn(),
                        fetchVersionMock = jest.fn()) => {
        const store = new Vuex.Store({
            state: mockRootState(state),
            actions: {
                [RootAction.FetchDocs]: fetchDocsMock,
                [RootAction.FetchBaselineOptions]: fetchBaselineMock,
                [RootAction.FetchInterventionOptions]: fetchInterventionsMock,
                [RootAction.FetchVersion]: fetchVersionMock
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
        expect(wrapper.findAll(".navbar-nav.mr-auto").length).toBe(0);
    });

    it("show project menu if currentProject is not null", () => {
        switches.stratAcrossRegions = false;
        const state = {
            currentProject: new Project(
                "my project", ["region1", "region2"], {controlSections: []}, {controlSections: []}
            )
        };
        const wrapper = getWrapper(state);
        expect(wrapper.findAll(".navbar-nav").length).toBe(2);
        expect(wrapper.find(".project-header span").text()).toBe("my project:");
        expect(wrapper.findAll(".dropdown-item").length).toBe(3);

        const firstNavLink = wrapper.findAll(".dropdown-item").at(0).find("router-link-stub")
        expect(firstNavLink.html())
            .toBe("<router-link-stub to=\"/projects/my-project/regions/region1\" tag=\"a\"" +
                " ariacurrentvalue=\"page\" event=\"click\" class=\"text-success\">region1</router-link-stub>");
        expect(wrapper.findAll("#stratAcrossRegions").length).toBe(0);
    });

    it("hides add region link if maximum region count has been reached", () => {
        const state = {
            currentProject: new Project(
                "my project", Array(MAX_REGIONS).fill(""), {controlSections: []}, {controlSections: []}
            )
        };
        const wrapper = getWrapper(state);
        expect(wrapper.findAll(".dropdown-item").length).toBe(MAX_REGIONS);
    });

    it("shows strategise link if feature enabled", () => {
        switches.stratAcrossRegions = true;
        const project = new Project(
            "my project", ["region1", "region2"], {controlSections: []}, {controlSections: []}
        );
        project.regions.forEach(region => {
            region.interventionSettings.budgetAllZones = 42;
        });
        const state = { currentProject: project };
        const wrapper = getWrapper(state);
        expect(wrapper.findAll("#stratAcrossRegions").length).toBe(1);
        expect(wrapper.find("#stratAcrossRegions").text()).toBe("Strategize across regions");
        expect(wrapper.find("#stratAcrossRegions").attributes("to")).toBe("/strategise");
    });

    it("does not show strategise link if fewer than two fully initialised regions exist", () => {
        switches.stratAcrossRegions = true;
        const project = new Project(
            "my project", ["region1", "region2"], {controlSections: []}, {controlSections: []}
        );
        project.regions[0].interventionSettings.budgetAllZones = 42;
        const state = { currentProject: project };
        const wrapper = getWrapper(state);
        expect(wrapper.findAll("#stratAcrossRegions").length).toBe(0);
    });

    it("fetches docs, options and version before mount", () => {
        const fetchDocsMock = jest.fn();
        const fetchBaselineMock = jest.fn();
        const fetchInterventionsMock = jest.fn();
        const fetchVersionMock = jest.fn();
        getWrapper({}, jest.fn(), fetchDocsMock, fetchBaselineMock, fetchInterventionsMock, fetchVersionMock);
        expect(fetchDocsMock.mock.calls.length).toBe(1);
        expect(fetchBaselineMock.mock.calls.length).toBe(1);
        expect(fetchInterventionsMock.mock.calls.length).toBe(1);
        expect(fetchVersionMock.mock.calls.length).toBe(1);
    });

    it("adds new region and navigates to it", async () => {
        const state = {
            currentProject: mockProject("my project"),
            baselineOptions: {controlSections: []},
            interventionOptions: {controlSections: []}
        };
        const addRegionMock = jest.fn();
        const rendered = getWrapper(state, addRegionMock);
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
            currentProject: new Project("project", ["region 1"], {controlSections: []}, {controlSections: []})
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
            currentProject: new Project("project", ["region 1"], {controlSections: []}, {controlSections: []})
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
