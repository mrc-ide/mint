import {computed} from "@vue/composition-api";
import {Dictionary} from "vue-router/types/router";

export interface FilteringProps {
    settings: Dictionary<string | number>
    data: any[]
}

export function useFiltering(props: FilteringProps) {
    const filterBySettings = (row: any) => {
        if (!props.settings) {
            return true;
        }

        for (let key of Object.keys(props.settings)) {
            if (row[key] != undefined && row[key] != props.settings[key]) {
                return false;
            }
        }
        return true;
    };

    const filteredData = computed<any[]>(() => props.data.filter((row: any) => filterBySettings(row)))

    return {filteredData}
}
