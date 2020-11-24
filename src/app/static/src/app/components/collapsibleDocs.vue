<template>
    <div>
        <a href="#" @click="toggle" class="mt-2">
            <info-icon></info-icon>
            how to interpret these figures
            <component style="vertical-align: top"
                       :is="chevronComponent"></component>
        </a>
        <b-collapse v-model="show">
            <div v-html="docs"></div>
        </b-collapse>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {BCollapse} from "bootstrap-vue";
    import {InfoIcon, ChevronDownIcon, ChevronUpIcon} from "vue-feather-icons";

    interface Computed {
        chevronComponent: string
    }

    interface Methods {
        toggle: (e: Event) => void
    }

    interface Data {
        show: boolean
    }

    export default Vue.extend<Data, Methods, Computed, "docs">({
        components: {BCollapse, InfoIcon, ChevronDownIcon, ChevronUpIcon},
        props: ["docs"],
        data() {
            return {show: false}
        },
        methods: {
            toggle(e: Event) {
                e.preventDefault();
                this.show = !this.show
            }
        },
        computed: {
            chevronComponent() {
                if (this.show) {
                    return "chevron-up-icon"
                }
                return "chevron-down-icon"
            }
        }
    });
</script>