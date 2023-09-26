import {kea, key, props, path, reducers, defaults, actions} from "kea";
import {DashboardType} from "../utils/types";
import type { publishModalLogicType } from "./publishModalLogicType";

export interface PublishModalLogicProps {
    id: DashboardType["id"]
}

export const publishModalLogic = kea<publishModalLogicType>([
    path((key) => ["src", "logics", "publishModalLogic", key]),
    props({} as PublishModalLogicProps),
    key((props) => props.id),
    defaults({
        open: false as boolean
    }),
    actions(() => ({
        setOpen: (open: boolean) => ({open})
    })),
    reducers(() => ({
        open: {
            setOpen: (_, {open}) => open
        }
    }))
])