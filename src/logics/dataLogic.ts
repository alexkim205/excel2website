import {actions, defaults, kea, path, reducers, selectors} from "kea";
import type { dataLogicType } from "./dataLogicType";

export const dataLogic = kea<dataLogicType>([
    path(["src", "dataLogic"]),
    defaults(() => ({
        open: false as boolean,
    })),
    actions(()=> ({
        setOpen: (open: boolean) => ({open}),
    })),
    reducers(() => ({
        open: {
            setOpen: (_,{open}) => open
        },
    })),
    selectors(() => ({

    }))
])