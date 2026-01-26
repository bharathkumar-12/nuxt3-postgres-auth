import { readBody } from "h3";
import { v4 as uuidv4 } from "uuid";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
	host: process.env.DB_HOST || "localhost",
	port: process.env.DB_PORT || 5432,
	user: process.env.DB_USER || "myuser",
	password: process.env.DB_PASSWORD || "mysecretpassword",
	database: process.env.DB_NAME || "mydatabase",
});

// Function to initialize the database and create the "users" table if it doesn't exist
async function initializeDatabase() {
	try {
		await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
		console.log("Table 'users' is ready.");
	} catch (err) {
		console.error("Error creating 'users' table:", err.message);
	}
}

// Run database initialization before request handling
initializeDatabase()
	.then(() => {
		console.log("Database initialized successfully.");
	})
	.catch((err) => {
		console.error("Failed to initialize database:", err.message);
	});

export default eventHandler(async (event) => {
	const { name, password } = await readBody(event);

	// Validate inputs
	if (!name || !password) {
		event.res.statusCode = 400;
		return { error: "Username and password are required" };
	}

	try {
		// Generate a unique ID for the user
		const userId = uuidv4();

		// Log to verify ID and password
		console.log("Generated UUID:", userId);
		console.log("Plain Password:", password);

		// Insert the user with the generated UUID and plain password
		const result = await pool.query(
			"INSERT INTO users (id, name, password) VALUES ($1, $2, $3) RETURNING *",
			[userId, name, password]
		);

		event.res.statusCode = 201; // Created
		return { user: result.rows[0] };
	} catch (err) {
		console.error(
			"Detailed Error during registration:",
			err.message,
			err.stack
		);
		event.res.statusCode = 500; // Internal Server Error

		// Handle unique constraint violation for email
		if (err.code === "23505") {
			return { error: "Username already exists" };
		}

		return { error: err.message || "Failed to register user" };
	}
});
