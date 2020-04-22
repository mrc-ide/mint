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
                        <div class="dropdown-item" v-for="region in regions">
                            <router-link :to="region.url" class="text-success">{{region.name}}</router-link>
                        </div>
                    </drop-down>
                </div>
                <a href="#" class="px-2 full-height text-dark project-nav">Strategize across regions
                    <b-icon-graph-up></b-icon-graph-up>
                </a>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>
<script lang="ts">
    import Vue from "vue"
    import {mapState} from "vuex";
    import dropDown from "./dropDown.vue";
    import {BIconGraphUp} from "bootstrap-vue";
    import {Region} from "../store";

    export default Vue.extend({
        components: {dropDown, BIconGraphUp},
        computed: {
            ...mapState(["currentProject"]),
            regions() {
                return this.currentProject.regions.map((r: Region) => {
                    return {url: `/projects/${this.currentProject.name}/regions/${r.name}`, name: r.name}
                })
            }
        }
    })
</script>
