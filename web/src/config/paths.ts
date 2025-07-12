type RouteConfig = {
    route: string;
    path: () => string
}

type ParentRouteConfig = {
    app: RouteConfig,
    auth: {
        login: RouteConfig
        'forgot-password': RouteConfig
    }
}


export const paths: ParentRouteConfig = {
    app: {
        route: 'app', 
        path: () => '/app'
    },
    auth: {
        login: {
            route: 'login',
            path: () => '/login'
        },
        "forgot-password": {
            route: 'forgot password',
            path: () => '/forgot-password'
        }
    }
}