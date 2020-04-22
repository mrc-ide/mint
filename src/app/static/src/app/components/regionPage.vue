<template>
    <div class="container mt-5">
        <h1 class="h3 text-center">Region page for {{ $route.params.region }}</h1>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {RootMutation} from "../mutations";
    import {mapMutationByName} from "../utils";
    export default Vue.extend({
        methods: {
            setCurrentRegion: mapMutationByName(RootMutation.SetCurrentRegion)
        },
        watch: {
            $route(to) {
                this.setCurrentRegion(to.path);
            }
        }
    });
</script>
