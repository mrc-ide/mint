<template>
    <span v-if="short">
        User Guide: <a :href="en" target="_blank">en</a> <a :href="fr" target="_blank">fr</a>
    </span>
    <span v-else>
    <b>For further guidance please see the User Guide <a :href="en" target="_blank">in English</a> or <a
        :href="fr" target="_blank">en français</a>.</b>
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

    export default Vue.extend<Data, Record<string, never>, Record<string, never>, Props>({
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
