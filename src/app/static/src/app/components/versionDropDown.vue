<template>
  <drop-down v-if="versions" :text="versionString(versions.data)" :dropdown-class="'dropdown-right'">
      <div class="dropdown-item">
          <a href="https://mrc-ide.github.io/mint-news/" target="_blank">News</a>
      </div>
      <hr/>
      <div v-for="item in versionItems" class="dropdown-item-unclickable" :key="item">{{item}}</div>
  </drop-down>
</template>
<script lang="ts">
    import Vue from "vue";
    import {store} from "../store";
    import dropDown from "./dropDown.vue";
    import {Versions} from "../models/project";
    import {mapState} from "vuex";

    interface Computed {
        versions: Versions,
        versionItems: string[]
    }

    interface Methods {
        versionString: (version: string) => string
    }

    export default Vue.extend<Record<string, never>, Methods, Computed, Record<string, never>>({
        store,
    components: {
        dropDown
    },
    computed: {
        ...mapState(["versions"]),
        versionItems: function() {
            const keys = Object.keys(this.versions).sort();
            const versions = this.versions as unknown as Record<string, string>;
            return keys.map((k: string) =>  `${k}: ${this.versionString(versions[k])}`);
        }
    },
    methods: {
        versionString: (version: string) => `v${version}`
    }
    })
</script>