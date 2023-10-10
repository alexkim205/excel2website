import {combineUrl} from "kea-router";

export function parseWorkbookUrlAndGetId(provider: string, url: string): string {
    if (!url) {
        return ""
    }
    if (provider === "raw") {
        return ""
    }
    if (provider === "azure") {
        return combineUrl(url).searchParams?.resid ?? ""
    }
    if (provider === "google") {
        const splitUrl = url.split("/")
        const indexOfId = splitUrl.findIndex((param) => param === "d")
        if (indexOfId === -1) {
            return ""
        }
        return splitUrl[indexOfId + 1]
    }
    return ""
}