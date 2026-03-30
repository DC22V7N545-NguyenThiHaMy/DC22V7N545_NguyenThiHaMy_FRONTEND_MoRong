<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h4 class="mb-3">Đăng nhập</h4>

          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>

          <Form @submit="submitLogin" :validation-schema="loginSchema">
            <div class="form-group">
              <label for="email">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                class="form-control"
                placeholder="example@gmail.com"
              />
              <ErrorMessage name="email" class="text-danger small" />
            </div>

            <div class="form-group">
              <label for="password">Mật khẩu</label>
              <div class="input-group">
                <Field
                  id="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Nhập mật khẩu"
                />
                <div class="input-group-append">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                    aria-label="Hiện hoặc ẩn mật khẩu"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>
              <ErrorMessage name="password" class="text-danger small" />
            </div>

            <button class="btn btn-primary btn-block" type="submit">
              Đăng nhập
            </button>
          </Form>

          <div class="mt-3 text-center">
            Chưa có tài khoản?
            <router-link :to="{ name: 'register' }">Đăng ký ngay</router-link>
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

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const loginSchema = yup.object({
      email: yup
        .string()
        .required("Email là bắt buộc.")
        .email("Email không đúng định dạng."),
      password: yup
        .string()
        .required("Mật khẩu là bắt buộc.")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
    });

    return {
      loginSchema,
      message: "",
      showPassword: false,
    };
  },
  methods: {
    submitLogin(values) {
      this.message = "";
      const result = AuthService.login(values.email, values.password);

      if (!result.success) {
        this.message = result.message;
        return;
      }

      const redirectPath = this.$route.query.redirect || "/";
      this.$router.push(redirectPath);
    },
  },
};
</script>
