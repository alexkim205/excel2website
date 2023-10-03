import {afterMount, defaults, kea, path} from "kea";
import {loaders} from "kea-loaders";
import supabase from "../utils/supabase";
import type {homeLogicType} from "./homeLogicType";

export const homeLogic = kea<homeLogicType>([
    path(["src", "logics", "homeLogic"]),
    defaults({
       gravatarIds: Array.from(Array(23).fill({initials: "", hash: ""})) as {initials: string, hash: string}[]
    }),
    loaders(() => ({
        gravatarIds: {
            loadGravatarIds: async (_, breakpoint) => {
                await breakpoint(1)
                const {data, error} = await supabase.functions.invoke("fetch-gravatar-ids")
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                return data.values
            }
        },
    })),
    afterMount(({actions}) => {
        actions.loadGravatarIds({})
    })
])