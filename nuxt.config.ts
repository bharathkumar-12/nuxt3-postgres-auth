// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	router: {
		middleware: ["auth"],
	},
	css: ["~/assets/css/main.css"],
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: ["@pinia/nuxt"],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});