<template>
    <div class="dropdown" :class="parentClass">
        <a href="#"
           class="dropdown-toggle"
           :class="toggleClass"
           v-on:blur="close"
           v-on:click="toggle">
            {{text}}
        </a>
        <div class="dropdown-menu" :class="show && 'show'">
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts">
    import Vue from "vue";

    interface Methods {
        toggle: () => void
        close: () => void
    }

    interface Data {
        show: boolean
    }

    interface Props {
        text: string,
        parentClass: string
        toggleClass: string
    }

    export default Vue.extend<Data, Methods, {}, Props>({
        props: {text: String, parentClass: String, toggleClass: String},
        data(): Data {
            return {
                show: false
            }
        },
        methods: {
            toggle() {
                this.show = !this.show;
            },
            close() {
                this.show = false;
            }
        }
    })
</script>
