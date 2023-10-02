import {kea, key, props, path, reducers, defaults, actions, connect, selectors, listeners} from "kea";
import {loaders} from "kea-loaders";
import type {publishModalLogicType} from "./publishModalLogicType";
import supabase from "../utils/supabase";
import {userLogic} from "./userLogic";
import {dashboardLogic, DashboardLogicProps} from "./dashboardLogic";
import {SupabaseTable} from "../utils/types";

export const publishModalLogic = kea<publishModalLogicType>([
    props({} as DashboardLogicProps),
    path((key) => ["src", "logics", "publishModalLogic", key]),
    key((props) => props.id),
    connect((props: DashboardLogicProps) => ({
        values: [userLogic, ["user"], dashboardLogic(props), ["dashboard"]],
        actions: [dashboardLogic(props), ["setDashboard", "verifyPublishStatus", "loadDashboardSuccess"]]
    })),
    defaults({
        open: false as boolean,
        publishDomain: "" as string
    }),
    actions(() => ({
        setOpen: (open: boolean) => ({open}),
        setPublishDomain: (domain: string) => ({domain}),
        addDomainToProject: true
    })),
    reducers(() => ({
        open: {
            setOpen: (_, {open}) => open
        },
    })),
    loaders(({values, props, actions}) => ({
        publishDomain: {
            setPublishDomain: ({domain}) => domain,
            // alias to publish dashboard
            addDomainToProject: async (_, breakpoint) => {
                if (!values.user) {
                    return values.publishDomain
                }
                await breakpoint(1)

                // just update dashboard supabase row
                if (!values.publishDomain) {
                    const {error} = await supabase
                        .from(SupabaseTable.Dashboards)
                        .update({
                            custom_domain: '',
                        })
                        .eq("id", props.id)
                    if (error) {
                        throw new Error(error.message)
                    }
                    // update dashboard
                    actions.setDashboard({custom_domain: ''})
                    return ''
                }

                const {data, error} = await supabase.functions.invoke("domains", {
                    body: {
                        operation: "add",
                        domain: values.publishDomain,
                        dashboard_id: props.id
                    }
                })
                breakpoint()
                if (error) {
                    throw new Error(error.message)
                }
                // update dashboard
                actions.setDashboard({custom_domain: values.publishDomain})
                return data.domain
            },
        }
    })),
    listeners(({actions, values}) => ({
        loadDashboardSuccess: () => {
            if (values.dashboard?.custom_domain) {
                actions.setPublishDomain(values.dashboard.custom_domain)
            }
        },
        addDomainToProjectSuccess: () => {
            actions.verifyPublishStatus({})
        }
    })),
    selectors(() => ({
        publishable: [
            (s) => [s.publishDomain, s.dashboard],
            (publishDomain, dashboard) => {
                const alreadyPublished = publishDomain === dashboard?.custom_domain
                return !alreadyPublished
            }
        ]
    })),
])

