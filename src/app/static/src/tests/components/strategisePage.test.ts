import {mount, shallowMount} from "@vue/test-utils";
import StrategisePage from "../../app/components/strategisePage.vue";
import Vuex from "vuex";
import {RootAction} from "../../app/actions";
import loadingSpinner from "../../app/components/loadingSpinner.vue";
import {BAlert} from "bootstrap-vue";
import {mockError, mockProject, mockRootState} from "../mocks";
import {APIError} from "../../app/apiService";
import strategiesTable from "../../app/components/figures/strategise/strategiesTable.vue";
import Vue from "vue";
import strategyCharts from "../../app/components/figures/strategise/strategyCharts.vue";
import strategyTable from "../../app/components/figures/strategise/strategyTable.vue";
import {RootMutation} from "../../app/mutations";

describe("strategise page", () => {

    const createStore = (
        mockSetBudgetMutation = jest.fn(),
        mockStrategiseAction = jest.fn(),
        errors: APIError[] = []
    ) => {
        return new Vuex.Store({
            state: mockRootState({
                currentProject: mockProject(),
                errors
            }),
            actions: {
                [RootAction.Strategise]: mockStrategiseAction
            },
            mutations: {
                [RootMutation.SetBudget]: mockSetBudgetMutation
            }
        });
    };

    it("populates budget input from project settings", () => {
        const store = createStore();
        const wrapper = mount(StrategisePage, {store});
        const input = wrapper.find("input").element as HTMLInputElement;
        expect(input.value).toBe("10000");
        expect(input.getAttribute("step")).toBe("1000");
    });

    it("propagates budget change to project settings", async () => {
        const mockSetBudgetMutation = jest.fn();
        const store = createStore(mockSetBudgetMutation);
        const wrapper = mount(StrategisePage, {store});
        expect(store.state.currentProject!.budget).toBe(10000);
        wrapper.find("input").setValue("20000");
        expect(mockSetBudgetMutation.mock.calls.length).toBe(1);
        expect(mockSetBudgetMutation.mock.calls[0][1]).toEqual(20000);
    });

    it("triggers action and sets strategising flag when form submitted", () => {
        const mockStrategiseAction = jest.fn();
        const store = createStore(jest.fn(), mockStrategiseAction);
        const wrapper = mount(StrategisePage, {store});
        wrapper.find("form").trigger("submit");
        expect(wrapper.vm.$data.strategising).toBe(true);
        expect(mockStrategiseAction.mock.calls.length).toBe(1);
    });

    it("displays spinner while strategising", async () => {
        const store = createStore();
        const wrapper = mount(StrategisePage, {
            store,
            data() {
                return {
                    strategising: true
                };
            }
        });
        expect(wrapper.find(loadingSpinner).exists()).toBe(true);
        await wrapper.setData({strategising: false});
        expect(wrapper.find(loadingSpinner).exists()).toBe(false);
    });

    it("resets selected strategy when re-strategising", () => {
        const mockStrategiseAction = jest.fn();
        const store = createStore(jest.fn(), mockStrategiseAction);
        const wrapper = mount(StrategisePage, {
            store,
            data() {
                return {
                    selectedStrategy: {}
                };
            }
        });
        wrapper.find("form").trigger("submit");
        expect(wrapper.vm.$data.strategising).toBe(true);
        expect(mockStrategiseAction.mock.calls.length).toBe(1);
        expect(wrapper.vm.$data.selectedStrategy).toBeNull();
    });

    it("displays table with heading", async () => {
        const store = createStore();
        const wrapper = mount(StrategisePage, {store});
        expect(wrapper.find(strategiesTable).exists()).toBe(false);
        store.state.currentProject!.strategies = [
            {
                costThreshold: 1,
                interventions: [
                    {zone: "Region A", intervention: "irs-llin-pbo", casesAverted: 60, cost: 600},
                    {zone: "Region B", intervention: "irs-llin", casesAverted: 40, cost: 400}
                ]
            }
        ];
        await Vue.nextTick();
        expect(wrapper.find("h2").text()).toBe("All strategies");
        expect(wrapper.find(strategiesTable).exists()).toBe(true);
    });

    it("displays errors", () => {
        const store = createStore(jest.fn(), jest.fn(), [mockError("DETAIL")]);
        const wrapper = mount(StrategisePage, {store});
        const alert = wrapper.find(BAlert);
        expect(alert.exists()).toBe(true);
        expect(alert.findAll("dl").length).toBe(1);
        expect(alert.find("dl dt").text()).toBe("OTHER_ERROR");
        expect(alert.find("dl dd").text()).toBe("DETAIL");
    });

    it("handles strategy selection", async () => {
        const strategy = {
            costThreshold: 1,
            interventions: [
                {zone: "Region A", intervention: "irs-llin-pbo", casesAverted: 60, cost: 600},
                {zone: "Region B", intervention: "irs-llin", casesAverted: 40, cost: 400}
            ]
        };
        const store = createStore();
        store.state.currentProject!.strategies = [strategy];
        const wrapper = shallowMount(StrategisePage, {store});

        await Vue.nextTick();

        expect(wrapper.findAll("h2").at(1).text()).toContain("Select a row");

        wrapper.find(strategiesTable).vm.$emit("strategy-selected", strategy);
        expect(wrapper.vm.$data.selectedStrategy).toBe(strategy);

        await Vue.nextTick();

        expect(wrapper.findAll("h2").at(1).text()).toBe("Details for Strategy 1");
        expect(wrapper.find(strategyCharts).isVisible()).toBe(true);
        expect(wrapper.find(strategyTable).exists()).toBe(false);

        expect(wrapper.findAll(".nav-tabs a.active").length).toBe(1);

        await wrapper.findAll(".nav-tabs a").at(1).trigger("click");

        expect(wrapper.find(strategyCharts).exists()).toBe(false);
        expect(wrapper.find(strategyTable).isVisible()).toBe(true);
    });

});
