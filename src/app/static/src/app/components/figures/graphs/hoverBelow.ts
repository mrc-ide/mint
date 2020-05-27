import $ from 'jquery';
import {onBeforeUnmount, onMounted, Ref} from "@vue/composition-api";

export function setupHoverBelowObserver(observer: Ref<MutationObserver | null>, className: string) {

    onMounted(() => {
       const target = $(`.${className}`)[0];

        if (target) {
            const config = {
                attributes: true,
                attributeFilter: ["y", "d"],
                childList: true,
                characterData: false,
                subtree: true
            };

            observer.value = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                   const nodes = mutation.addedNodes.length ? mutation.addedNodes : [mutation.target];

                    const text = $(nodes).filter(".hoverlayer .hovertext text");
                    if (text.length && text.attr("y") !== "0") {
                        text.attr("y", "0");
                    }

                    const path = $([mutation.target]).filter(".hoverlayer .hovertext path");
                    if (path.length) {
                        const w = path.siblings("rect").attr("x") || 0;
                        const h = path.siblings("rect").height() || 0;
                        const newPath = "M4,-" + h / 2 + //path is clockwise, starting at top left
                            "v" + h + //vertical line to bottom
                            "H" + w + //horizontal line to right
                            "v-" + h + //vertical line to top
                            "h-" + (+w - 20) + //horizontal line left to start of 'up' indicator
                            "l-6,-6" +  //diagonal line to top of 'up' indicator
                            "l-6,6" + //diagonal line to bottom of 'up' indicator
                            "Z"; //close path
                        if (path.attr("d") !== newPath) {
                            path.attr("d", newPath)
                        }
                    }
                });
            });

            observer.value.observe(target, config);
        }
    });

    onBeforeUnmount(() => {
        if (observer.value) {
            observer.value.disconnect();
        }
    });
}