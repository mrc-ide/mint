<template>
    <div :class="{hoverbelow: hoverBelow}">
        <plotly :data="dataSeries" :layout="transformedLayout" :display-mode-bar="true"></plotly>
    </div>
</template>
<script lang="ts">
    import Plotly from "./plotly/Plotly.vue"
    import {computed, defineComponent, ref} from "@vue/composition-api";
    import {FilteringProps} from "../filteredData";
    import {useLongFormatData} from "./longFormatDataSeries";
    import {useWideFormatData} from "./wideFormatDataSeries";
    import {setupHoverBelowObserver} from "./hoverBelow";
    import {Dictionary} from "vue-router/types/router";
    import {LongFormatMetadata, SeriesDefinition, WideFormatMetadata} from "../../../generated";
    import {useLayout} from "./layout";

    interface Props extends FilteringProps {
        series: SeriesDefinition[]
        metadata: WideFormatMetadata | LongFormatMetadata
        layout: Dictionary<any>
    }

    export default defineComponent({
        components: {
            Plotly
        },
        props: {settings: Object, data: Array, series: Array, metadata: Object, layout: Object},
        setup(props: Props) {
            let hoverBelow = false;
            let observer = ref<MutationObserver | null>(null);
            if (props.layout.mintcustom && props.layout.mintcustom.hoverposition == "below") {
                hoverBelow = true;
                setupHoverBelowObserver(observer, "hoverbelow");
            }

            let dataSeries = null;
            if (props.metadata.format == "long") {
                dataSeries = useLongFormatData(props).dataSeries
            } else {
                dataSeries = useWideFormatData(props).dataSeries
            }

            const transformedLayout = computed<any>(() => ({
                ...useLayout(props),
                font: {
                    // use the same font settings as Bootstrap, which the rest of the app uses
                    family: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                    size: '1rem',
                    color: '#212529'
                }
            }))

            return {
                transformedLayout,
                dataSeries,
                hoverBelow,
                observer //Not required but makes testing much easier
            }
        }
    })
</script>
