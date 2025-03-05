# Profindly

Profindly is a healthcare platform that connects patients with specialists across various fields such as medicine, mental health, physical health, nutrition, and more. The platform allows users to find specialists based on their needs, book appointments, and manage their healthcare journey.

## Features

- User authentication and authorization
- Specialist profiles with detailed information
- Patient profiles and management
- Appointment booking and scheduling
- Data seeding for initial setup
- Email notifications for user interactions

## Installation

To install dependencies:

```bash
bun install
```

## Running the Project

To start the server:

```bash
bun run src/server.ts
```

To run in development mode with hot reloading:

```bash
bun run dev
```

To seed the database with initial data:

```bash
bun run src/data/seed.ts
```

## Environment Variables

Ensure you have a `.env` file with the following variables:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT
- `MAILGUN_API_KEY`: API key for Mailgun
- `MAILGUN_DOMAIN`: Domain for Mailgun
- `MAILGUN_DOMAIN_FROM`: From email address for Mailgun
- `AWS_S3_BUCKET_NAME`: S3 bucket name
- `AWS_S3_REGION`: S3 region
- `AWS_ACCESS_KEY_ID`: AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key

## Project Structure

- `src/config`: Configuration files
- `src/constants`: Constant values
- `src/controllers`: Route controllers
- `src/data`: Seed data
- `src/middleware`: Middleware functions
- `src/models`: Mongoose models
- `src/routes`: Express routes
- `src/schema`: Zod schemas for validation
- `src/services`: Service functions
- `src/types`: TypeScript types
- `src/server.ts`: Entry point of the application

This project was created using `bun init` in bun v1.1.42. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.