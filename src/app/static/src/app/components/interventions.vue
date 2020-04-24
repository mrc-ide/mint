<template>
    <vertical-tabs :tabs="tabs" @tab-selected="changeTab"></vertical-tabs>
</template>
<script lang="ts">
    import Vue from "vue";
    import verticalTabs from "./verticalTabs.vue";

    export default Vue.extend({
        data() {
            return {
                tabs: [{name: "Table", active: false}, {name: "Graphs", active: true}]
            }
        },
        methods: {
            changeTab(name: string) {
                this.tabs = this.tabs.map(t => ({...t, active: false}))
                this.tabs.find(t => t.name == name)!!.active = true;
            }
        },
        components: {verticalTabs}
    });

</script>
