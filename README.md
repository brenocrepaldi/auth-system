
# Authentication and Authorization API

This project provides a Node.js API with authentication and authorization functionalities, built using TypeScript. It serves as a starting point for building secure and robust APIs.

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

Replace `<endpoint>` with the actual path for each route.

- `GET  /user`  
  Description: Home route. Accessible only to logged-in users.
  
- `POST /user/register`  
  Description: Registers a new user.
  
- `POST /user/login`  
  Description: Logs in a user and returns a JWT token (if successful).
  
- `GET  /user/logout`  
  Description: Logs out the user and adds them to the blacklist.
  
- `GET  /user/admin`  
  Description: Admin route. Accessible only to admin users.

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
