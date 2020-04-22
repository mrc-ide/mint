<template>
    <div class="container mt-5">
        <h1 class="h3 text-center">Create a project to get started</h1>
        <div class="row">
            <div class="col-lg-6 offset-lg-3 col-10 offset-1">
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
                                    :add-on-key="[13, ',', 32]"
                                    placeholder="First region, Second region"
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
    import {Project} from "../models/project";

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
                return !this.newProject || (!this.newRegion && this.regions.length == 0)
            }
        },
        methods: {
            addProject: mapMutationByName(RootMutation.AddProject),
            createProject() {
                const regionNames = this.regions.map((tag) => tag.text);
                if (regionNames.length == 0){
                    // user has only entered one region name and has not blurred the input
                    // so this.regions is empty even though this.newRegion is populated
                    // so take this.newRegion as the only region
                    regionNames.push(this.newRegion)
                }
                const project = new Project(this.newProject, regionNames);
                this.addProject(project);
                this.$router.push({
                    path: project.currentRegion.url
                })
            },
            tagAdded: function (newTags: Tag[]) {
                this.regions = newTags;
                this.newRegion = "";
            }
        }
    });
</script>
