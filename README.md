# Nuxt 3 User Management App

A full-stack user management application built with Nuxt 3, PostgreSQL, and Docker. Features user authentication, CRUD operations, and JWT-based authorization.

## ✨ Features

- 🔐 **User Authentication** - Login and registration with JWT tokens
- 👥 **User Management** - Complete CRUD operations for user accounts
- 🐳 **Docker Support** - Containerized application with PostgreSQL
- 🎨 **Tailwind CSS** - Modern, responsive UI styling
- 📦 **Pinia State Management** - Centralized user state management
- 🔔 **Toast Notifications** - User feedback with Vue3 Toastify
- 🛡️ **Protected Routes** - Middleware-based authentication guards

## 🚀 Tech Stack

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS
- **Backend**: Nuxt Server API Routes
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **State Management**: Pinia
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 18+ or Docker
- PostgreSQL (if running locally without Docker)

## 🛠️ Installation

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd nuxt-latest/task
```

2. Start the application with Docker Compose:

```bash
docker-compose up -d
```

3. Access the application at `http://localhost:3000`

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Set up PostgreSQL database and configure environment variables:

```bash
# Create a .env file
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mysecretpassword
DB_NAME=mydatabase
JWT_SECRET=your_jwt_secret
```

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser

## 📁 Project Structure

```
task/
├── assets/css/          # Global styles
├── components/          # Vue components
│   └── UserForm.vue    # User CRUD form
├── middleware/          # Route middleware
│   └── auth.js         # Authentication guard
├── pages/              # Application pages
│   ├── index.vue       # Home page
│   ├── login.vue       # Login page
│   └── register.vue    # Registration page
├── plugins/            # Nuxt plugins
│   └── vue3-toastify.ts
├── server/             # Server API routes
│   └── api/
│       ├── users.js    # User CRUD endpoints
│       └── auth/
│           ├── login.js     # Login endpoint
│           └── register.js  # Registration endpoint
├── stores/             # Pinia stores
│   └── user.js        # User state management
├── docker-compose.yml  # Docker configuration
└── Dockerfile         # Container definition
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users

- `GET /api/users` - Get all users
- `GET /api/users?id={id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users?id={id}` - Update user
- `DELETE /api/users?id={id}` - Delete user

## 🔐 Authentication Flow

1. Users register or login through the UI
2. Server validates credentials and issues a JWT token
3. Token is stored in cookies and used for subsequent requests
4. Protected routes check for valid token via middleware
5. Expired tokens redirect users to login page

## 🐳 Docker Setup

The application uses Docker Compose to orchestrate:

- **nuxt-app**: The Nuxt 3 application container
- **postgres**: PostgreSQL database container

Both containers run on a shared network for seamless communication.

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Nuxt 3](https://nuxt.com/)
- UI styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [PostgreSQL](https://www.postgresql.org/)

---

## Maintenance

Last maintenance update: <!--LAST_UPDATED-->2026-05-31<!--/LAST_UPDATED-->
