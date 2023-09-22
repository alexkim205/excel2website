export enum SceneKey {
    Home = "home",
    Dashboard = "dashboard"
}

export const urls: Record<SceneKey, (a?: any) => string> = {
    [SceneKey.Home]: () => '/home',
    [SceneKey.Dashboard]: (id) => `/dashboard/${id}`
}

export const urlsToScenes: Record<string, SceneKey> = {
    [urls.home()]: SceneKey.Home,
    [urls.dashboard(":id")]: SceneKey.Dashboard,
};
