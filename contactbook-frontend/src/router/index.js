import { createRouter, createWebHistory } from "vue-router";
import ContactBook from "../views/ContactBook.vue";
import AuthService from "@/services/auth.service";

const routes = [
  {
    path: "/",
    name: "contactbook",
    component: ContactBook,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: "/contacts/add",
    name: "contact.add",
    component: () => import("@/views/ContactAdd.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/contacts/:id",
    name: "contact.edit",
    component: () => import("@/views/ContactEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const isLoggedIn = AuthService.isAuthenticated();

  if (to.matched.some((record) => record.meta.requiresAuth) && !isLoggedIn) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if ((to.name === "login" || to.name === "register") && isLoggedIn) {
    return { name: "contactbook" };
  }

  return true;
});

export default router;
