<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-lg-6 offset-lg-3 col-10 offset-1">
                <h1 class="h3">{{ welcomeText }}</h1>
                <div v-if="projects.length > 0">
                    <ul class="list-unstyled lead">
                        <li v-for="project in projects">
                            <drop-down :text="project.name">
                                <a class="dropdown-item"
                                   v-for="region in project.regions"
                                   href="#"
                                   @click="(event) => navigate(event, project, region)">
                                    {{ region.name }}
                                </a>
                            </drop-down>
                        </li>
                        <li><a href="#" @click="startNewProject">+ Start new project</a></li>
                    </ul>
                </div>
                <div v-if="showNewProject || projects.length === 0">
                    <div class="card p-3">
                        <div class="form-group row">
                            <label for="name" class="col-sm-3 col-form-label text-right">Name</label>
                            <div class="col-sm-9">
                                <input type="text"
                                       v-model="newProject"
                                       class="form-control"
                                       id="name"
                                       placeholder="Project name">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label text-right">Regions</label>
                            <div class="col-sm-9">
                                <vue-tags-input
                                    :tags="regions"
                                    v-model="newRegion"
                                    :add-on-key="[13, ',']"
                                    :placeholder="placeholder"
                                    @tags-changed="tagAdded"
                                />
                                <span class="text-muted small">You can always add and remove regions later</span>
                            </div>
                        </div>
                        <div class="form-group text-center">
                            <button class="btn btn-primary"
                                    :class="{'disabled': disabled}"
                                    :disabled="disabled"
                                    @click="createProject">Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import VueTagsInput from '@johmun/vue-tags-input';
    import {RootMutation} from "../mutations";
    import {mapMutationByName} from "../utils";
    import {Project, Region} from "../models/project";
    import {mapState} from "vuex";
    import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
    import dropDown from "./dropDown.vue";

    interface Data {
        newProject: string
        regions: Tag[]
        newRegion: string
        showNewProject: boolean
    }

    interface Methods {
        startNewProject: () => void
        setCurrentProject: (project: Project | null) => void
        addProject: (project: Project) => void
        createProject: () => void
        tagAdded: (newTags: Tag[]) => void
        navigate: (event: Event, project: Project, region: Region) => void
    }

    interface Computed {
        welcomeText: string
        projects: Project[]
        disabled: boolean
        placeholder: string
        baselineOptions: DynamicFormMeta
        interventionOptions: DynamicFormMeta
    }

    interface Tag {
        text: string
    }

    export default Vue.extend<Data, Methods, Computed, {}>({
        components: {VueTagsInput, dropDown},
        data() {
            return {
                newProject: "",
                regions: [],
                newRegion: "",
                showNewProject: false
            }
        },
        computed: {
            ...mapState(["projects", "baselineOptions", "interventionOptions"]),
            welcomeText() {
                const len = this.projects.length;
                if (len === 0) {
                    return "Create a project to get started";
                }
                return `You have ${len} project${len === 1 ? "" : "s"}`
            },
            disabled() {
                return !this.newProject || (!this.newRegion && this.regions.length == 0)
            },
            placeholder() {
                return this.regions.length == 0 ? "First region, second region" : "...";
            },
        },
        methods: {
            setCurrentProject: mapMutationByName(RootMutation.SetCurrentProject),
            addProject: mapMutationByName(RootMutation.AddProject),
            startNewProject() {
                this.showNewProject = true;
            },
            createProject() {
                const regionNames = this.regions.map((tag) => tag.text);
                if (regionNames.length == 0) {
                    // user has only entered one region name and has not blurred the input
                    // so this.regions is empty even though this.newRegion is populated
                    // so take this.newRegion as the only region
                    regionNames.push(this.newRegion)
                }
                const project = new Project(this.newProject, regionNames, this.baselineOptions, this.interventionOptions);
                this.addProject(project);
                this.$router.push({
                    path: project.currentRegion.url
                })
            },
            tagAdded(newTags: Tag[]) {
                this.regions = newTags;
                this.newRegion = "";
            },
            navigate(event: Event, project: Project, region: Region) {
                event.preventDefault();
                this.setCurrentProject(project);
                this.$router.push({
                    path: region.url
                })
            }
        },
        mounted() {
            this.setCurrentProject(null);
        }
    });
</script>
