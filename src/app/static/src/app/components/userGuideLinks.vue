<template>
    <span v-if="short">
        <template v-if="includeFrenchUserGuide">
          User Guide: <a :href="en" target="_blank">en</a> <a :href="fr" target="_blank">fr</a>
        </template>
        <a v-else :href="en" target="_blank">User Guide</a>
    </span>
    <span v-else>
      <b>For further guidance please see the
        <template v-if="includeFrenchUserGuide">
          User Guide <a :href="en" target="_blank">in English</a> or <a :href="fr" target="_blank">en français</a>.
        </template>
        <a v-else :href="en" target="_blank">User Guide</a>.
      </b>
    </span>
</template>
<script lang="ts">
    import Vue from "vue";
    import {switches} from "../featureSwitches";

    interface Data {
        en: string
        fr: string
    }

    interface Computed {
        includeFrenchUserGuide: boolean
    }

    interface Props {
        short: boolean
    }

    export default Vue.extend<Data, Record<string, never>, Computed, Props>({
        data() {
            return {
                en: "/public/resources/MINT v2.0 User-Guide-English.pdf",
                fr: "/public/resources/User-Guide-fr.pdf"
            }
        },
        computed: {
            includeFrenchUserGuide: () => !!switches.frenchUserGuide
        },
        props: {
            short: Boolean
        }
    });
</script>
