
# Node.js Starter Template

This repository serves as a starter template for Node.js projects, pre-configured with essential libraries and tools to kickstart your development process.

## Features
- **Environment Variables**: Managed using [`dotenv`](https://www.npmjs.com/package/dotenv).
- **Development Workflow**: Automatic server reloads with [`nodemon`](https://www.npmjs.com/package/nodemon).
- **Web Server**: Built using [`express`](https://www.npmjs.com/package/express).
- **Data Validation**: Schema validation powered by [`zod`](https://www.npmjs.com/package/zod).
- **Type Safety**: Implemented with [`typescript`](https://www.npmjs.com/package/typescript).

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for package management.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/brenocrepaldi/nodejs-starter-template
   cd nodejs-starter-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for environment variables based on the `.env.example` provided.

### Development

Run the development server:
```bash
npm run dev
```

### Scripts

- `npm run dev`: Starts the server with `nodemon`.
- `npm run build`: Compiles TypeScript files into JavaScript.
- `npm start`: Runs the compiled JavaScript files.

## Project Structure

```plaintext
├── src/
│   ├── server.ts       # Main entry point
│   ├── routes/         # Define application routes
│   ├── models/         # Data models and validation schemas
│   ├── db/             # Database connection and handling
├── .env.example        # Example environment configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project metadata and scripts
```

