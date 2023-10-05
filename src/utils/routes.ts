export enum SceneKey {
    Home = "home",
    Dashboard = "dashboard",
    PublicDashboard = "public_dashboard",
    Admin = 'admin',
    Pricing = 'pricing',
    Dashboards = "dashboards",
    TermsAndPrivacy = "terms_and_privacy"
}

export const urls: Record<SceneKey, (a?: any) => string> = {
    [SceneKey.Home]: () => '/',
    [SceneKey.Dashboards]: () => '/dashboards',
    [SceneKey.Dashboard]: (id) => `/dashboard/${id}`,
    [SceneKey.PublicDashboard]: (subdomain) => `https://${subdomain}.sheetstodashboard.com`,
    [SceneKey.Admin]: () => '/admin',
    [SceneKey.Pricing]: () => '/pricing',
    [SceneKey.TermsAndPrivacy]: () => '/terms-and-privacy'
}

export const urlsToScenes: Record<string, SceneKey> = {
    [urls.home()]: SceneKey.Home,
    [urls.dashboard(":id")]: SceneKey.Dashboard,
    [urls.admin()]: SceneKey.Admin,
    [urls.pricing()]: SceneKey.Pricing,
    [urls.dashboards()]: SceneKey.Dashboards,
    [urls.terms_and_privacy()]: SceneKey.TermsAndPrivacy
};
