import Vue from "vue";
import Vuex from "vuex";
import {shallowMount} from "@vue/test-utils";
import VueTagsInput from '@johmun/vue-tags-input';
import projectListPage from "../../app/components/projectListPage.vue";
import {mockRootState} from "../mocks";
import {RootMutation} from "../../app/mutations";

describe("project page", () => {

    const createStore = (addProjectMock = jest.fn()) => {
        return new Vuex.Store({
            state: mockRootState(),
            mutations: {
                [RootMutation.AddProject]: addProjectMock
            }
        });
    };

    it("button is disabled if project name is missing", async () => {
        const store = createStore()
        const wrapper = shallowMount(projectListPage, {store});

        wrapper.find(VueTagsInput).vm.$emit("tagsChanged", [{text: "South"}])

        await Vue.nextTick();

        expect(wrapper.find("button").attributes().disabled).toBe("disabled");
        expect(wrapper.find("button").classes()).toContain("disabled");
    });

    it("button is disabled if regions are missing", async () => {
        const store = createStore()
        const wrapper = shallowMount(projectListPage, {store});
        wrapper.find("input").setValue("new project")
        await Vue.nextTick();

        expect(wrapper.find("button").attributes().disabled).toBe("disabled");
        expect(wrapper.find("button").classes()).toContain("disabled");
    });

    it("button is enabled when project name and regions are provided", async () => {
        const store = createStore()
        const wrapper = shallowMount(projectListPage, {store});

        wrapper.find("input").setValue("new project");
        wrapper.find(VueTagsInput).vm.$emit("tags-changed", [{text: "South"}])

        await Vue.nextTick();

        expect(wrapper.find("button").attributes().disabled).toBeUndefined();
        expect(wrapper.find("button").classes()).not.toContain("disabled");
    });

    it("can add new project", async () => {
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
        expect(mockMutation.mock.calls[0][1]).toStrictEqual({
            name: "new project",
            regions: [{name: "South"}],
            currentRegion: {name: "South"}
        });

        expect(mockRouter[0].path).toBe("/projects/new-project/regions/south")
    });
});
