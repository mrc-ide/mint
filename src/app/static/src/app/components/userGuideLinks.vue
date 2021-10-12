<template>
    <span v-if="short">
        <a :href="en" target="_blank">User Guide</a>
    </span>
    <span v-else>
    <b>For further guidance please see the <a :href="en" target="_blank">User Guide</a>.</b>
    </span>
</template>
<script lang="ts">
import Vue from "vue";

interface Data {
    en: string
    fr: string
}

interface Props {
    short: boolean
}

export default Vue.extend<Data, {}, {}, Props>({
    data() {
        return {
            en: "/public/resources/User-Guide.pdf",
            fr: "/public/resources/User-Guide-fr.pdf"
        }
    },
    props: {
        short: Boolean
    }
});
</script>
