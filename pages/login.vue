<template>
	<div>
		
		<form
			@submit.prevent="login"
			class="border grid gap-4 border-1 p-10 m-10 border-gray-300"
		>
    <h1 class="text-start text-[24px]">Login</h1>
			<input
				class="border border-1 p-2"
				v-model="username"
				placeholder="Username"
				required
			/>
			<input
				class="border border-1 p-2"
				v-model="password"
				type="password"
				placeholder="Password"
				required
			/>
			<button
				class="border-1 border p-4 rounded-20 bg-gray-800 text-white cursor-pointer"
				type="submit"
			>
				Login
			</button>
			<p class="text-center text-red-600" v-if="error">{{ error }}</p>
			<div class="grid justify-items-end">
				<NuxtLink class="w-fit self-end underline cursor-pointer" to="/register"
					>New User Register Here</NuxtLink
				>
			</div>
		</form>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useFetch, useCookie } from "#app";

const username = ref("");
const password = ref("");
const error = ref("");

async function login() {
	try {
		const response = await $fetch("/api/auth/login", {
			method: "POST",
			body: { username: username.value, password: password.value },
		});

		if (response.error) {
			error.value = response.error;
		} else {
			useCookie("auth_token").value = response.token;
			navigateTo("/"); // Redirect to home page after login
		}
	} catch (err) {
		error.value = "Failed to login";
	}
}
</script>
