import {Card, CardBody, CardHeader, Divider, Skeleton} from "@nextui-org/react";
import {router} from "kea-router";
import {urls} from "../utils/routes";
import {useValues} from "kea";
import {homeLogic} from "../logics/homeLogic";
import {v4 as uuidv4} from "uuid";
import {AiOutlinePlus} from "react-icons/ai";

export function Home() {
    const {dashboards, dashboardsLoading} = useValues(homeLogic)

    return (
        <div className="flex flex-col w-full max-w-[1024px] px-6 gap-8">
            <h2 className="sm:text-3xl text-2xl font-bold">Dashboards</h2>
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
                {dashboardsLoading ? (
                    [1, 2, 3].map((key) => (
                        <Card key={key} className="aspect-square flex flex-col p-4 space-y-3">
                            <Skeleton className="w-full rounded-lg">
                                <div className="h-6 rounded-lg bg-default-300"></div>
                            </Skeleton>
                            <Skeleton className="w-3/5 rounded-lg">
                                <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                            </Skeleton>
                            <Skeleton className="w-4/5 rounded-lg">
                                <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                            </Skeleton>
                            <Skeleton className="w-2/5 rounded-lg">
                                <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                            </Skeleton>
                        </Card>
                    ))
                ) : (
                    <>
                        {dashboards.map((dashboard) => (
                            <Card key={dashboard.id} isPressable className="aspect-square"
                                  onPress={() => router.actions.push(urls.dashboard(dashboard.id))}>
                                <CardHeader className="flex gap-3">
                                    <div className="flex flex-col">
                                        <p className="text-md">{dashboard.data.title || "Untitled"}</p>
                                        <p className="text-small text-default-400">{dashboard.data.description}</p>
                                    </div>
                                </CardHeader>
                                <Divider/>
                                <CardBody>
                                    <p>Make beautiful websites regardless of your design experience.</p>
                                </CardBody>
                            </Card>
                        ))}
                        <Card key="new-dashboard" isPressable className="aspect-square"
                              onPress={() => router.actions.push(urls.dashboard(uuidv4()))}>
                            <CardBody className="justify-center items-center">
                                <span className="flex flex-row items-center gap-3 text-default-400"><AiOutlinePlus className="text-lg"/> Add dashboard</span>
                            </CardBody>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}