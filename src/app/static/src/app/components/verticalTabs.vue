<template>
    <div class="row">
        <ul ref="tabLinks" :style="navStyle"
            class="nav nav-tabs">
            <li v-for="tab in tabs"
                class="nav-item">
                <a class="text-success nav-link"
                   :class="{active: activeTab === tab}"
                   @click="$emit('tab-selected', tab)">
                    {{tab}}
                </a>
            </li>
        </ul>
        <div class="col" :style="contentStyle">
            <div class="tab-content">
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
        height: number
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
                width: 0,
                height: 42
            }
        },
        computed: {
            contentStyle() {
                return {"margin-left": this.height - this.width + "px"}
            },
            navStyle() {
                return {
                    "height": "42px",
                    "transform-origin": "0 0",
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
            calculateDimensions(){
                this.width = (this.$refs.tabLinks as Element).clientWidth;
            }
        }
    })

</script>
