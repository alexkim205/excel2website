import {ChartPresetType, DashboardDataType, DashboardItemDataType, Provider} from "./types";
import {customAlphabet} from 'nanoid'
import type {Session} from "@supabase/gotrue-js/dist/module/lib/types";
import {combineUrl} from "kea-router";

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8)

export function isNumeric(str: any) {
    if (typeof str != "string") return false // we only process strings!
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function generateEmptyDashboardData(id: DashboardDataType["id"]): DashboardDataType {
    return {
        id,
        title: "",
        description: "",
    }
}

export function generateEmptyDashboardItem(id: DashboardItemDataType["id"], defaultProvider: Provider, defaultUrl?: string): DashboardItemDataType {
    return {
        id,
        type: ChartPresetType.BasicBar,
        srcUrl: defaultUrl ?? "",
        srcProvider: defaultProvider,
        dataRange: "'Sheet1'!A1:B17",
        coordinates: {
            sm: {x: 0, y: 0, w: 3, h: 3, static: true},
            md: {x: 0, y: 0, w: 3, h: 3, static: true},
            lg: {x: 0, y: 0, w: 3, h: 3, static: true}
        },
        chart: {
            title: {
                text: "",
                subtext: "",
                textStyle: {
                    fontSize: 24
                },
                subtextStyle: {
                    fontSize: 16
                }
            },
            legend: {
              show: true
            },
            xAxis: {
                name: "",
                type: null
            },
            yAxis: {
                name: "",
                type: null
            },
        }
    }
}

export function generateDashboardSubdomain(): string {
    return nanoid()
}

export const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;

export function generateUserMetadata(session: Session): Record<string, {provider_token: string, provider_refresh_token: string}> & Record<string, any> {
    const provider: Provider = session.user.app_metadata.provider as Provider
    if (!provider || ![Provider.Azure, Provider.Google].includes(provider)) {
        return {}
    }
    if (!session.provider_token || !session.provider_refresh_token) {
        return {}
    }

    return {
        [provider]: {
            provider_token: session.provider_token as string,
            provider_refresh_token: session.provider_refresh_token as string
        }
    }
}

export function parseWorkbookUrlAndGetId(provider: string, url: string | null | undefined): string {
    if (!url) {
        return ""
    }
    if (provider === Provider.Raw) {
        return ""
    }
    if (provider === Provider.Azure) {
        return combineUrl(url).searchParams?.resid ?? ""
    }
    if (provider === Provider.Google) {
        const splitUrl = url.split("/")
        const indexOfId = splitUrl.findIndex((param) => param === "d")
        if (indexOfId === -1) {
            return ""
        }
        return splitUrl[indexOfId + 1]
    }
    return ""
}

export function findFirstLinkedProvider(linkedProviders: Record<Provider, boolean>): Provider {
    return Object.entries(linkedProviders).find(([, isLinked]) => isLinked)?.[0] as Provider
}