import {urlToAction} from "kea-router";
import {actions, afterMount, kea, path, reducers} from "kea";
import {SceneKey, urlsToScenes} from "../utils/routes";
import type {sceneLogicType} from "./sceneLogicType";

export const sceneLogic = kea<sceneLogicType>([
    path(["src", "routerLogic"]),
    actions({
        setScene: (scene: SceneKey, params: Record<string, string>) => ({
            scene,params
        }),
        setSubdomain: (subdomain: string | null) => ({subdomain})
    }),
    reducers({
        scene: [
            SceneKey.Home as SceneKey,
            {
                setScene: (_, payload) => payload.scene,
            },
        ],
        params: [
            {} as Record<string, string>,
            {
                setScene: (_, payload) => payload.params
            }
        ],
        subdomain: [
            null as string | null,
            {
                setSubdomain: (_, {subdomain}) => subdomain
            }
        ]
    }),
    urlToAction(({ actions }) => {
        return Object.fromEntries(
            Object.entries(urlsToScenes).map(([path, scene]) => {
                return [path, (params) => actions.setScene(scene as SceneKey, params as Record<string, string>)];
            })
        );
    }),
    afterMount(({actions}) => {
        const host = window.location.host
        const arr = host.split(".").slice(0, host.includes("localhost") ? -1 : -2);
        console.log("HOST", host, arr)
        if (arr.length > 0) {
            actions.setSubdomain(arr[0])
            actions.setScene(SceneKey.PublicDashboard, {})
        }
    })
]);
