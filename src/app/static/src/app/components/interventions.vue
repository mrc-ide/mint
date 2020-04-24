<template>
    <vertical-tabs :tabs="tabs" @tab-selected="changeTab"></vertical-tabs>
</template>
<script lang="ts">
    import Vue from "vue";
    import verticalTabs from "./verticalTabs.vue";
    import {Tab} from "../types";

    interface Data {
        tabs: Tab[]
    }

    interface Methods {
        changeTab: (name: string) => void
    }

    export default Vue.extend<Data, Methods, {}, {}>({
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
