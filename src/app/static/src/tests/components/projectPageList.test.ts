import Vue from "vue";
import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import VueTagsInput from '@johmun/vue-tags-input';
import projectListPage from "../../app/components/projectListPage.vue";
import {mockProject, mockRootState} from "../mocks";
import {RootMutation} from "../../app/mutations";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
import dropDown from "../../app/components/dropDown.vue";
import {Project} from "../../app/models/project";
import {BModal} from "bootstrap-vue";

describe("project page", () => {

    const mockBaselineOptions: DynamicFormMeta = {controlSections: []};
    const mockInterventionOptions: DynamicFormMeta = {
        controlSections: [{
            label: "S1",
            controlGroups: [{
                controls: [
                    {name: "c1", type: "number", required: true}
                ]
            }]
        }]
    };

    const createStore = (addProjectMock = jest.fn(), setProjectMock = jest.fn()) => {
        return new Vuex.Store({
            state: mockRootState({
                baselineOptions: mockBaselineOptions,
                interventionOptions: mockInterventionOptions
            }),
            mutations: {
                [RootMutation.SetCurrentProject]: setProjectMock,
                [RootMutation.AddProject]: addProjectMock
            }
        });
    };

    it("button is disabled if project name is missing", async () => {
        const store = createStore();
        const wrapper = shallowMount(projectListPage, {store});

        wrapper.find(VueTagsInput).vm.$emit("tagsChanged", [{text: "South"}])

        await Vue.nextTick();

        expect(wrapper.find("button").attributes().disabled).toBe("disabled");
        expect(wrapper.find("button").classes()).toContain("disabled");
    });

    it("button is disabled if regions and newRegion are missing", async () => {
        const store = createStore();
        const wrapper = shallowMount(projectListPage, {store});
        wrapper.find("input").setValue("new project");

        await Vue.nextTick();

        expect(wrapper.find("button").attributes().disabled).toBe("disabled");
        expect(wrapper.find("button").classes()).toContain("disabled");
    });

    it("button is enabled when project name and regions are provided", async () => {
        const store = createStore();
        const wrapper = shallowMount(projectListPage, {store});

        wrapper.find("input").setValue("new project");
        wrapper.find(VueTagsInput).vm.$emit("tags-changed", [{text: "South"}])

        await Vue.nextTick();

        expect(wrapper.find("button").attributes().disabled).toBeUndefined();
        expect(wrapper.find("button").classes()).not.toContain("disabled");
    });

    it("button is enabled when project name and newRegion are provided", async () => {
        const store = createStore();
        const wrapper = shallowMount(projectListPage, {store});

        wrapper.find("input").setValue("new project");
        wrapper.setData({newRegion: "region"});

        await Vue.nextTick();

        expect(wrapper.find("button").attributes().disabled).toBeUndefined();
        expect(wrapper.find("button").classes()).not.toContain("disabled");
    });

    it("can add new project from region tags", async () => {
        const mockMutation = jest.fn();
        const mockRouter = [] as any[];
        const store = createStore(mockMutation);
        const wrapper = shallowMount(projectListPage, {store, mocks: {$router: mockRouter}});

        wrapper.find("input").setValue("new project");
        wrapper.find(VueTagsInput).vm.$emit("tags-changed", [{text: " South "}])

        await Vue.nextTick();

        wrapper.find("button").trigger("click");

        await Vue.nextTick();

        expect(mockMutation.mock.calls.length).toBe(1);
        expect(mockMutation.mock.calls[0][1]).toEqual({
            name: "new project",
            slug: "new-project",
            regions: [{
                name: "South", // check trimmed whitespace
                slug: "south",
                url: "/projects/new-project/regions/south",
                baselineOptions: mockBaselineOptions,
                baselineSettings: {},
                interventionOptions: mockInterventionOptions,
                interventionSettings: {"c1": null},
                prevalenceGraphData: [],
                impactTableData: [],
                costGraphData: [],
                costTableData: [],
                step: 1
            }],
            currentRegion: {
                name: "South",
                slug: "south",
                url: "/projects/new-project/regions/south",
                baselineOptions: mockBaselineOptions,
                baselineSettings: {},
                interventionOptions: mockInterventionOptions,
                interventionSettings: {"c1": null},
                prevalenceGraphData: [],
                impactTableData: [],
                costGraphData: [],
                costTableData: [],
                step: 1
            }
        });

        // options should equal options from store, but be fresh deep copy
        expect(mockMutation.mock.calls[0][1].currentRegion.baselineOptions.controlSections)
            .not.toBe(mockBaselineOptions.controlSections);
        expect(mockMutation.mock.calls[0][1].currentRegion.interventionOptions.controlSections)
            .not.toBe(mockInterventionOptions.controlSections);

        expect(mockRouter[0].path).toBe("/projects/new-project/regions/south");
    });

    it("can add new project from single region typed but not entered", async () => {
        const mockMutation = jest.fn();
        const mockRouter = [] as any[];
        const store = createStore(mockMutation);
        const wrapper = shallowMount(projectListPage, {store, mocks: {$router: mockRouter}});

        wrapper.find("input").setValue("new project");
        wrapper.setData({newRegion: "South"});

        await Vue.nextTick();

        wrapper.find("button").trigger("click");

        await Vue.nextTick();

        expect(mockMutation.mock.calls.length).toBe(1);
        expect(mockMutation.mock.calls[0][1]).toEqual({
            name: "new project",
            slug: "new-project",
            regions: [{
                name: "South",
                slug: "south",
                url: "/projects/new-project/regions/south",
                baselineOptions: mockBaselineOptions,
                baselineSettings: {},
                interventionOptions: mockInterventionOptions,
                interventionSettings: {"c1": null},
                prevalenceGraphData: [],
                impactTableData: [],
                costGraphData: [],
                costTableData: [],
                step: 1
            }],
            currentRegion: {
                name: "South",
                slug: "south",
                url: "/projects/new-project/regions/south",
                baselineOptions: mockBaselineOptions,
                baselineSettings: {},
                interventionOptions: mockInterventionOptions,
                interventionSettings: {"c1": null},
                prevalenceGraphData: [],
                impactTableData: [],
                costGraphData: [],
                costTableData: [],
                step: 1
            }
        });

        expect(mockRouter[0].path).toBe("/projects/new-project/regions/south");
    });

    it("validates last typed but not entered region", async () => {
        const mockMutation = jest.fn();
        const mockRouter = [] as any[];
        const store = createStore(mockMutation);
        const wrapper = shallowMount(projectListPage, {store, mocks: {$router: mockRouter}});

        wrapper.find("input").setValue("new project");

        // set invalid state
        wrapper.setData({newRegion: "South", regions: [{text: "South"}]});
        await Vue.nextTick();
        wrapper.find("button").trigger("click");
        await Vue.nextTick();

        expect(mockMutation.mock.calls.length).toBe(0);
        expect(wrapper.find(".text-danger").isVisible()).toBe(true);

        // now set valid region
        wrapper.setData({newRegion: "North", invalidTag: false});
        await Vue.nextTick();
        wrapper.find("button").trigger("click");
        await Vue.nextTick();

        expect(mockMutation.mock.calls.length).toBe(1);
        expect(mockMutation.mock.calls[0][1].regions.length).toBe(2);
        expect(mockMutation.mock.calls[0][1].regions[0].name).toBe("South");
        expect(mockMutation.mock.calls[0][1].regions[1].name).toBe("North");
    });

    it("placeholder text goes away once at least one region is entered", async () => {

        const store = createStore();
        const wrapper = shallowMount(projectListPage, {store});

        let tagsInput = wrapper.find(VueTagsInput);
        expect(tagsInput.props("placeholder")).toBe("First region, second region");

        tagsInput.vm.$emit("tags-changed", [{text: "South"}]);

        await Vue.nextTick();
        expect(tagsInput.props("placeholder")).toBe("...");

    });

    it("cannot add regions with duplicate slugs", async () => {
        const store = createStore();
        const wrapper = shallowMount(projectListPage, {store});

        // this is a bit awkward to test, but we assume the third party component
        // works as expected and just check that the props are set up correctly
        const tagsInput = wrapper.find(VueTagsInput);
        const isDuplicate = tagsInput.props("isDuplicate") as any;
        expect(isDuplicate([{text: "south region"}], {text: "South-Region"})).toBe(true);
        expect(isDuplicate([{text: "south region"}], {text: " south region "})).toBe(true);
        expect(isDuplicate([{text: "south region"}], {text: "North region"})).toBe(false);
        expect(tagsInput.props("avoidAddingDuplicates")).toBe(true);

        tagsInput.vm.$emit("adding-duplicate");
        await Vue.nextTick();
        expect(wrapper.find(".text-danger").isVisible()).toBe(true);
    });

    it("validation message disappears when tag is edited", async () => {
        const store = createStore();
        const wrapper = shallowMount(projectListPage, {store});

        const tagsInput = wrapper.find(VueTagsInput);
        tagsInput.vm.$emit("adding-duplicate");
        await Vue.nextTick();
        expect(wrapper.find(".text-danger").isVisible()).toBe(true);

        // enter and comma are handled by the tags input, so should not do anything
        tagsInput.trigger("keydown", {
            key: "Enter"
        });
        await Vue.nextTick();
        expect(wrapper.find(".text-danger").isVisible()).toBe(true);

        tagsInput.trigger("keydown", {
            key: ","
        });
        await Vue.nextTick();
        expect(wrapper.find(".text-danger").isVisible()).toBe(true);

        // other keys should remove message
        tagsInput.trigger("keydown");
        await Vue.nextTick();
        expect(wrapper.find(".text-danger").isVisible()).toBe(false);

    });

    it("welcome text changes based on number of projects", async () => {
        const store = createStore();
        const wrapper = shallowMount(projectListPage, {store});
        expect(wrapper.find("h1").text()).toBe("Create a project to get started");

        store.state.projects.push(mockProject());

        await Vue.nextTick();

        expect(wrapper.find("h1").text()).toBe("You have 1 project");

        store.state.projects.push(mockProject());

        await Vue.nextTick();

        expect(wrapper.find("h1").text()).toBe("You have 2 projects");
    });

    it("renders list of projects", () => {
        const store = createStore();
        store.state.projects.push(new Project("testproj", ["region 1", "region 2"], {controlSections: []}, {controlSections: []}));
        store.state.projects.push(mockProject());
        const wrapper = shallowMount(projectListPage, {store});
        expect(wrapper.findAll(dropDown).length).toBe(2);

        const testproj = wrapper.findAll(dropDown).at(0);
        expect(testproj.findAll("a").length).toBe(2);
        expect(testproj.findAll("a").at(0).text()).toBe("region 1");
        expect(testproj.findAll("a").at(1).text()).toBe("region 2");
    });

    it("can start new project", async () => {
        const store = createStore();
        store.state.projects.push(mockProject());
        const wrapper = shallowMount(projectListPage, {store});
        expect(wrapper.findAll(".card").length).toBe(0);

        const startNewProjectLink = wrapper.findAll("li").at(1);
        expect(startNewProjectLink.text()).toBe("+ Start new project");
        startNewProjectLink.find("a").trigger("click");

        await Vue.nextTick();

        expect(wrapper.findAll(".card").length).toBe(1);
    });

    it("sets current project to null on mount", () => {
        const setCurrentProjectMock = jest.fn();
        const store = createStore(jest.fn(), setCurrentProjectMock);
        shallowMount(projectListPage, {store});
        expect(setCurrentProjectMock.mock.calls.length).toBe(1);
        expect(setCurrentProjectMock.mock.calls[0][1]).toBe(null);
    });

    it("can navigate to project region", async () => {
        const setCurrentProjectMock = jest.fn();
        const mockRouter = [] as any[];
        const store = createStore(jest.fn(), setCurrentProjectMock);
        const testProj = new Project("testproj", ["region 1", "region 2"], {controlSections: []}, {controlSections: []})
        store.state.projects.push(testProj);
        const wrapper = shallowMount(projectListPage, {store, mocks: {$router: mockRouter}});

        expect(setCurrentProjectMock.mock.calls.length).toBe(1);
        expect(setCurrentProjectMock.mock.calls[0][1]).toBe(null);

        wrapper.find(dropDown).find("a").trigger("click");
        await Vue.nextTick();

        expect(setCurrentProjectMock.mock.calls.length).toBe(2);
        expect(setCurrentProjectMock.mock.calls[1][1]).toBe(testProj);
        expect(mockRouter[0].path).toBe("/projects/testproj/regions/region-1");
    });

});
