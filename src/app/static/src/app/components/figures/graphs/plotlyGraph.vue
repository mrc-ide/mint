<template>
    <plotly :data="dataSeries" :layout="layout" :display-mode-bar="true"></plotly>
</template>
<script lang="ts">
    import {Plotly} from "vue-plotly"
    import {defineComponent, onBeforeUnmount, onMounted} from "@vue/composition-api";
    import {FilteringProps} from "../filteredData";
    import {useLongFormatData} from "./longFormatDataSeries";
    import {useWideFormatData} from "./wideFormatDataSeries";
    import {Dictionary} from "vue-router/types/router";
    import {LongFormatMetadata, SeriesDefinition, WideFormatMetadata} from "../../../generated";
    import $ from 'jquery';

    interface Props extends FilteringProps {
        series: SeriesDefinition[]
        metadata: WideFormatMetadata | LongFormatMetadata
        layout: Dictionary<string>
    }

    export default defineComponent({
        components: {
            Plotly
        },
        props: {settings: Object, data: Array, series: Array, metadata: Object, layout: Object},
        setup(props: Props) {
            //TODO: Only do this if configured in layout
            //TODO: put file styles in class and apply only if configured
            //TODO: sort out destroyed
            //TODO: move out to another file?

            onMounted(() => {
                const target = $( ".plotly-horizontal-errors" )[0];

                if (target) {
                    const config = {
                        attributes: true,
                        attributeFilter: ["y", "d"],
                        childList: true,
                        characterData: false,
                        subtree: true
                    };

                    const observer = new MutationObserver(function (mutations) {
                        mutations.forEach(function (mutation) {
                            const text = $([mutation.target]).filter(".hoverlayer .hovertext text");
                            if (text.length && text.attr("y") !== "0") {
                                 text.attr("y", "0");
                            }

                            const path = $([mutation.target]).filter(".hoverlayer .hovertext path");
                            if (path.length) {
                                const w = path.siblings("rect").attr("x") || 0;
                                const h = path.siblings("rect").height() || 0;
                                const newPath = "M4,-" + h/2 + //path is clockwise, starting at top left
                                    "v" + h  + //vertical line to bottom
                                    "H" + w + //horizontal line to right
                                    "v-" + h + //vertical line to top
                                    "h-" + (+w-20) + //horizontal line left to start of 'up' indicator
                                    "l-6,-6" +  //diagonal line to top of 'up' indicator
                                    "l-6,6" + //diagonal line to bottom of 'up' indicator
                                    "Z"; //close path
                                if (path.attr("d") !== newPath) {
                                    path.attr("d", newPath)
                                }
                            }
                        });
                    });

                    observer.observe(target, config);
                }
            });

            onBeforeUnmount(() => {

            });

            let dataSeries = null;
            if (props.metadata.format == "long") {
                dataSeries = useLongFormatData(props).dataSeries
            } else {
                dataSeries = useWideFormatData(props).dataSeries
            }

            return {
                dataSeries
            }
        }
    })
</script>