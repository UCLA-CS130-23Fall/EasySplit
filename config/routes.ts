export default [
  {
    path: '/',
    component: './pages/Login', // Set login page as root
  },
  {
    path: '/app',
    component: './layouts/RootLayout',
    routes: [
      {
        path: '/app',
        routes: [
          {
            path: '/app',
            component: './layouts/BasicLayout',
            routes: [
              {
                path: '/app',
                redirect: '/app/dashboard',
              },
              {
                path: '/app/dashboard',
                icon: 'star',
                name: 'Dashboard',
                component: './pages/Dashboard',
              },
              {
                path: '/app/group',
                icon: 'team',
                name: 'Group',
                component: './pages/Group',
              },
              {
                path: '/app/settings',
                icon: 'setting',
                name: 'Settings',
                component: './pages/Settings',
              },
            ],
          },
          {
            component: './pages/404',
          },
        ],
      },
      {
        component: './pages/404',
      },
    ],
  },
  {
    component: './pages/404',
  },
]
