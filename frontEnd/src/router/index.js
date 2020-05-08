import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 设置页面路由
export default new Router({
    mode: 'history',
    routes: [
        {
            // 最开始先进入登录界面
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta:
            {
                title: '自述文件',
                //requireAuth: true
             },

            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta:
                    {
                         title: '系统首页',
                         //requireAuth:true
                    }
                },
                {
                    path: '/resolvestatus',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Resolvestatus.vue'),
                    meta: { title: '结办情况' }
                },
                {
                    path: '/baseliveinfo',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseLiveInfo.vue'),
                    meta: { title: '民生分析' }
                },
                {
                    path: '/streetliveinfo',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/StreetLiveInfo.vue'),
                    meta: { title: '各街道民生事件情况' }
                },
                {
                    path: '/hotspotcommunity',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/HotSpotCommunity.vue'),
                    meta: { title: '热点社区' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/userchange',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/UserChange.vue'),
                    meta: { title: '账户管理' }
                },

                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    // 账户管理界面
                    path: '/usermanager',
                    component: () => import('../components/page/UserManager.vue'),
                    meta: { title: '账户管理', permission: true }
                },
                {
                    // 账户管理界面
                    path: '/usermanager1',
                    component: () => import('../components/page/UserManager1.vue'),
                    meta: { title: '异常事件总结', permission: true }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
