<template>
    <div>
        <div class="navbar navbar-secondary navbar-expand">
            <a class="navbar-brand bg-secondary text-white font-weight-bold full-height" href="/">MINT</a>
            <ul class="navbar-nav mr-auto" v-if="currentProject">
                <li class="project-header full-height">
                    <span>{{ currentProject.name }}:</span>
                    <drop-down :text="currentProject.currentRegion.name" parent-class="px-2" toggle-class="text-dark">
                        <div class="dropdown-item" v-for="region in currentProject.regions" :key="region.url">
                            <router-link :to="region.url" class="text-success">{{ region.name }}</router-link>
                        </div>
                        <div v-if="currentProject.regions.length < maxRegions" class="dropdown-item">
                            <a v-b-modal.add-region>+ Add region</a>
                        </div>
                    </drop-down>
                </li>
                <li class="full-height">
                    <router-link to="/strategise" class="px-2 text-dark project-nav" id="stratAcrossRegions"
                                 v-if="stratAcrossRegionsIsEnabled">
                        Strategize across regions
                        <b-icon-graph-up></b-icon-graph-up>
                    </router-link>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto mr-3">
                <template v-if="currentProject">
                    <template v-if="emulatorOptions">
                        <li v-if="emulatorOptions">
                            <b-form-select v-model="selectedEmulator" @change="updateSelectedEmulator" :options="emulatorOptions"></b-form-select>
                        </li>
                        <li>
                            <span class="mx-2">|</span>
                        </li>
                    </template>
                    <li v-if="currentProject" class="nav-item">
                        <user-guide-links :short="true"/>
                    </li>
                </template>
                <template v-else>
                    <li class="nav-item">
                        <router-link class="text-dark" to="/accessibility">Accessibility</router-link>
                    </li>
                    <li>
                        <span class="mx-2">|</span>
                    </li>
                    <li class="nav-item">
                        <router-link class="text-dark" to="/privacy">Privacy</router-link>
                    </li>
                </template>
                <li>
                    <span class="mx-2">|</span>
                </li>
                <li id="version-nav-item" class="nav-item">
                    <version-drop-down />
                </li>
            </ul>
        </div>
        <router-view></router-view>
        <b-modal id="add-region"
                 @ok="createNewRegion"
                 @cancel="cancel"
                 title="Add region"
                 :ok-disabled="!validNewRegion">
            <div class="form-group">
                <form class="form-inline">
                    <div class="form-group">
                        <label for="region">Region name:</label>
                        <input type="text"
                               id="region"
                               class="form-control mx-sm-3"
                               v-model="newRegionName">
                    </div>
                    <div class="text-danger small" v-show="this.newRegionName && !validNewRegion">
                        Region names must be unique
                    </div>
                </form>
            </div>
        </b-modal>
    </div>
</template>
<script lang="ts">
    import Vue from "vue"
    import {mapState} from "vuex";
    import dropDown from "./dropDown.vue";
    import {BIconGraphUp, BModal, VBModal, BFormSelect} from "bootstrap-vue";
    import {RootAction} from "../actions";
    import {mapActionByName, mapMutationByName} from "../utils";
    import {store} from "../store";
    import {getSlug, Project, Region} from "../models/project";
    import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
    import {RootMutation} from "../mutations";
    import {switches} from "../featureSwitches";
    import userGuideLinks from "./userGuideLinks.vue";
    import {MAX_REGIONS} from "../index";
    import VersionDropDown from "./versionDropDown.vue";
    import {EmulatorConfig} from "../emulator";

    interface Methods {
        fetchVersion: () => void
        fetchDocs: () => void
        fetchBaselineOptions: () => void
        fetchInterventionOptions: () => void
        addRegion: (region: Region) => void
        createNewRegion: () => void
        cancel: () => void
        updateSelectedEmulator: (value: number | null) => void
    }

    interface Data {
        newRegionName: string
        selectedEmulator: number | null
    }

    interface Computed {
        stratAcrossRegionsIsEnabled: boolean
        currentProject: Project
        baselineOptions: DynamicFormMeta
        interventionOptions: DynamicFormMeta
        validNewRegion: boolean
        emulatorConfig: EmulatorConfig
        emulatorOptions: any
    }

    export default Vue.extend<Data, Methods, Computed, Record<string, never>>({
        store,
        data() {
            return {
                newRegionName: "",
                maxRegions: MAX_REGIONS,
                selectedEmulator: null,
            }
        },
        components: {VersionDropDown, dropDown, BIconGraphUp, BModal, BFormSelect, userGuideLinks},
        directives: {"BModal": VBModal},
        computed: {
            ...mapState(["currentProject", "baselineOptions", "interventionOptions", "emulatorConfig"]),
            validNewRegion() {
                if (this.newRegionName.trim().length == 0) {
                    return false;
                }

                // because of how urls are normalized, "My region" and "my-region"
                // also represent a naming clash, so compare slugs rather than names
                const newRegionSlug = getSlug(this.newRegionName);
                return !this.currentProject.regions.find(r => r.slug == newRegionSlug);
            },
            stratAcrossRegionsIsEnabled() {
                return switches.stratAcrossRegions &&
                    // Exclude regions that aren't fully initialised
                    this.currentProject.regions.filter(region => region.interventionSettings.budgetAllZones).length > 1;
            },
            emulatorOptions() {
                if (this.emulatorConfig && this.emulatorConfig.models.length > 0) {
                    var options: any = [ { value: null, text: "Pre-calculated" } ];
                    for (let i = 0; i < this.emulatorConfig.models.length; i++) {
                        options.push({ value: i, text: this.emulatorConfig.models[i].name });
                    }
                    return options;
                } else {
                    // Dropdown is hidden and only pre-calculated data gets used.
                    return null;
                }
            }
        },
        methods: {
            updateSelectedEmulator: function(value: number | null) {
                this.$store.commit(RootMutation.SetSelectedEmulatorModel, value);
                this.$store.dispatch(RootAction.UpdatePrevalenceGraphData);
            },
            addRegion: mapMutationByName(RootMutation.AddRegion),
            createNewRegion() {
                const region = new Region(
                    this.newRegionName,
                    this.currentProject,
                    this.baselineOptions,
                    this.interventionOptions);
                this.addRegion(region);
                this.newRegionName = "";
                this.$router.push({
                    path: region.url
                });
            },
            cancel() {
                this.newRegionName = "";
            },
            fetchVersion: mapActionByName(RootAction.FetchVersion),
            fetchDocs: mapActionByName(RootAction.FetchDocs),
            fetchBaselineOptions: mapActionByName(RootAction.FetchBaselineOptions),
            fetchInterventionOptions: mapActionByName(RootAction.FetchInterventionOptions)
        },
        beforeMount: function () {
            this.fetchVersion();
            this.fetchDocs();
            this.fetchBaselineOptions();
            this.fetchInterventionOptions();
        }
    })
</script>
