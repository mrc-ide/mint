<template>
    <svg class="lds-spin" :class="size" :width="height" :height="height"
         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100"
         preserveAspectRatio="xMidYMid" style="background: none;">
        <g transform="translate(80,50)">
            <g transform="rotate(0)">
                <circle cx="0" cy="0" r="7" fill="#aaf0ae" fill-opacity="1" :transform="transforms[0]">
                    <animateTransform attributeName="transform" type="scale" begin="-0.875s" values="1.1 1.1;1 1"
                                      keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                    <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0"
                             begin="-0.875s"></animate>
                </circle>
            </g>
        </g>
        <g transform="translate(71.21320343559643,71.21320343559643)">
            <g transform="rotate(45)">
                <circle cx="0" cy="0" r="7" fill="#aaf0ae" fill-opacity="0.875" :transform="transforms[1]">
                    <animateTransform attributeName="transform" type="scale" begin="-0.75s" values="1.1 1.1;1 1"
                                      keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                    <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0"
                             begin="-0.75s"></animate>
                </circle>
            </g>
        </g>
        <g transform="translate(50,80)">
            <g transform="rotate(90)">
                <circle cx="0" cy="0" r="7" fill="#aaf0ae" fill-opacity="0.75" :transform="transforms[2]">
                    <animateTransform attributeName="transform" type="scale" begin="-0.625s" values="1.1 1.1;1 1"
                                      keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                    <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0"
                             begin="-0.625s"></animate>
                </circle>
            </g>
        </g>
        <g transform="translate(28.786796564403577,71.21320343559643)">
            <g transform="rotate(135)">
                <circle cx="0" cy="0" r="7" fill="#aaf0ae" fill-opacity="0.625" :transform="transforms[3]">
                    <animateTransform attributeName="transform" type="scale" begin="-0.5s" values="1.1 1.1;1 1"
                                      keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                    <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0"
                             begin="-0.5s"></animate>
                </circle>
            </g>
        </g>
        <g transform="translate(20,50.00000000000001)">
            <g transform="rotate(180)">
                <circle cx="0" cy="0" r="7" fill="#aaf0ae" fill-opacity="0.5" :transform="transforms[4]">
                    <animateTransform attributeName="transform" type="scale" begin="-0.375s" values="1.1 1.1;1 1"
                                      keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                    <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0"
                             begin="-0.375s"></animate>
                </circle>
            </g>
        </g>
        <g transform="translate(28.78679656440357,28.786796564403577)">
            <g transform="rotate(225)">
                <circle cx="0" cy="0" r="7" fill="#aaf0ae" fill-opacity="0.375" :transform="transforms[5]">
                    <animateTransform attributeName="transform" type="scale" begin="-0.25s" values="1.1 1.1;1 1"
                                      keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                    <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0"
                             begin="-0.25s"></animate>
                </circle>
            </g>
        </g>
        <g transform="translate(49.99999999999999,20)">
            <g transform="rotate(270)">
                <circle cx="0" cy="0" r="7" fill="#aaf0ae" fill-opacity="0.25" :transform="transforms[6]">
                    <animateTransform attributeName="transform" type="scale" begin="-0.125s" values="1.1 1.1;1 1"
                                      keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                    <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0"
                             begin="-0.125s"></animate>
                </circle>
            </g>
        </g>
        <g transform="translate(71.21320343559643,28.78679656440357)">
            <g transform="rotate(315)">
                <circle cx="0" cy="0" r="7" fill="#aaf0ae" fill-opacity="0.125" :transform="transforms[7]">
                    <animateTransform attributeName="transform" type="scale" begin="0s" values="1.1 1.1;1 1"
                                      keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                    <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0"
                             begin="0s"></animate>
                </circle>
            </g>
        </g>
    </svg>
</template>
<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        props: ["size"],
        computed: {
            height() {
                return this.size == "xs" ? "40px" : (this.size == "sm") ? "100px" : "200px";
            },
            transforms() {
                const scales = this.size == "xs" ? [1.01585, 1.02835, 1.04085, 1.05335, 1.06585, 1.07853, 1.09085, 1.00335]
                    : [1.01254, 1.02504, 1.03754, 1.05004, 1.06254, 1.07504, 1.08754, 1.00004];
                return scales.map(s => `scale(${s}, ${s})`);
            }
        }
    })
</script>