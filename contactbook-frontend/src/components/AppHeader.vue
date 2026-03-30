<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
        <router-link :to="brandTarget" class="navbar-brand">
            Ứng dụng Quản lý danh bạ
        </router-link>
        <div class="me-auto navbar-nav">
            <li v-if="isAuthenticated()" class="nav-item">
                <router-link :to="{ name: 'contactbook' }" class="nav-link">
                    Danh bạ
                    <i class="fas fa-address-book"></i>
                </router-link>
            </li>
            <li v-if="!isAuthenticated()" class="nav-item">
                <router-link :to="{ name: 'login' }" class="nav-link">
                    Đăng nhập
                    <i class="fas fa-sign-in-alt"></i>
                </router-link>
            </li>
            <li v-if="!isAuthenticated()" class="nav-item">
                <router-link :to="{ name: 'register' }" class="nav-link">
                    Đăng ký
                    <i class="fas fa-user-plus"></i>
                </router-link>
            </li>
            <li v-if="isAuthenticated()" class="nav-item">
                <a href="#" class="nav-link" @click.prevent="handleLogout">
                    Đăng xuất
                    <i class="fas fa-sign-out-alt"></i>
                </a>
            </li>
        </div>
    </nav>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
    computed: {
        brandTarget() {
            return this.isAuthenticated() ? { name: "contactbook" } : { name: "login" };
        },
    },
    methods: {
        isAuthenticated() {
            return AuthService.isAuthenticated();
        },
        handleLogout() {
            const confirmLogout = window.confirm("Bạn có muốn đăng xuất không?");
            if (!confirmLogout) {
                return;
            }
            AuthService.logout();
            this.$router.push({ name: "login" });
        },
    },
};
</script>