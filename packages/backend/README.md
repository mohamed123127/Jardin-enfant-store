# Backend Setup Guide

Follow the steps below to set up the backend project on your local environment.

## Prerequisites

Before starting, make sure you have:

- Node.js (LTS version recommended)
- npm
- PostgreSQL installed and running

## Installation

1. Navigate to the backend project directory.

   ```bash
   cd backend
   ```

2. Install all project dependencies.

   ```bash
   npm install
   ```

3. Duplicate the environment file.

   ```bash
   cp .env.example .env.development
   ```

   > **Windows (PowerShell)**
   >
   > ```powershell
   > Copy-Item .env.example .env.development
   > ```

4. Open `.env.development` and configure your environment variables.

   Make sure to use **PostgreSQL** as your database and update the following values:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   ```

5. Create a PostgreSQL database with the same name specified in the `DB_NAME` variable.

6. Start the development server.

   ```bash
   npm run start:dev
   ```

   On the first run, the application will automatically create the database structure (tables, relations, etc.) and start the API server.

## Default API URL

Once the server is running, the API is available at:

```text
http://localhost:3000/api/v1
```

For example:

- `GET http://localhost:3000/api/v1/products`
- `POST http://localhost:3000/api/v1/attributes`
- `GET http://localhost:3000/api/v1/attribute-values/1`

## Seed the Database (Optional)

If you want to populate the database with fake data for testing or development, run:

```bash
npm run seed
```

## Run the migration

```bash
npm run migration:run
```

## You're Ready!

```bash
   npm run start:dev
   ```

The backend is now configured and ready for development.