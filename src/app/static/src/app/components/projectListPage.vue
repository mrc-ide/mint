<template>
    <div class="container mt-5">
        <h1 class="h3 text-center">Create a project to get started</h1>
        <div class="row">
            <div class="col-6 offset-3">
                <div class="card p-3">
                    <div class="form-group row">
                        <label for="name" class="col-sm-2 col-form-label text-right">Name</label>
                        <div class="col-sm-10">
                            <input type="text"
                                   v-model="newProject"
                                   class="form-control"
                                   id="name"
                                   placeholder="Project name">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label text-right">Regions</label>
                        <div class="col-sm-10">
                            <vue-tags-input
                                    :tags="regions"
                                    v-model="newRegion"
                                    placeholder="Add a region"
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
</template>

<script lang="ts">
    import Vue from "vue"
    import VueTagsInput from '@johmun/vue-tags-input';
    import {RootMutation} from "../mutations";
    import {mapMutationByName} from "../utils";
    import {Project} from "../store";

    interface Data {
        newProject: string
        regions: Tag[]
        newRegion: string
    }

    interface Methods {
        addProject: (project: Project) => void
        createProject: () => void
        tagAdded: (newTags: Tag[]) => void
    }

    interface Computed {
        disabled: boolean
    }

    interface Tag {
        text: string
    }

    export default Vue.extend<Data, Methods, Computed, {}>({
        components: {VueTagsInput},
        data() {
            return {
                newProject: "",
                regions: [],
                newRegion: ""
            }
        },
        computed: {
            disabled() {
                return !this.newProject || this.regions.length == 0
            }
        },
        methods: {
            addProject: mapMutationByName(RootMutation.AddProject),
            createProject() {
                const regions = this.regions.map((tag) => ({name: tag.text}));
                const project: Project = {
                    name: this.newProject,
                    regions: regions,
                    currentRegion: regions[0]
                }
                this.addProject(project);
                this.$router.push({
                    path: `/projects/${this.newProject}/regions/${regions[0].name}`.replace(/\s/g, "-").toLowerCase()
                })
            },
            tagAdded: function (newTags: Tag[]) {
                this.regions = newTags;
                this.newRegion = "";
            }
        }
    });
</script>
