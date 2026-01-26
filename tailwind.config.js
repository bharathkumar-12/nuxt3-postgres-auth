/** @type {import('tailwindcss').Config} */
export default {
	content: [],
	theme: {
		extend: {},
	},
	plugins: [],
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./app.vue",
		"./error.vue",
	],
};

