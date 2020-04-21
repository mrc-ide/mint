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
                                   v-model="name"
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
                                    value=""
                                    placeholder="Add a region"
                                    @tags-changed="newTags => regions = newTags"
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
        name: string
        regions: { text: string }[]
    }

    interface Methods {
        addProject: (project: Project) => void
        createProject: () => void
    }

    interface Computed {
        disabled: boolean
    }

    export default Vue.extend<Data, Methods, Computed, {}>({
        components: {VueTagsInput},
        data() {
            return {
                name: "",
                regions: []
            }
        },
        computed: {
            disabled() {
                return !this.name || this.regions.length == 0
            }
        },
        methods: {
            addProject: mapMutationByName(RootMutation.AddProject),
            createProject() {
                const project: Project = {
                    name: this.name,
                    regions: this.regions.map((tag) => ({name: tag.text}))
                }
                this.addProject(project)
            }
        }
    });
</script>
