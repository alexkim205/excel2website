export enum SceneKey {
    Home = "home",
    Dashboard = "dashboard",
    PublicDashboard = "public_dashboard",
    Admin = 'admin',
    Pricing = 'pricing',
    Dashboards = "dashboards",
    SignUp = 'sign_up',
    SignIn = 'sign_in',
    ForgotPassword = 'forgot_password',
    ResetPassword = 'reset_password'
}

export const urls: Record<SceneKey, (a?: any) => string> = {
    [SceneKey.Home]: () => '/',
    [SceneKey.Dashboards]: () => '/dashboards',
    [SceneKey.Dashboard]: (id) => `/dashboard/${id}`,
    [SceneKey.PublicDashboard]: (subdomain) => `https://${subdomain}.sheetstodashboard.com`,
    [SceneKey.Admin]: () => '/admin',
    [SceneKey.Pricing]: () => '/pricing',
    [SceneKey.SignUp]: () => '/signup',
    [SceneKey.SignIn]: () => '/signin',
    [SceneKey.ForgotPassword]: () => '/forgot_password',
    [SceneKey.ResetPassword]: () => '/reset_password',
}

export const urlsToScenes: Record<string, SceneKey> = {
    [urls.home()]: SceneKey.Home,
    [urls.dashboard(":id")]: SceneKey.Dashboard,
    [urls.admin()]: SceneKey.Admin,
    [urls.pricing()]: SceneKey.Pricing,
    [urls.dashboards()]: SceneKey.Dashboards,
    [urls.sign_up()]: SceneKey.SignUp,
    [urls.sign_in()]: SceneKey.SignIn,
    [urls.forgot_password()]: SceneKey.ForgotPassword,
    [urls.reset_password()]: SceneKey.ResetPassword
};
