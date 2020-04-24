<template>
    <div class="row">
        <ul ref="tabLinks" :style="navStyle"
            class="nav nav-tabs">
            <li v-for="tab in tabs"
                class="nav-item">
                <a href="#"
                   class="text-success nav-link"
                   :class="{active: tab.active}"
                   @click="$emit('tab-selected', tab.name)">
                    {{tab.name}}
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

    export default Vue.extend<any, any, any, any>({
        props: ["tabs"],
        data() {
            return {
                width: 1,
                height: 1
            }
        },
        computed: {
            contentStyle() {
                return {"margin-left": this.height - this.width + "px"}
            },
            navStyle() {
                return {
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
                this.height = (this.$refs.tabLinks as Element).clientHeight;
            }
        }
    })

</script>
