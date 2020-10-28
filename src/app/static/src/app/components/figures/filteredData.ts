import {computed} from "@vue/composition-api";
import {Dictionary} from "vue-router/types/router";
import {LongFormatMetadata, WideFormatMetadata} from "../../generated";

export interface FilteringProps {
    settings: Dictionary<string | number> | null
    data: any[]
    metadata?: LongFormatMetadata | WideFormatMetadata
}

export function useFiltering(props: FilteringProps) {

    const filterBySettings = (row: any) => {
        if (!props.settings) {
            return true;
        }

        let settings = props.settings;
        if (props.metadata && props.metadata.settings) {
            // filter to those settings specified in the metadata
            settings = props.metadata.settings
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
