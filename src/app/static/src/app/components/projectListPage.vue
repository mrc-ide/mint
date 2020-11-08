<template>
     <div class="container mt-5">
        <div class="row">
            <div class="col-lg-6 offset-lg-3 col-10 offset-1">
                <h1 class="h3">{{ welcomeText }}</h1>
                <div v-if="projects.length > 0">
                    <ul class="list-group list-unstyled lead">
                        <li v-for="(project, index) in projects" :key="index"
                        class="list-group-item d-flex justify-content-between align-items-center">
                           <drop-down :text="project.name">
                               <a class="dropdown-item"
                                v-for="(region, index) in project.regions" :key="index"
                                href="#"
                                @click="(event) => navigate(event, project, region)">
                                {{ region.name }}
                                </a>
                            </drop-down>
                            <span class="badge badge-pill badge-delete" 
                            v-on:click="deleteProject(project)">x
                            </span>
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
                                    :is-duplicate="isDuplicate"
                                    :avoid-adding-duplicates="true"
                                    @adding-duplicate="addingDuplicate"
                                    @keydown.native="resetValidation"/>
                                <div class="text-danger small" v-show="invalidTag">Region names must be unique</div>
                                <div class="text-muted small">
                                    Add multiple region names separated by commas.
                                    You can always add and remove regions later
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
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import VueTagsInput from '@johmun/vue-tags-input';
    import {RootMutation} from "../mutations";
    import {mapMutationByName} from "../utils";
    import {getSlug, Project, Region} from "../models/project";

    import {mapState} from "vuex";
    import {DynamicFormMeta} from "@reside-ic/vue-dynamic-form";
    import dropDown from "./dropDown.vue";

    interface Data {
        newProject: string
        regions: Tag[]
        newRegion: string
        showNewProject: boolean
        invalidTag: boolean
    }

    interface Methods {
        startNewProject: (event: Event) => void
        setCurrentProject: (project: Project | null) => void
        addProject: (project: Project) => void
        createProject: () => void
        tagAdded: (newTags: Tag[]) => void
        isDuplicate: (tags: Tag[], tag: Tag) => boolean
        addingDuplicate: () => void
        navigate: (event: Event, project: Project, region: Region) => void
        resetValidation: (event: KeyboardEvent) => void
        deleteProject: (project: Project) => void
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
                showNewProject: false,
                invalidTag: false
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
                return !this.newProject || (!this.newRegion && this.regions.length == 0) || this.invalidTag
            },
            placeholder() {
                return this.regions.length == 0 ? "First region, second region" : "...";
            },
        },
        methods: {
            setCurrentProject: mapMutationByName(RootMutation.SetCurrentProject),
            addProject: mapMutationByName(RootMutation.AddProject),
            startNewProject(event: Event) {
                event.preventDefault();
                this.showNewProject = true;
            },
            createProject() {
                const regionNames = this.regions.map((tag) => tag.text.trim());
                const newRegion = this.newRegion.trim();
                if (newRegion.length > 0) {
                    // user has entered a region name but not blurred the input
                    // so manually validate their last typed region and add to list
                    const valid = !regionNames.find(t => getSlug(t) == getSlug(newRegion));
                    if (valid) {
                        regionNames.push(newRegion);
                    }
                    else {
                        this.invalidTag = true
                    }
                }
                if (!this.invalidTag) {
                    const project = new Project(this.newProject, regionNames, this.baselineOptions, this.interventionOptions);
                    this.addProject(project);
                    this.$router.push({
                        path: project.currentRegion.url
                    });
                }
            },
            tagAdded(newTags: Tag[]) {
                this.regions = newTags;
                this.newRegion = "";
                this.invalidTag = false;
            },
            addingDuplicate() {
                this.invalidTag = true;
            },
            isDuplicate(tags: Tag[], tag: Tag) {
                return !!tags.find(t => getSlug(t.text.trim()) == getSlug(tag.text.trim()));
            },
            resetValidation(event: KeyboardEvent) {
                if ([",", "Enter"].indexOf(event.key) == -1) {
                    this.invalidTag = false;
                }
            },
            navigate(event: Event, project: Project, region: Region) {
                event.preventDefault();
                this.setCurrentProject(project);
                this.$router.push({
                    path: region.url
                })
            }, 
            deleteProject : mapMutationByName(RootMutation.DeleteProject)
        },
        mounted() {
            this.setCurrentProject(null);
        }
    });
</script>
