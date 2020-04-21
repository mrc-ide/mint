<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <a href="#">+ Start project</a>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="card p-3">
                    <div class="form-group row">
                        <label for="name" class="col-sm-2 col-form-label">Name</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="name" class="form-control" id="name" placeholder="Project name">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="regions" class="col-sm-2 col-form-label">Regions</label>
                        <div class="col-sm-10">
                            <input type="text" v-model="regions" class="form-control" id="regions"
                                   placeholder="region1, region2, region3">
                        </div>
                    </div>
                    <div class="form-group text-center">
                        <button class="btn btn-primary" @click="createProject">Create</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import {RootMutation} from "../mutations";
    import {mapMutationByName} from "../utils";
    import {Project} from "../store";

    export default Vue.extend({
        data() {
            return {
                name: "",
                regions: [] as string[]
            }
        },
        methods: {
            addProject: mapMutationByName(RootMutation.AddProject),
            createProject() {
                const project: Project = {
                    name: this.name,
                    regions: this.regions.map((regionName) => ({name: regionName}))
                }
                this.addProject(project)
            }
        }
    });
</script>
