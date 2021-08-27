<template>
  <div class="strategise container mt-5">
    <h1 class="h3 text-center">
      Strategize across regions
    </h1>
    <div class="help mt-2 text-center">
      <a href="#" @click="showDocumentation = !showDocumentation">
        <info-icon></info-icon>
        How to use this page
        <component style="vertical-align: top" :is="documentationChevronComponent"></component>
      </a>
      <b-collapse :visible="showDocumentation">
        <div class="my-2" v-html="'<p>This tool can investigate how different interventions could be ' +
        'distributed across wider regions to minimise the overall number of malaria cases whilst achieving local ' +
        'goals.</p>' +
        '<p>In some circumstances the next best option might be substantially lower cost. To investigate this the ' +
        'tool outputs not only the best option but shows which combination of interventions give slightly reduced ' +
        'budgets. The tool presents 5 potential strategies, allowing the user to determine and explore potential ' +
        'strategies for vector control across regions.</p>' +
        '<p>Please see the user manual for more information.</p>' +
        '<p><i>*IRS refers to a long-lasting non-pyrethroid IRS product (impact reflects recent Actellic 300CS and ' +
        'SumiShield products).</i></p>'"></div>
      </b-collapse>
    </div>
    <div class="form mt-5">
      <b-form inline class="justify-content-center" @submit.prevent="submit">
        <label class="mr-sm-2" for="inline-form-input-budget">Total available budget</label>
        <span class="icon-small mr-sm-3"
              v-tooltip="'The total available budget to cover the next 3-years is required to assess the most feasible intervention options across regions'">
          <help-circle-icon></help-circle-icon>
        </span>
        <b-input-group prepend="$USD" class="mb-2 mr-sm-3 mb-sm-0">
          <b-form-input id="inline-form-input-budget" :value="budget" @update="update" type="number" min="0"
                        :number="true" :required="true"></b-form-input>
        </b-input-group>
        <b-button type="submit" variant="primary">Strategize</b-button>
      </b-form>
    </div>
    <div class="results mt-5">
      <loading-spinner v-if="strategising" size="lg" class="mx-auto"></loading-spinner>
      <strategies-table v-if="strategies.length" :strategies="strategies"
                        @strategy-selected="onStrategySelected" class="summaryTable"></strategies-table>
      <b-alert :show="errors.length > 0" variant="danger" dismissible @dismissed="dismissErrors">
        <h5 class="alert-heading">Errors occurred when strategizing</h5>
        <dl v-for="(error, index) in errors" :key="index">
          <dt>{{ error.error }}</dt>
          <dd v-if="error.detail">{{ error.detail }}</dd>
        </dl>
      </b-alert>
      <div class="mt-5" v-if="strategies.length">
        <div v-if="selectedStrategy">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="text-success nav-link" :class="{active: activeTab === 'charts'}" @click="activeTab = 'charts'">Charts</a>
            </li>
            <li class="nav-item">
              <a class="text-success nav-link" :class="{active: activeTab === 'table'}" @click="activeTab = 'table'">Table</a>
            </li>
          </ul>
          <div class="tab-content">
            <strategy-charts v-if="activeTab === 'charts'" :strategy="selectedStrategy"></strategy-charts>
            <strategy-table v-if="activeTab === 'table'" :strategy="selectedStrategy"
                            class="detailsTable"></strategy-table>
          </div>
        </div>
        <h2 v-else class="h4 text-center">Select a row in the table above to see details of the selected strategy</h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {mapActions, mapState} from "vuex";
import {Project, StrategyWithThreshold} from "../models/project";
import {RootAction} from "../actions";
import {VTooltip} from "v-tooltip";
import {ChevronDownIcon, ChevronUpIcon, HelpCircleIcon, InfoIcon} from "vue-feather-icons";
import loadingSpinner from "./loadingSpinner.vue";
import strategiesTable from "./figures/strategise/strategiesTable.vue";
import strategyTable from "./figures/strategise/strategyTable.vue";
import {BAlert, BButton, BCollapse, BForm, BFormInput, BInputGroup} from "bootstrap-vue";
import {APIError} from "../apiService";
import strategyCharts from "./figures/strategise/strategyCharts.vue";

interface Data {
  strategising: boolean
  showDocumentation: boolean
  budget: number
  selectedStrategy: StrategyWithThreshold | null
  activeTab: "charts" | "table"
}

interface Methods {
  setBudget: (payload: { budget: number }) => void
  strategise: () => void
  update: (budget: number) => void
  submit: () => void
  dismissErrors: () => void
  onStrategySelected: (strategy: StrategyWithThreshold) => void
}

interface Computed {
  currentProject: Project
  errors: APIError[]
  strategies: StrategyWithThreshold[]
  documentationChevronComponent: string
}

export default Vue.extend<Data, Methods, Computed>({
  components: {
    strategyCharts,
    strategiesTable,
    strategyTable,
    HelpCircleIcon,
    loadingSpinner,
    BForm,
    BFormInput,
    BInputGroup,
    BButton,
    BAlert,
    BCollapse,
    InfoIcon,
    ChevronDownIcon,
    ChevronUpIcon
  },
  directives: {
    tooltip: VTooltip
  },
  data() {
    return {
      strategising: false,
      showDocumentation: false,
      budget: this.$store.state.currentProject.budget,
      selectedStrategy: null,
      activeTab: "charts"
    }
  },
  computed: {
    ...mapState(["currentProject", "errors"]),
    strategies() {
      return this.currentProject ? this.currentProject.strategies : [];
    },
    documentationChevronComponent() {
      return this.showDocumentation ? "chevron-up-icon" : "chevron-down-icon";
    }
  },
  methods: {
    ...mapActions({
      setBudget: RootAction.SetBudget,
      strategise: RootAction.Strategise,
      dismissErrors: RootAction.DismissErrors
    }),
    update: function (budget: number) {
      this.setBudget({budget});
    },
    submit: async function () {
      this.selectedStrategy = null;
      this.strategising = true;
      await this.strategise();
      this.strategising = false;
    },
    onStrategySelected(strategy) {
      this.selectedStrategy = strategy;
    }
  }
});
</script>
