<template>
    <div class="row" style="position: relative">
        <ul ref="tabLinks" :style="navStyle"
            class="nav nav-tabs">
            <li v-for="tab in tabs"
                :key="tab"
                class="nav-item">
                <a class="text-success nav-link"
                   :class="{active: activeTab === tab}"
                   @click="$emit('tab-selected', tab)">
                    {{ tab }}
                </a>
            </li>
        </ul>
        <div class="col" :style="contentStyle">
            <div class="tab-content p-5">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";
    import {Dictionary} from "vue-router/types/router";

    interface Methods {
        calculateDimensions: () => void
    }

    interface Data {
        width: number
    }

    interface Computed {
        contentStyle: Dictionary<string>
        navStyle: Dictionary<string>
    }

    interface Props {
        tabs: string[]
        activeTab: string
    }

    export default Vue.extend<Data, Methods, Computed, Props>({
        props: {
            tabs: Array,
            activeTab: String
        },
        data() {
            return {
                width: 0
            }
        },
        computed: {
            contentStyle() {
                return {
                    "position": "absolute",
                    "top": "0",
                    "left": "0",
                    "padding-left": "38px"
                }
            },
            navStyle() {
                return {
                    "z-index": "999",
                    "height": "37px",
                    "transform-origin": "0 -1px",
                    "transform": `translate(0, ${this.width}px) rotate(-90deg)`
                }
            }
        },
        watch: {
            tabs() {
                this.$nextTick(() => {
                    this.calculateDimensions();
                })
            }
        },
        mounted() {
            this.calculateDimensions();
        },
        methods: {
            calculateDimensions() {
                this.width = (this.$refs.tabLinks as Element).clientWidth;
            }
        }
    })

</script>
