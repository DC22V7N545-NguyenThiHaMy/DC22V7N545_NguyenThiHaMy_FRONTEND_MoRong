<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
        <router-link :to="{ name: 'contactbook' }" class="navbar-brand">
            Ứng dụng Quản lý danh bạ
        </router-link>
        <div class="me-auto navbar-nav">
            <li class="nav-item">
                <router-link :to="{ name: 'contactbook' }" class="nav-link">
                    Danh bạ
                    <i class="fas fa-address-book"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'register' }" class="nav-link">
                    Đăng ký
                    <i class="fas fa-user-plus"></i>
                </router-link>
            </li>
        </div>
    </nav>
</template> 