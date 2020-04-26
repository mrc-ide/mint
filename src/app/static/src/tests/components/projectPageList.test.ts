import Vue from "vue";
import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import VueTagsInput from '@johmun/vue-tags-input';
import projectListPage from "../../app/components/projectListPage.vue";
import {mockRootState} from "../mocks";
import {RootMutation} from "../../app/mutations";
import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";

describe("project page", () => {

    const mockBaselineOptions: DynamicFormMeta = { controlSections: [] };

    const createStore = (addProjectMock = jest.fn()) => {
        return new Vuex.Store({
            state: mockRootState({
                baselineOptions: mockBaselineOptions
            }),
            mutations: {
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
        wrapper.find(VueTagsInput).vm.$emit("tags-changed", [{text: "South"}])

        await Vue.nextTick();

        wrapper.find("button").trigger("click");

        await Vue.nextTick();

        expect(mockMutation.mock.calls.length).toBe(1);
        expect(mockMutation.mock.calls[0][1]).toEqual({
            name: "new project",
            regions: [{name: "South", url: "/projects/new-project/regions/south", baselineOptions: mockBaselineOptions}],
            currentRegion: {name: "South", url: "/projects/new-project/regions/south", baselineOptions: mockBaselineOptions}
        });

        expect(mockRouter[0].path).toBe("/projects/new-project/regions/south");
    });

    it("can add new project from single region typed but not entered", async () => {
        const mockMutation = jest.fn();
        const mockRouter = [] as any[];
        const store = createStore(mockMutation);
        const wrapper = shallowMount(projectListPage, {store, mocks: {$router: mockRouter}});

        wrapper.find("input").setValue("new project");
        wrapper.setData({newRegion: "South"})

        await Vue.nextTick();

        wrapper.find("button").trigger("click");

        await Vue.nextTick();

        expect(mockMutation.mock.calls.length).toBe(1);
        expect(mockMutation.mock.calls[0][1]).toEqual({
            name: "new project",
            regions: [{name: "South", url: "/projects/new-project/regions/south", baselineOptions: mockBaselineOptions}],
            currentRegion: {name: "South", url: "/projects/new-project/regions/south", baselineOptions: mockBaselineOptions}
        });

        expect(mockRouter[0].path).toBe("/projects/new-project/regions/south");
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

});
