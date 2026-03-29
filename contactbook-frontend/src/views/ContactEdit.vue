<template>
  <div v-if="contact" class="page">
    <h4>Hiệu chỉnh Liên hệ</h4>
    <ContactForm 
      :contact="contact" 
      @submit:contact="updateContact"
      @delete:contact="deleteContact" 
    />
    <p>{{ message }}</p>
  </div>
</template>

<script>
import ContactForm from "@/components/ContactForm.vue";
import ContactService from "@/services/contact.service";

export default {
  components: {
    ContactForm,
  },
  props: {
    // Được truyền vào nhờ cấu hình props: true trong Vue Router
    id: { type: String, required: true },
  },
  data() {
    return {
      contact: null,
      message: "",
    };
  },
  methods: {
    // Tải dữ liệu contact dựa trên ID URL
    async getContact(id) {
      try {
        this.contact = await ContactService.get(id);
      } catch (error) {
        console.log(error);
        // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
        this.$router.push({
          name: "notfound",
          params: {
            pathMatch: this.$route.path.split("/").slice(1)
          },
          query: this.$route.query,
          hash: this.$route.hash,
        });
      }
    },
    
    // Xử lý sự kiện "submit:contact" từ ContactForm (nút Lưu)
    async updateContact(data) {
      try {
        await ContactService.update(this.contact._id, data);
        alert('Liên hệ được cập nhật thành công.');
        this.$router.push({ name: "contactbook" });
      } catch (error) {
        console.log(error);
      }
    },
    
    // Xử lý sự kiện "delete:contact" từ ContactForm (nút Xóa)
    async deleteContact() {
      if (confirm("Bạn muốn xóa Liên hệ này?")) {
        try {
          await ContactService.delete(this.contact._id);
          this.$router.push({ name: "contactbook" });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  created() {
    // Khi component khởi tạo, gọi fetch thông tin
    this.getContact(this.id);
    this.message = "";
  },
};
</script>
