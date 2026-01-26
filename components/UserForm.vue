<template>
  <div>
    <form @submit.prevent="sendData" class="m-4 p-6 border-1 border border-gray-500">
      <p class="text-center text-[24px] font-semibold my-4">{{ isEditingData ? 'Update Existing User Details' : 'Enter New User Details' }}</p>
      <p v-if="formData.id" class="font-light text-sm">User ID: {{ formData.id }}</p>
      <input class="border border-1" v-model="formData.name" type="text" placeholder="Name" required />
      <input class="border border-1" v-model="formData.email" type="email" placeholder="Email" required />
      <input class="border border-1" v-model="formData.password" type="password" placeholder="Password" required />
      <button class="border-1 border p-4 rounded-20 bg-gray-800 text-white cursor-pointer" type="submit">
        {{ isEditingData ? 'Update Existing Details' : 'Create New User' }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({
        id: "",
        name: "",
        email: "",
        password: ""
      })
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'update'],
  data() {
    return {
      formData: {
        id: this.user.id || "",
        name: this.user.name || "",
        email: this.user.email || "",
        password: ""
      },
      isEditingData: this.isEditing // Local reactive variable for editing state
    };
  },
  watch: {
    // Watch for changes in the user prop to update formData
    user: {
      handler(newVal) {
        this.formData.id = newVal.id || "";
        this.formData.name = newVal.name || "";
        this.formData.email = newVal.email || "";
        this.formData.password = "";
      },
      deep: true,
      immediate: true
    },
    // Watch for changes in the isEditing prop
    isEditing(newVal) {
      this.isEditingData = newVal;
    }
  },
  methods: {
    // Emit data to the parent component
    sendData() {
      if (this.isEditingData) {
        console.log('Updating Existing User');
        this.$emit("update", { ...this.formData });
      } else {
        console.log('Creating New User');
        this.$emit("submit", { ...this.formData });
      }

      // Reset form fields after submission
      this.formData = { id: "", name: "", email: "", password: "" };
      this.isEditingData = false; // Reset editing state
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 8px;
}

button {
  padding: 10px;
  cursor: pointer;
}
</style>
