<template>
    <div class="dropdown" :class="parentClass" :id="id">
        <a class="dropdown-toggle"
           :class="toggleClass"
           v-on:click="toggle">
            {{ text }}
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
        id: string
        show: boolean
    }
    interface Props {
        text: string,
        parentClass: string
        toggleClass: string
    }
    export default Vue.extend<Data, Methods, Record<string, never>, Props>({
    props: {text: String, parentClass: String, toggleClass: String},
    data(): Data {
        return {
            id: [...Array(30)].map(() => Math.random().toString(36)[2]).join(""),
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
    },
    mounted() {
        window.addEventListener("click", (e: any) => {
            let target = e.target
            let closeDropdown = true;
            while (target.parentElement) {
                if (target.id == this.id) {
                    // this click originated from inside the dropdown and was not a navigation
                    // so leave the dropdown open
                    const original = e.target;
                    if (!original.href) {
                        closeDropdown = false;
                        break;
                    }
                }
                target = target.parentElement
            }
            if (closeDropdown) {
                this.close();
            }
        });
    }
    })
</script>