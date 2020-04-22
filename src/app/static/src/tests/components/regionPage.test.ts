import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import regionPage from "../../app/components/regionPage.vue";
import {mockRootState} from "../mocks";
import {RootMutation} from "../../app/mutations";

describe("region page", () => {

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = new VueRouter({routes: [{path: '/projects/:project/regions/:region', component: regionPage}]})

    const createStore = (setCurrentRegionMock = jest.fn()) => {
        return new Vuex.Store({
            state: mockRootState(),
            mutations: {
                [RootMutation.SetCurrentRegion]: setCurrentRegionMock
            }
        });
    };

    it("sets current region when route changes", async () => {

        const setCurrentRegionMock = jest.fn();
        const store = createStore(setCurrentRegionMock);

        shallowMount(regionPage, {localVue, store, router});

        await router.push({
            path: "/projects/new-project/regions/new-region"
        })
        await Vue.nextTick();
        expect(setCurrentRegionMock.mock.calls.length).toBe(1);
        expect(setCurrentRegionMock.mock.calls[0][1]).toBe("/projects/new-project/regions/new-region");
    });

});
