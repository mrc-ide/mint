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
                    <span>{{currentProject.name}}:</span>
                    <drop-down :text="currentProject.currentRegion.name" parent-class="px-2" toggle-class="text-dark">
                        <div class="dropdown-item" v-for="region in currentProject.regions">
                            <a href="#" class="text-success">{{region.name}}</a>
                        </div>
                    </drop-down>
                </div>
                <a href="#" class="px-2 full-height text-dark project-nav">Strategize across regions
                    <b-icon-graph-up></b-icon-graph-up>
                </a>
            </div>
        </div>

        <div class="container pt-5">
            <button class="btn btn-primary" @click="createProject">
                Create fake current project to see project navbar
            </button>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from "vue"
    import {mapState} from "vuex";
    import dropDown from "./dropDown.vue";
    import {BIconGraphUp} from "bootstrap-vue";

    export default Vue.extend({
        components: {dropDown, BIconGraphUp},
        computed: mapState(["currentProject"]),
        methods: {
            createProject() {
                const newRegion = {name: "Central"}
                this.$store.state.currentProject = {name: "Zimbabwe",
                    regions: [newRegion, {name: "North"}], currentRegion: newRegion}
            }
        }
    })

</script>
