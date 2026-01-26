import { readBody, getMethod, getQuery } from "h3";
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
	// Determine the HTTP method
	const method = getMethod(event);

	// Handle GET request to retrieve users or a single user by ID
	if (method === "GET") {
		const query = getQuery(event);
		const userId = query.id;

		try {
			if (userId) {
				const result = await pool.query("SELECT * FROM users WHERE id = $1", [
					userId,
				]);
				if (result.rows.length === 0) {
					event.res.statusCode = 404;
					return { error: "User not found" };
				}
				event.res.statusCode = 200;
				return { user: result.rows[0] };
			} else {
				const result = await pool.query("SELECT * FROM users");
				event.res.statusCode = 200;
				return { users: result.rows };
			}
		} catch (err) {
			event.res.statusCode = 500;
			return { error: err.message };
		}
	}

	// Handle POST request to add a new user
	if (method === "POST") {
		const { name, email, password } = await readBody(event);

		if (!name || !email || !password) {
			event.res.statusCode = 400;
			return { error: "Name, email, and password are required" };
		}

		try {
			const userId = uuidv4();

			const result = await pool.query(
				"INSERT INTO users (id, name, email, password, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
				[userId, name, email, password]
			);

			event.res.statusCode = 201; // Created
			return { user: result.rows[0] };
		} catch (err) {
			event.res.statusCode = 500;
			return { error: err.message };
		}
	}

	// Handle PUT request to update a user by ID
	if (method === "PUT") {
		const query = getQuery(event);
		const userId = query.id;
		const { name, email, password } = await readBody(event);

		if (!userId) {
			event.res.statusCode = 400;
			return { error: "User ID is required for update" };
		}

		try {
			const result = await pool.query(
				"UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password) WHERE id = $4 RETURNING *",
				[name, email, password, userId]
			);

			if (result.rows.length === 0) {
				event.res.statusCode = 404;
				return { error: "User not found" };
			}

			event.res.statusCode = 200; // OK
			return { user: result.rows[0] };
		} catch (err) {
			event.res.statusCode = 500;
			return { error: err.message };
		}
	}

	// Handle DELETE request to remove a user by ID
	if (method === "DELETE") {
		const query = getQuery(event);
		const userId = query.id;

		if (!userId) {
			event.res.statusCode = 400;
			return { error: "User ID is required for deletion" };
		}

		try {
			const result = await pool.query(
				"DELETE FROM users WHERE id = $1 RETURNING *",
				[userId]
			);

			if (result.rows.length === 0) {
				event.res.statusCode = 404;
				return { error: "User not found" };
			}

			event.res.statusCode = 200; // OK
			return { message: "User deleted successfully", user: result.rows[0] };
		} catch (err) {
			event.res.statusCode = 500;
			return { error: err.message };
		}
	}

	// Handle unsupported methods
	event.res.statusCode = 405; // Method Not Allowed
	return { error: "Method Not Allowed" };
});
