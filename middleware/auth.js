import { defineNuxtRouteMiddleware, useCookie, navigateTo } from "#app";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default defineNuxtRouteMiddleware((to, from) => {
	const token = useCookie("auth_token").value;

	// Redirect to login if no token is found
	if (!token) {
		return navigateTo("/login");
	}

	// Verify the token
	try {
		jwt.verify(token, JWT_SECRET);
	} catch (err) {
		// Redirect to login if token verification fails
		return navigateTo("/login");
	}
});
