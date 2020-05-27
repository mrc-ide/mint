<template>
    <div :class="{hoverbelow: hoverBelow}">
        <plotly :data="dataSeries" :layout="layout" :display-mode-bar="true"></plotly>
    </div>
</template>
<script lang="ts">
    import {Plotly} from "vue-plotly"
    import {defineComponent} from "@vue/composition-api";
    import {FilteringProps} from "../filteredData";
    import {useLongFormatData} from "./longFormatDataSeries";
    import {useWideFormatData} from "./wideFormatDataSeries";
    import {setupHoverBelowObserver} from "./hoverBelow";
    import {Dictionary} from "vue-router/types/router";
    import {LongFormatMetadata, SeriesDefinition, WideFormatMetadata} from "../../../generated";

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
            if (props.layout.mint_custom && props.layout.mint_custom.hover_below) {
                hoverBelow = true;
                setupHoverBelowObserver("hoverbelow");
            }

            let dataSeries = null;
            if (props.metadata.format == "long") {
                dataSeries = useLongFormatData(props).dataSeries
            } else {
                dataSeries = useWideFormatData(props).dataSeries
            }

            return {
                dataSeries,
                hoverBelow
            }
        }
    })
</script>