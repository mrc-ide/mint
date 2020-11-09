<template>
    <div>
        <div class="navbar navbar-primary navbar-default">
            <div class="container-fluid">
                <div class="bg-secondary text-light font-weight-bold navbar-header">MINT</div>
            </div>
        </div>
        <div class="navbar navbar-secondary" v-if="currentProject">
            <div class="container-fluid">
                <div class="navbar-header project-header">
                    <span>{{ currentProject.name }}:</span>
                    <drop-down :text="currentProject.currentRegion.name" parent-class="px-2" toggle-class="text-dark">
                        <div class="dropdown-item" v-for="region in currentProject.regions">
                            <router-link :to="region.url" class="text-success">{{ region.name }}</router-link>
                        </div>
                        <div class="dropdown-item">
                            <a v-b-modal.add-region>+ Add region</a>
                        </div>
                    </drop-down>
                </div>
                <a href="#" class="px-2 full-height text-dark project-nav"
                id="stratAcrossRegions"
                v-if="stratAcrossRegionsIsEnabled">Strategize across regions
                    <b-icon-graph-up></b-icon-graph-up>
                </a>
            </div>
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
    import {BIconGraphUp, BModal, VBModal} from "bootstrap-vue";
    import {RootAction} from "../actions";
    import {mapActionByName, mapMutationByName} from "../utils";
    import {store} from "../store";
    import {getSlug, Project, Region} from "../models/project";
    import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
    import {RootMutation} from "../mutations";
    import {switches} from "../featureSwitches";

    interface Methods {
        fetchConfig: () => void
        addRegion: (region: Region) => void,
        createNewRegion: () => void
        cancel: () => void
    }

    interface Data {
        newRegionName: string;
        stratAcrossRegionsIsEnabled: boolean;
    }

    interface Computed {
        currentProject: Project
        baselineOptions: DynamicFormMeta
        interventionOptions: DynamicFormMeta
        validNewRegion: boolean
    }

    export default Vue.extend<Data, Methods, Computed, {}>({
        store,
        data() {
            return {
                newRegionName: "",
                stratAcrossRegionsIsEnabled: switches.stratAcrossRegions,
            }
        },
        components: {dropDown, BIconGraphUp, BModal},
        directives: {"BModal": VBModal},
        computed: {
            ...mapState(["currentProject", "baselineOptions", "interventionOptions"]),
            validNewRegion() {
                if (this.newRegionName.trim().length == 0) {
                    return false;
                }

                // because of how urls are normalized, "My region" and "my-region"
                // also represent a naming clash, so compare slugs rather than names
                const newRegionSlug = getSlug(this.newRegionName);
                return !this.currentProject.regions.find(r => r.slug == newRegionSlug);
            }
        },
        methods: {
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
            fetchConfig: mapActionByName(RootAction.FetchConfig)
        },
        beforeMount: function () {
            this.fetchConfig();
        }
    })
</script>
