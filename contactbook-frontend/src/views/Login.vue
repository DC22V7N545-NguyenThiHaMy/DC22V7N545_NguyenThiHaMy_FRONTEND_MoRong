<template>
  <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="col-12 col-md-5">
      <div class="card shadow-sm">
        <div class="card-body p-5">
          <h3 class="mb-4 text-center">Đăng nhập</h3>

          <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>

          <Form @submit="submitLogin" :validation-schema="loginSchema">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <Field name="email" type="email" class="form-control" placeholder="example@gmail.com" />
              <ErrorMessage name="email" class="d-block text-danger small mt-1" />
            </div>

            <div class="mb-3">
              <label class="form-label">Mật khẩu</label>
              <div class="input-group">
                <Field name="password" :type="showPassword ? 'text' : 'password'" class="form-control" placeholder="Nhập mật khẩu" />
                <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <ErrorMessage name="password" class="d-block text-danger small mt-1" />
            </div>

            <button type="submit" class="btn btn-primary w-100 mb-3">Đăng nhập</button>
          </Form>

          <hr class="my-3" />

          <button type="button" class="btn btn-outline-secondary w-100 mb-2" @click="loginWithGoogle">
            <i class="fab fa-google me-2"></i> Google
          </button>
          <button type="button" class="btn btn-light border w-100" @click="loginWithFacebook">
            <i class="fab fa-facebook-f me-2" style="color: #1877f2;"></i> <span style="color: #1877f2;">Facebook</span>
          </button>

          <div class="text-center mt-4">
            Chưa có tài khoản? <router-link :to="{ name: 'register' }">Đăng ký</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import AuthService from "@/services/auth.service";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || "";

export default {
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      loginSchema: yup.object({
        email: yup.string().required("Email là bắt buộc.").email("Email không hợp lệ."),
        password: yup.string().required("Mật khẩu là bắt buộc.").min(6, "Tối thiểu 6 ký tự."),
      }),
      message: "",
      showPassword: false,
    };
  },
  mounted() {
    this.loadGoogleSDK();
    this.loadFacebookSDK();
  },
  methods: {
    submitLogin(values) {
      this.message = "";
      const result = AuthService.login(values.email, values.password);
      if (!result.success) {
        this.message = result.message;
        return;
      }
      this.$router.push(this.$route.query.redirect || "/");
    },
    loadGoogleSDK() {
      if (!GOOGLE_CLIENT_ID) return;
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      document.head.appendChild(script);
    },
    async loginWithGoogle() {
      if (!GOOGLE_CLIENT_ID) {
        this.message = "Thiếu Google Client ID";
        return;
      }
      if (!window.google?.accounts?.oauth2) {
        this.message = "Google chưa sẵn sàng";
        return;
      }
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "openid profile email",
        callback: (response) => this.handleGoogleResponse(response),
      });
      tokenClient.requestAccessToken({ prompt: "consent" });
    },
    async handleGoogleResponse(response) {
      if (!response.access_token) {
        this.message = "Đăng nhập Google thất bại";
        return;
      }
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${response.access_token}` },
        });
        const profile = await res.json();
        AuthService.loginWithSocial({ provider: "google", name: profile.name, email: profile.email });
        this.$router.push(this.$route.query.redirect || "/");
      } catch (error) {
        this.message = "Không lấy được thông tin Google";
      }
    },
    loadFacebookSDK() {
      if (!FACEBOOK_APP_ID) return;
      window.fbAsyncInit = () => {
        window.FB?.init({ appId: FACEBOOK_APP_ID, xfbml: false, version: "v21.0" });
      };
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      document.head.appendChild(script);
    },
    loginWithFacebook() {
      if (!window.FB) {
        this.message = "Facebook chưa sẵn sàng";
        return;
      }
      window.FB.login((response) => {
        if (!response?.authResponse) {
          this.message = "Đăng nhập Facebook bị hủy";
          return;
        }
        window.FB.api("/me", { fields: "name,email" }, (profile) => {
          if (profile.error) {
            this.message = "Không lấy được thông tin Facebook";
            return;
          }
          AuthService.loginWithSocial({ provider: "facebook", name: profile.name, email: profile.email });
          this.$router.push(this.$route.query.redirect || "/");
        });
      }, { scope: "public_profile,email" });
    },
  },
};
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 12px;
}
</style>
