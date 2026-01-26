import { readBody } from "h3";
import jwt from "jsonwebtoken";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
	host: process.env.DB_HOST || "localhost",
	port: process.env.DB_PORT || 5432,
	user: process.env.DB_USER || "myuser",
	password: process.env.DB_PASSWORD || "mysecretpassword",
	database: process.env.DB_NAME || "mydatabase",
});

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default eventHandler(async (event) => {
	const { username, password } = await readBody(event);

	// Validate inputs
	if (!username || !password) {
		event.res.statusCode = 400;
		return { error: "Username and password are required" };
	}

	try {
		// Fetch user from the database by username
		const result = await pool.query("SELECT * FROM users WHERE name = $1", [
			username,
		]);
		const user = result.rows[0];

		// Check if user exists
		if (!user) {
			event.res.statusCode = 404;
			return { error: "Invalid username" };
		}

		// Compare the plain text password with the stored plain password
		if (password !== user.password) {
			event.res.statusCode = 401;
			return { error: "Invalid password" };
		}

		// Generate a JWT token upon successful login
		const token = jwt.sign({ id: user.id, username: user.name }, JWT_SECRET, {
			expiresIn: "1h",
		});

		return { token };
	} catch (err) {
		console.error("Error during login:", err);
		event.res.statusCode = 500;
		return { error: "Failed to login" };
	}
});
