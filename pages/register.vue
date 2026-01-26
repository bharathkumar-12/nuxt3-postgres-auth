<template>
  <div>
    
    <form @submit.prevent="register" class="grid gap-4 border border-1 border-gray-500 p-6 m-10">
      <h1 class="text-start text-[24px]">Register</h1>
      <input class="border border-1 p-2" v-model="name" placeholder="Username" required />
      <input class="border border-1 p-2" v-model="password" type="password" placeholder="Password" required />
      <button class="border-1 border p-4 rounded-20 bg-gray-800 text-white cursor-pointer" type="submit">Register</button>
      <div class="grid justify-items-end">
				<NuxtLink class="w-fit self-end underline cursor-pointer" to="/login"
					>Login Here</NuxtLink
				>
			</div>
    </form>
    <p class="text-center text-red-300" v-if="error">{{ error }}</p>
    <p class="text-center text-green-300" v-if="successMessage">{{ successMessage }} </p>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('');
const password = ref('');
const error = ref('');
const successMessage = ref('');

async function register() {
  try {
    // Make a POST request to the register API endpoint
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: name.value, password: password.value },
    });

    if (response.error) {
      error.value = response.error; // Display error if registration fails
    } else {
      successMessage.value = 'Registration successful! You can now log in.';
      name.value = '';
      password.value = '';
    }
  } catch (err) {
    error.value = 'Failed to register. Please try again.';
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: auto;
}

input {
  margin-bottom: 10px;
  padding: 8px;
}

button {
  padding: 8px;
}
</style>
