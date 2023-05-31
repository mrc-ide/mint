const urlParams = new URLSearchParams(window.location.search);
const stratAcrossRegions = !urlParams.get("stratAcrossRegions");
const frenchUserGuide = urlParams.get("frenchUserGuide");

export const switches = {
    stratAcrossRegions,
    frenchUserGuide
}
