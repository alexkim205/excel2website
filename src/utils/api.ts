import {DashboardItemType} from "./types";
import supabase from "./supabase";

export const api = {
    fetchSheetData: async ({chart}: {chart: DashboardItemType}) => {
        return await supabase.functions.invoke('fetch-chart-data', {
            body: {
                chart
            }
        })
    }
}