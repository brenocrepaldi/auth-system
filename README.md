
# Authentication and Authorization API

This API provides secure authentication and authorization functionality for users, using industry-standard practices. Built with Node.js and TypeScript, it is designed to manage user registration, login, and access control with ease.

## Key Features:
- **JWT Authentication:** Each user, upon successful login, receives a JSON Web Token (JWT) which is used to authenticate requests. The token is sent with each subsequent request and allows the server to validate the user's identity.

- **Cookie-Based Authorization:** To maintain session integrity, the API utilizes cookies for storing JWTs. This enables secure and seamless re-authentication with each new request, without the need for the user to repeatedly log in.

- **User Blacklisting on Logout:** When a user logs out, the server adds their JWT to a blacklist to prevent it from being used in future requests. This ensures that the user's session is terminated and the token is no longer valid.

## Features

- Environment Variables: Managed using [`dotenv`](https://www.npmjs.com/package/dotenv).
- Development Workflow: Automatic server reloads with [`nodemon`](https://www.npmjs.com/package/nodemon).
- Web Server: Built using [`express`](https://www.npmjs.com/package/express).
- Data Validation: Schema validation powered by [`zod`](https://www.npmjs.com/package/zod).
- Type Safety: Implemented with [`typescript`](https://www.npmjs.com/package/typescript).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for package management.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/brenocrepaldi/auth-system
   cd auth-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for environment variables with the following variables:
   ```bash
   DATABASE_STRING: Your MongoDB connection string
   PORT: The port on which your API will run (default: 5005)
   SECRET_ACCESS_TOKEN: A unique secret key for generating JWT tokens (highly recommended to keep this secure)
   SECRET_REFRESH_TOKEN: A unique secret key for generating JWT tokens (highly recommended to keep this secure)
   ```

### Development

Run the development server:
```bash
npm run dev
```

### Scripts

- `npm run dev`: Starts the server with `nodemon`.
- `npm run build`: Compiles TypeScript files into JavaScript.
- `npm start`: Runs the compiled JavaScript files.

## API Routes

Below is the detailed documentation for the available API routes. Replace `<endpoint>` with your server's domain or base URL.

---

### `GET /`
- **Description:** Home page.
- **Authentication:** Requires a valid JWT token in the header or cookie.
- **Successful Response:**
  - **Status:** 200 OK
- **Possible Errors:**
  - 401 Unauthorized: If the token is missing or invalid.

---

### `POST /register`
- **Description:** Registers a new user in the application.
- **Authentication:** Not required.
- **Request:**
  - **Body:** JSON object with the required fields.
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string",
    }
    ```
- **Successful Response:**
  - **Status:** 201 Created
  - **Body:** JSON object with user details.
- **Possible Errors:**
  - 400 Bad Request: If required fields are missing or invalid.

---

### `POST /login`
- **Description:** Logs in a user and returns an access token and refresh token if successful.
- **Authentication:** Not required.
- **Request:**
  - **Body:** JSON object with the following fields.
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
- **Successful Response:**
  - **Status:** 200 OK
  - **Body:** 
    ```json
    {
      "status": "success",
      "message": "User logged in."
    }
    ```
  - **Cookies:** `access_token` and `refresh_token` are set.
- **Possible Errors:**
  - 401 Unauthorized: If email or password is incorrect.
  - 500 Internal Server Error: In case of unexpected errors.

---

### `GET /logout`
- **Description:** Logs out the user by adding their access token to the blacklist.
- **Authentication:** Requires a valid JWT token.
- **Successful Response:**
  - **Status:** 200 OK
  - **Body:** 
    ```json
    {
      "status": "success",
      "message": "User logged out."
    }
    ```
- **Possible Errors:**
  - 401 Unauthorized: If the token is missing or invalid.

---

### `GET /admin`
- **Description:** Admin-only route. Accessible only to users with admin privileges.
- **Authentication:** Requires a valid JWT token and admin privileges.
- **Successful Response:**
  - **Status:** 200 OK
  - **Body:** JSON object with admin-specific information.
- **Possible Errors:**
  - 401 Unauthorized: If the token is missing or invalid.
  - 403 Forbidden: If the user is not an admin.

---

### `POST /refresh`
- **Description:** Generates a new access token using a valid refresh token.
- **Authentication:** Requires a valid refresh token.
- **Request:**
  - **Cookies:** Must include a `refresh_token`.
- **Successful Response:**
  - **Status:** 200 OK
- **Possible Errors:**
  - 401 Unauthorized: If the refresh token is missing, invalid, or expired.
  - 500 Internal Server Error: In case of unexpected errors.

---

### Notes
- All responses are in JSON format.
- Authentication tokens are managed using cookies (`httpOnly`, `secure`, `sameSite: None`).
- Ensure proper error handling and token management on the client side.


## Project Structure

```plaintext
├── src/
│   ├── controllers/    # Controllers
│   ├── db/             # Database connection and handling
│   ├── middlewares/    # Middlewares
│   ├── models/         # Data models and validation schemas
│   ├── routes/         # Define application routes
│   ├── env.ts          # Handles environment variables
│   ├── server.ts       # Main entry point
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project metadata and scripts
```
