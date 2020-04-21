<template>
    <div>
        <div class="navbar navbar-primary navbar-default">
            <div class="container-fluid">
                <div class="bg-secondary text-light font-weight-bold navbar-header">MINT</div>
            </div>
        </div>
        <div class="navbar navbar-secondary" v-if="currentProject">
            <div class="container-fluid">
                <div class="navbar-header" style="display: flex; margin-left:-1rem; background:rgba(170, 240, 174, .5)">
                    <span>{{currentProject.name}}:</span>
                    <drop-down :text="currentRegion.name" parent-class="px-2" toggle-class="text-dark">
                        <div class="dropdown-item" v-for="region in currentProject.regions">
                            <a href="#" class="text-success">{{region.name}}</a>
                        </div>
                    </drop-down>
                </div>
                <a href="#" class="px-2 full-height text-dark project-nav">Strategize across regions
                    <svg height="20" class="octicon octicon-graph" viewBox="0 0 16 16" version="1.1" width="20"
                         style="margin-left:2px; margin-top: -2px"
                         aria-hidden="true">
                        <path fill-rule="evenodd" fill="currentColor"
                              d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z"></path>
                    </svg>
                </a>
            </div>
        </div>

        <div class="container pt-5">
            <a href="#" @click="createProject">Create fake current project to see project navbar</a>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from "vue"
    import {mapState} from "vuex";
    import dropDown from "./dropDown.vue";

    export default Vue.extend({
        components: {dropDown},
        computed: mapState(["currentProject", "currentRegion"]),
        methods: {
            createProject() {
                this.$store.state.currentProject = {name: "Zimbabwe", regions: [{name: "Central"}, {name: "North"}]}
                this.$store.state.currentRegion = {name: "Central"}
            }
        }
    })

</script>
