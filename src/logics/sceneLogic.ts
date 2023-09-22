import {urlToAction} from "kea-router";
import {actions, kea, path, reducers} from "kea";
import {SceneKey, urlsToScenes} from "../utils/routes";
import type { sceneLogicType } from "./sceneLogicType";

export const sceneLogic = kea<sceneLogicType>([
    path(["src", "routerLogic"]),
    actions({
        setScene: (scene: SceneKey, params: Record<string, string>) => ({
            scene,params
        }),
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
        ]
    }),
    urlToAction(({ actions }) => {
        return Object.fromEntries(
            Object.entries(urlsToScenes).map(([path, scene]) => {
                return [path, (params) => actions.setScene(scene as SceneKey, params as Record<string, string>)];
            })
        );
    }),
]);
