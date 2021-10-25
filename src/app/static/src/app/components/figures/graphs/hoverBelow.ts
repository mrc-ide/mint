import $ from "jquery";
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

                    const path = $(nodes).filter(".hoverlayer .hovertext path");
                    if (path.length) {
                        let w = parseFloat(path.siblings("rect").attr("x") || "0");

                        const leftLabel = w < 0;
                        if (leftLabel) {
                            //This will be the case if the label is on the left (smaller screens)
                            const rectWidth = parseFloat(path.siblings("rect").attr("width") ||"0");
                            w += rectWidth;
                        }

                        const h = path.siblings("rect").attr("height") || 0;
                        const startOffset = leftLabel ? -4 : 4;
                        const newPath = `M${startOffset},-${+h/2}` + //path is clockwise, starting at top left
                            `v${h}` + //vertical line to bottom
                            `H${w}` + //horizontal line to right
                            `v-${h}` + //vertical line to top
                            (leftLabel ? `h${-(w+20)}` : `h${-(w-20)}`) + //horizontal line left to start of 'up' indicator
                            (leftLabel ? "l6,-6" : "l-6,-6") +  //diagonal line to top of 'up' indicator
                            (leftLabel ? "l6,6" : "l-6,6") + //diagonal line to bottom of 'up' indicator
                            "Z"; //close path
                        if (path.attr("d") !== newPath) {
                            path.attr("d", newPath);

                            //We also apply the correct classes for css translate to work
                            const className = leftLabel ? "hoverbelow-left" : "hoverbelow-right";
                            path.addClass(className);
                            path.siblings("rect, text").addClass(className);
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