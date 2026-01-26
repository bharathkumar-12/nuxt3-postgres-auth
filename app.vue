

<template>
  <div>
    <h1 class="text-center text-[24px] font-semibold ">Nuxt 3 / Postgres / Docker</h1>
   
      <div class="grid justify-items-end mx-10 gap-4">
				<NuxtLink class="w-fit self-end underline cursor-pointer" to="/register"
					>New User Register Here</NuxtLink
				>
			</div>
    <NuxtPage />
  </div>
</template>
<script setup>
import { v4 as uuidv4 } from "uuid";
definePageMeta({
  middleware: 'auth',
});

</script>
<style scoped>
h1 {
  color: #333;
}
</style>
