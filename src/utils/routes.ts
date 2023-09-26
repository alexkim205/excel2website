export enum SceneKey {
    Home = "home",
    Dashboard = "dashboard",
    PublicDashboard = "public_dashboard"
}

export const urls: Record<SceneKey, (a?: any) => string> = {
    [SceneKey.Home]: () => '/',
    [SceneKey.Dashboard]: (id) => `/dashboard/${id}`,
    [SceneKey.PublicDashboard]: (subdomain) => `https://${subdomain}.sheetstodashboard.com`
}

export const urlsToScenes: Record<string, SceneKey> = {
    [urls.home()]: SceneKey.Home,
    [urls.dashboard(":id")]: SceneKey.Dashboard,
};
