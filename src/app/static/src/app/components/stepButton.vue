<template>
    <div class="step text-right" :class="{active: active}" @click="$emit('click')">
        <button class="d-inline btn rounded-circle border">
            {{number}}
        </button>
        <span class="text-center pl-3">
            {{text}}
        </span>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    export default Vue.extend({
        props: ["number", "text", "active"]
    });
</script>
