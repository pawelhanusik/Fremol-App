
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue') },
      
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/register', component: () => import('pages/Register.vue') },
      { path: '/logout', component: () => import('pages/Logout.vue') },
      { path: '/settings', component: () => import('pages/Settings.vue') },
      { path: '/deleteAccount', component: () => import('pages/DeleteAccount.vue') },
      
      { path: '/test', component: () => import('pages/Test.vue') },
      
      { path: '/chat/:chatID', component: () => import('pages/Chat.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
