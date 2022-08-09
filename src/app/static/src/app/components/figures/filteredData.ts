import {computed} from "@vue/composition-api";
import {Dictionary} from "vue-router/types/router";
import {LongFormatMetadata, WideFormatMetadata} from "../../generated";

export interface FilteringProps {
    settings: Dictionary<string | number> | null
    data: any[]
    metadata?: LongFormatMetadata | WideFormatMetadata
}

export function useFiltering(props: FilteringProps) {

    const settings = computed<Dictionary<string | number> | null>(() => {
        let settings = props.settings;
        if (props.metadata && props.metadata.settings) {
            // filter to those settings specified in the metadata
            settings = props.metadata.settings
                .reduce((acc: Dictionary<string | number>, value: string) => {
                    acc[value] = props.settings![value];
                    return acc
                }, {} as Dictionary<string | number>)
        }
        return settings;
    })

    const filterBySettings = (row: any) => {

        const settingsVal = settings.value;
        if (!settingsVal) {
            return true;
        }

        for (const key of Object.keys(settingsVal)) {
            if (row[key] != undefined &&
                (settingsVal[key] === "" || (row[key] != settingsVal[key] && row[key] != "n/a"))) {
                return false;
            }
        }

        return true;
    };

    const filteredData = computed<any[]>(() => {
        const result = props.data.filter((row: any) => filterBySettings(row));
        // TODO: may be able remove this from master branch when data is fixed, if it reverts to being sorted by default
        return result.sort(function(a, b){return a.month-b.month});
    });

    return {filteredData}
}
