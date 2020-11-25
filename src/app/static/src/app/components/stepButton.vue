<template>
    <div class="step" :class="{active: active}" @click="$emit('click')">
        <button class="d-inline btn rounded-circle border" :disabled="disabled">
            {{number}}
        </button>
        <span class="text-center pl-3" :class="{'text-muted': disabled}">
            {{text}}
        </span>
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    export default Vue.extend({
        props: ["number", "text", "active", "disabled"]
    });
</script>
