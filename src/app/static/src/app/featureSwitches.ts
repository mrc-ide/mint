const urlParams = new URLSearchParams(window.location.search);
const stratAcrossRegions = !urlParams.get("stratAcrossRegions");
export const switches = {
    stratAcrossRegions: stratAcrossRegions
}
