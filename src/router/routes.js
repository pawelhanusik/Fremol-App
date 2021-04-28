
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue'), meta: {requiresAuth: true} },
      
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/register', component: () => import('pages/Register.vue') },
      { path: '/logout', component: () => import('pages/Logout.vue'), meta: {requiresAuth: true} },
      { path: '/profile', component: () => import('pages/Profile.vue'), meta: {requiresAuth: true} },
      { path: '/settings', component: () => import('pages/Settings.vue') },
      { path: '/deleteAccount', component: () => import('pages/DeleteAccount.vue'), meta: {requiresAuth: true} },
      
      { path: '/newConversation', component: () => import('pages/NewConversation.vue'), meta: {requiresAuth: true} },
      { path: '/editConversation/:conversationID', component: () => import('pages/EditConversation.vue'), meta: {requiresAuth: true} },
      { path: '/conversations/:conversationID', name: 'conversations', component: () => import('pages/Conversation.vue'), meta: {requiresAuth: true} },
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
