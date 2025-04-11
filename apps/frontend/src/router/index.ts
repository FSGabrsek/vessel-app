import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import VesselPage from '../pages/VesselPage.vue';

import CommunityPage from '../pages/CommunityPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import WatchDetailPage from '../pages/WatchDetailPage.vue';
import WatchListPage from '../pages/WatchListPage.vue';
import AboutPage from '../pages/AboutPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { name: "home", path: "/", component: HomePage },
    { name: "vessel", path: "/vessel", component: VesselPage },
    { name: "watch", path: "/user/:userId/watch", component: WatchListPage, children: [
        { name: "detail", path: ":watchId", component: WatchDetailPage }
    ]},
    { name: "community", path: "/community", component: CommunityPage },

    { name: "login", path: "/login", component: LoginPage, meta: { public_route: true } },
    { name: "register", path: "/register", component: RegisterPage, meta: { public_route: true } },

    { name: "about", path: "/about", component: AboutPage, meta: { public_route: true } }
  ],
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('user'); // Check session
  
    if (!to.meta.public_route && !isAuthenticated) {
        next('/login'); // Redirect to login if not authenticated
    } else {
        next();
    }
  });

export default router;
