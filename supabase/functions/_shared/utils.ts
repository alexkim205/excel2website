// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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

enum Provider {
    Azure = 'azure',
    Google = 'google'
}

export const refreshToken: Record<Provider, (refreshToken: string) => Promise<{access_token: string, refresh_token: string}>> = {
    azure: async (refreshToken: string) => {
        const response = await fetch(`https://login.microsoftonline.com/common/oauth2/v2.0/token`, {
            method: "POST",
            headers: new Headers({
                ["Content-Type"]: 'application/x-www-form-urlencoded',
                Host: "https://login.microsoftonline.com"
            }),
            body: new URLSearchParams({
                scope: 'Files.Read Files.Read.All',
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                client_id: Deno.env.get('VITE_SUPABASE_AUTH_AZURE_CLIENT_ID'),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                client_secret: Deno.env.get('VITE_SUPABASE_AUTH_AZURE_SECRET')
            })
        })
        const data = await response.json()
        if (!response.ok) {
            throw new Error(data.statusText)
        }
        return {
            access_token: data.access_token,
            refresh_token: refreshToken,
        }
    },
    google:  async (refreshToken: string) => {
        const response = await fetch(`https://oauth2.googleapis.com/token`, {
            method: "POST",
            headers: new Headers({
                ["Content-Type"]: 'application/x-www-form-urlencoded',
                Host: "oauth2.googleapis.com"
            }),
            body: new URLSearchParams({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                client_id: Deno.env.get('VITE_SUPABASE_AUTH_GOOGLE_CLIENT_ID') ?? '',
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                client_secret: Deno.env.get('VITE_SUPABASE_AUTH_GOOGLE_SECRET') ?? '',
                refresh_token: refreshToken,
                grant_type: "refresh_token"
            })
        })
        const data = await response.json()
        return {
            access_token: data.access_token,
            refresh_token: refreshToken
        }
    },
}