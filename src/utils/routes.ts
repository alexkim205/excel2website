export enum SceneKey {
    Home = "home",
    Dashboard = "dashboard",
    DemoDashboard = 'demo_dashboard',
    PublicDashboard = "public_dashboard",
    Admin = 'admin',
    Pricing = 'pricing',
    Trust = 'trust',
    Dashboards = "dashboards",
    SignUp = 'sign_up',
    SignIn = 'sign_in',
    ForgotPassword = 'forgot_password',
    ResetPassword = 'reset_password'
}

export type AuthSceneKey = SceneKey.SignUp | SceneKey.SignIn | SceneKey.ForgotPassword | SceneKey.ResetPassword

export const urls: Record<SceneKey, (a?: any) => string> = {
    [SceneKey.Home]: () => '/',
    [SceneKey.Dashboards]: () => '/dashboards',
    [SceneKey.Dashboard]: (id) => `/dashboard/${id}`,
    [SceneKey.DemoDashboard]: () => '/demo-dashboard/edit',
    [SceneKey.PublicDashboard]: (subdomain) => `https://${subdomain}.sheetstodashboard.com`,
    [SceneKey.Admin]: () => '/admin',
    [SceneKey.Pricing]: () => '/pricing',
    [SceneKey.Trust]: () => '/trust',
    [SceneKey.SignUp]: () => '/signup',
    [SceneKey.SignIn]: () => '/signin',
    [SceneKey.ForgotPassword]: () => '/forgot_password',
    [SceneKey.ResetPassword]: () => '/reset_password',
}

export const urlsToScenes: Record<string, SceneKey> = {
    [urls.home()]: SceneKey.Home,
    [urls.dashboard(":id")]: SceneKey.Dashboard,
    [urls.demo_dashboard()]: SceneKey.DemoDashboard,
    [urls.admin()]: SceneKey.Admin,
    [urls.pricing()]: SceneKey.Pricing,
    [urls.trust()]: SceneKey.Trust,
    [urls.dashboards()]: SceneKey.Dashboards,
    [urls.sign_up()]: SceneKey.SignUp,
    [urls.sign_in()]: SceneKey.SignIn,
    [urls.forgot_password()]: SceneKey.ForgotPassword,
    [urls.reset_password()]: SceneKey.ResetPassword
};
