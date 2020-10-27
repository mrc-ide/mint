import {computed} from "@vue/composition-api";
import {Dictionary} from "vue-router/types/router";

export interface FilteringProps {
    settings: Dictionary<string | number> | null
    data: any[]
    settingNames?: string[]
}

export function useFiltering(props: FilteringProps) {

    const filterBySettings = (row: any) => {
        if (!props.settings) {
            return true;
        }

        let settings = props.settings;
        if (props.settingNames) {
            // filter to those settings specified in the metadata
            settings = props.settingNames
                .reduce((acc: Dictionary<string | number>, value: string) => {
                    acc[value] = props.settings!![value];
                    return acc
                }, {} as Dictionary<string | number>)
        }

        for (let key of Object.keys(settings)) {
            if (row[key] != undefined && (settings[key] === "" || row[key] != settings[key])) {
                return false;
            }
        }
        return true;
    };

    const filteredData = computed<any[]>(() => props.data.filter((row: any) => filterBySettings(row)))

    return {filteredData}
}
