import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
declare module 'vue-router' {
    interface RouteMeta {
        title?: string
    }
}
const routes: Array<RouteRecordRaw> = [
{
    path: '/',
    name: 'recharge',
    meta: {
        title: '确认充值'
    },
    component: () => import('@/views/rechargeCenter/index.vue'),
},
{
    path: '/success',
    name: 'success',
    component: () => import('@/views/rechargeCenter/success.vue')
}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
// 解决iOS H5页面返回不刷新的问题
if ('addEventListener' in window) {
    window.addEventListener('popstate', () => {
      router.go(0); // 强制刷新当前页面
    });
  }
// router.beforeEach((to, form, next) => {
//     if (to.meta.title) {
//         document.title = to.meta.title
//     }
//     next()
// })
export default router