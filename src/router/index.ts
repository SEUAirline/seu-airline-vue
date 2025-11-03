import { createRouter, createWebHistory, type RouteRecordRaw, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAdminStore } from '@/stores/admin'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/user/HomePage.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/LoginPage.vue'),
    meta: { title: '用户登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/RegisterPage.vue'),
    meta: { title: '用户注册' }
  },
  {
    path: '/flights/search',
    name: 'FlightSearch',
    component: () => import('@/views/user/FlightSearchPage.vue'),
    meta: { title: '航班搜索' }
  },
  {
    path: '/flights/book/:id',
    name: 'FlightBook',
    component: () => import('@/views/user/FlightBookPage.vue'),
    meta: { title: '预订航班', requiresAuth: true }
  },
  {
    path: '/payment/:orderId',
    name: 'Payment',
    component: () => import('@/views/user/PaymentPage.vue'),
    meta: { title: '支付订单', requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: () => import('@/views/user/OrderListPage.vue'),
    meta: { title: '我的订单', requiresAuth: true }
  },
  {
    path: '/orders/success/:id',
    name: 'OrderSuccess',
    component: () => import('@/views/user/OrderSuccessPage.vue'),
    meta: { title: '订单成功', requiresAuth: true }
  },
  {
    path: '/user/center',
    name: 'UserCenter',
    component: () => import('@/views/user/UserCenterPage.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/user/messages',
    name: 'MessageCenter',
    component: () => import('@/views/user/MessageCenterPage.vue'),
    meta: { title: '消息中心', requiresAuth: true }
  },
  {
    path: '/help',
    name: 'HelpCenter',
    component: () => import('@/views/user/HelpCenterPage.vue'),
    meta: { title: '帮助中心' }
  },
  // 管理端路由
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/LoginPage.vue'),
    meta: { title: '管理员登录' }
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/DashboardPage.vue'),
    meta: { title: '管理控制台', requiresAdmin: true }
  },
  {
    path: '/admin/flights',
    name: 'AdminFlights',
    component: () => import('@/views/admin/FlightManagePage.vue'),
    meta: { title: '航班管理', requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: () => import('@/views/admin/OrderManagePage.vue'),
    meta: { title: '订单管理', requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/UserManagePage.vue'),
    meta: { title: '用户管理', requiresAdmin: true }
  },
  {
    path: '/admin/airports',
    name: 'AdminAirports',
    component: () => import('@/views/admin/AirportManagePage.vue'),
    meta: { title: '机场管理', requiresAdmin: true }
  },
  {
    path: '/admin/accounts',
    name: 'AdminAccounts',
    component: () => import('@/views/admin/AdminAccountPage.vue'),
    meta: { title: '管理员账户', requiresAdmin: true }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('@/views/admin/SystemSettingsPage.vue'),
    meta: { title: '系统设置', requiresAdmin: true }
  },
  {
    path: '/admin/logs',
    name: 'AdminLogs',
    component: () => import('@/views/admin/LogsPage.vue'),
    meta: { title: '日志管理', requiresAdmin: true }
  },
  {
    path: '/admin/docs',
    name: 'AdminDocs',
    component: () => import('@/views/admin/DocumentationPage.vue'),
    meta: { title: '文档中心', requiresAdmin: true }
  },
  {
    path: '/admin/help',
    name: 'AdminHelp',
    component: () => import('@/views/admin/HelpCenterPage.vue'),
    meta: { title: '帮助中心', requiresAdmin: true }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore()
  const adminStore = useAdminStore()

  // 设置页面标题
  document.title = `${to.meta.title || 'SEUAirline'} - SEUAirline航空预订系统`

  // 用户认证检查
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // 管理员认证检查
  if (to.meta.requiresAdmin && !adminStore.isAuthenticated) {
    next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export default router
