import {DynamicFormData} from "@reside-ic/vue-dynamic-form";
import {Project, Region} from "./models/project";
import {RootState} from "./store";

function migrateBaselineSettingsPrevalences(baselineSettings: DynamicFormData) {
    const prevalenceMapping: Record<string, string> = {low: "5%", med: "30%", high: "60%"}
    baselineSettings.currentPrevalence = prevalenceMapping[baselineSettings.currentPrevalence as string];
}

function migrateBaselineSettings(baselineSettingsList: DynamicFormData[]) {
    const migrations = [
        migrateBaselineSettingsPrevalences
    ];
    for (const baselineSettings of baselineSettingsList) {
        const version = baselineSettings.version as number || 0;
        for (let i = version; i < migrations.length; i++) {
            migrations[i](baselineSettings);
        }
    }
}

function getProjects(state: Partial<RootState>) {
    const projects: Project[] = [];
    if (state?.projects) {
        projects.push(...state.projects)
    }
    if (state?.currentProject) {
        projects.push(state.currentProject)
    }
    return projects;
}

function getRegions(projects: Project[]) {
    return [
        ...projects.reduce((regions: Region[], project) => regions.concat(project.regions), []),
        ...projects.map(project => project.currentRegion)
    ];
}

export function migrateSettings(state: Partial<RootState>) {
    const projects = getProjects(state);
    const regions: Region[] = getRegions(projects);
    const baselineSettingsList = regions.map(region => region.baselineSettings);
    migrateBaselineSettings(baselineSettingsList);
}
