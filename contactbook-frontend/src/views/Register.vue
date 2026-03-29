<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h4 class="mb-3">Đăng ký tài khoản</h4>

          <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
          </div>

          <Form @submit="submitRegister" :validation-schema="registerSchema">
            <div class="form-group">
              <label for="name">Tên</label>
              <Field
                id="name"
                name="name"
                type="text"
                class="form-control"
                placeholder="Nhập họ và tên"
              />
              <ErrorMessage name="name" class="text-danger small" />
            </div>

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
              <label for="phone">Số điện thoại</label>
              <Field
                id="phone"
                name="phone"
                type="tel"
                class="form-control"
                placeholder="Nhập số điện thoại"
              />
              <ErrorMessage name="phone" class="text-danger small" />
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

            <div class="form-group">
              <label for="confirmPassword">Nhập lại mật khẩu</label>
              <div class="input-group">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Nhập lại mật khẩu"
                />
                <div class="input-group-append">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showConfirmPassword = !showConfirmPassword"
                    aria-label="Hiện hoặc ẩn nhập lại mật khẩu"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>
              <ErrorMessage name="confirmPassword" class="text-danger small" />
            </div>

            <button class="btn btn-primary btn-block" type="submit">
              Đăng ký
            </button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const REGISTER_STORAGE_KEY = "registeredUsers";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const registerSchema = yup.object({
      name: yup
        .string()
        .required("Tên là bắt buộc.")
        .min(2, "Tên phải có ít nhất 2 ký tự.")
        .max(50, "Tên tối đa 50 ký tự."),
      email: yup
        .string()
        .required("Email là bắt buộc.")
        .email("Email không đúng định dạng."),
      phone: yup
        .string()
        .required("Số điện thoại là bắt buộc.")
        .matches(/^(09|03|07|08|05)[0-9]{8}$/, "Số điện thoại không hợp lệ."),
      password: yup
        .string()
        .required("Mật khẩu là bắt buộc.")
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
      confirmPassword: yup
        .string()
        .required("Bạn cần nhập lại mật khẩu.")
        .oneOf([yup.ref("password")], "Mật khẩu nhập lại không khớp."),
    });

    return {
      registerSchema,
      showPassword: false,
      showConfirmPassword: false,
      successMessage: "",
    };
  },
  methods: {
    submitRegister(values, { resetForm }) {
      const confirmRegister = window.confirm("Bạn có muốn đăng ký không?");
      if (!confirmRegister) {
        return;
      }

      const existingUsers = JSON.parse(localStorage.getItem(REGISTER_STORAGE_KEY) || "[]");
      const existedEmail = existingUsers.some((user) => user.email === values.email);

      if (existedEmail) {
        alert("Email này đã được đăng ký. Vui lòng dùng email khác.");
        return;
      }

      existingUsers.push({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });

      localStorage.setItem(REGISTER_STORAGE_KEY, JSON.stringify(existingUsers));
      this.successMessage = "Đăng ký thành công. Bạn có thể dùng thông tin này để đăng nhập.";
      resetForm();
      this.showPassword = false;
      this.showConfirmPassword = false;
    },
  },
};
</script>