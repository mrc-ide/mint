import {createLocalVue, mount, shallowMount} from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import regionPage from "../../app/components/regionPage.vue";
import {mockProject, mockRootState} from "../mocks";
import {RootMutation} from "../../app/mutations";
import stepButton from "../../app/components/stepButton.vue";
import interventions from "../../app/components/interventions.vue";
import baseline from "../../app/components/baseline.vue";
import {RootAction} from "../../app/actions";

describe("region page", () => {

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = new VueRouter({routes: [{path: '/projects/:project/regions/:region', component: regionPage}]})

    const createStore = (setCurrentRegionMock = jest.fn()) => {
        return new Vuex.Store({
            state: mockRootState({
                currentProject: mockProject()
            }),
            actions: {
                [RootAction.FetchImpactData]: jest.fn()
            },
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
        });
        await Vue.nextTick();
        expect(setCurrentRegionMock.mock.calls.length).toBe(1);
        expect(setCurrentRegionMock.mock.calls[0][1]).toBe("/projects/new-project/regions/new-region");
    });

    it("sets step to baseline when route changes", async () => {
        const store = createStore();
        const wrapper = mount(regionPage, {localVue, store, router});

        const steps = wrapper.findAll(stepButton);

        const buttons = wrapper.findAll("button");
        buttons.at(1).trigger("click");

        await Vue.nextTick();

        expect(steps.at(1).props("active")).toBe(true);

        await router.push({
            path: "/projects/new-project/regions/another-region"
        });
        await Vue.nextTick();
        expect(steps.at(0).props("active")).toBe(true);
    });

    it("sets current step when step is clicked", async () => {

        const store = createStore();
        const wrapper = mount(regionPage, {localVue, store, router});
        const steps = wrapper.findAll(stepButton);

        const buttons = wrapper.findAll("button");
        buttons.at(1).trigger("click");

        await Vue.nextTick();

        expect(steps.at(1).props("active")).toBe(true);
        expect(steps.at(0).props("active")).toBe(false);
        expect(wrapper.findAll(interventions).length).toBe(1);
        expect(wrapper.findAll(baseline).length).toBe(0);

        buttons.at(0).trigger("click");

        await Vue.nextTick();

        expect(steps.at(0).props("active")).toBe(true);
        expect(steps.at(1).props("active")).toBe(false);
        expect(wrapper.findAll(interventions).length).toBe(0);
        expect(wrapper.findAll(baseline).length).toBe(1);

    });

    it("sets current step to 2 when baseline is submitted", async () => {
        const store = createStore();
        const wrapper = shallowMount(regionPage, {store});

        const baselineComp = wrapper.find(baseline);
        baselineComp.vm.$emit("submit");

        await Vue.nextTick();

        const steps = wrapper.findAll(stepButton);
        expect(steps.at(1).props("active")).toBe(true);
        expect(steps.at(0).props("active")).toBe(false);
        expect(wrapper.findAll(interventions).length).toBe(1);
        expect(wrapper.findAll(baseline).length).toBe(0);
    });

});
