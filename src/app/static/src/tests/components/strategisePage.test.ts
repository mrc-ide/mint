import {mount} from "@vue/test-utils";
import StrategisePage from "../../app/components/strategisePage.vue";
import Vuex from "vuex";
import {RootAction} from "../../app/actions";
import loadingSpinner from "../../app/components/loadingSpinner.vue";
import {BAlert} from "bootstrap-vue";
import {mockError, mockProject, mockRootState} from "../mocks";
import {APIError} from "../../app/apiService";
import strategiesTable from "../../app/components/figures/strategise/strategiesTable.vue";
import Vue from "vue";

describe("strategise page", () => {

    const createStore = (
        mockSetBudgetAction = jest.fn(),
        mockStrategiseAction = jest.fn(),
        errors: APIError[] = []
    ) => {
        return new Vuex.Store({
            state: mockRootState({
                currentProject: mockProject(),
                errors
            }),
            actions: {
                [RootAction.SetBudget]: mockSetBudgetAction,
                [RootAction.Strategise]: mockStrategiseAction,
            }
        });
    };

    it("populates budget input from project settings", () => {
        const store = createStore();
        const wrapper = mount(StrategisePage, {store});
        const input = wrapper.find("input").element as HTMLInputElement;
        expect(input.value).toBe("10000");
    });

    it("propagates budget change to project settings", async () => {
        const mockSetBudgetAction = jest.fn();
        const store = createStore(mockSetBudgetAction);
        const wrapper = mount(StrategisePage, {store});
        expect(store.state.currentProject!.budget).toBe(10000);
        wrapper.find("input").setValue("20000");
        expect(mockSetBudgetAction.mock.calls.length).toBe(1);
        expect(mockSetBudgetAction.mock.calls[0][1]).toEqual({budget: 20000});
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

    it("displays table", async () => {
        const store = createStore();
        const wrapper = mount(StrategisePage, {store});
        expect(wrapper.find(strategiesTable).exists()).toBe(false);
        store.state.currentProject!.strategies = [
            {
                costThreshold: 1,
                strategy: {
                    casesAverted: 100,
                    cost: 1000,
                    interventions: [
                        {zone: "Region A", intervention: "irs-llin-pbo"},
                        {zone: "Region B", intervention: "irs-llin"}
                    ]
                }
            }
        ];
        await Vue.nextTick();
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

});
