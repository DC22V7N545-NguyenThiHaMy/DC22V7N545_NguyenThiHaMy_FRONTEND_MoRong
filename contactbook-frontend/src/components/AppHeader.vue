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
            <li v-if="isAuthenticated()" class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" :class="{ show: dropdownOpen }" @click.prevent="toggleDropdown">
                    <i class="fas fa-user-circle"></i>
                    {{ currentUser?.name || "Người dùng" }}
                </a>
                <ul class="dropdown-menu" :class="{ show: dropdownOpen }">
                    <li><span class="dropdown-item disabled">{{ currentUser?.email }}</span></li>
                    <li><hr class="dropdown-divider"></li>
                    <li v-if="currentUser?.phone" class="dropdown-item-text">
                        <small class="text-muted">SĐT: {{ currentUser.phone }}</small>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a href="#" class="dropdown-item" @click.prevent="handleLogout">
                        <i class="fas fa-sign-out-alt"></i> Đăng xuất
                    </a></li>
                </ul>
            </li>
        </div>
    </nav>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
    data() {
        return {
            currentUser: null,
            dropdownOpen: false,
        };
    },
    computed: {
        brandTarget() {
            return this.getIsAuthenticated() ? { name: "contactbook" } : { name: "login" };
        },
    },
    methods: {
        getIsAuthenticated() {
            return AuthService.isAuthenticated();
        },
        isAuthenticated() {
            return this.currentUser !== null;
        },
        loadCurrentUser() {
            this.currentUser = AuthService.getCurrentUser();
        },
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },
        closeDropdown() {
            this.dropdownOpen = false;
        },
        handleLogout() {
            this.closeDropdown();
            const confirmLogout = window.confirm("Bạn có muốn đăng xuất không?");
            if (!confirmLogout) {
                return;
            }
            AuthService.logout();
            this.$router.push({ name: "login" });
        },
    },
    mounted() {
        this.loadCurrentUser();
        
        // Listen for auth changes from localStorage
        window.addEventListener("storage", () => {
            this.loadCurrentUser();
        });

        // Also check for changes when component gets focus
        window.addEventListener("focus", () => {
            this.loadCurrentUser();
        });

        // Poll for auth changes every 500ms
        this.authCheckInterval = setInterval(() => {
            this.loadCurrentUser();
        }, 500);
    },
    beforeUnmount() {
        if (this.authCheckInterval) {
            clearInterval(this.authCheckInterval);
        }
        window.removeEventListener("storage", this.loadCurrentUser);
        window.removeEventListener("focus", this.loadCurrentUser);
    },
    watch: {
        '$route'() {
            this.loadCurrentUser();
            this.closeDropdown();
        },
    },
};
</script>