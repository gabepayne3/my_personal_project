📰 NC News Backend (https://my-personal-project-nh77.onrender.com/api <<<< please find my hosted API)
Overview

This project is part of the Northcoders Full Stack Bootcamp, focusing on building a RESTful API for a news application. The API serves as the backend for a Reddit-style platform, allowing users to interact with articles, comments, topics, and users. The project emphasizes Test-Driven Development (TDD), efficient error handling, and adherence to RESTful principles.
GitHub+2mezzdavies.co.uk+2GitHub+2
GitHub
Technologies Used

    Node.js (v18.7.0)

    Express.js

    PostgreSQL

    node-postgres (pg)

    Jest (for testing)

    Supertest (for endpoint testing)

Setup Instructions
Prerequisites

    Node.js (v18.7.0 or higher)

    PostgreSQL (Ensure it's installed and running)

Installation

    Clone the repository:

    Then cd into the repository

    Install dependencies:

    npm install

    Set up environment variables:

    Create two .env files in the root directory:

        .env.development

        .env.test

    Each file should contain:

    PGDATABASE=nc_news
               nc_news_test

    Create databases:

    npm run setup-dbs

    Run tests:

    npm test

    Start the server:

    npm start

The API provides the following endpoints:

    GET /api
        Serves up a JSON representation of all available endpoints.

    GET /api/topics
        Returns an array of all topics.

    GET /api/articles
        Returns an array of all articles.

    GET /api/articles/:article_id
        Returns a specific article by ID.

    PATCH /api/articles/:article_id
        Updates the votes of a specific article.

    GET /api/articles/:article_id/comments
        Returns all comments for a specific article.

    POST /api/articles/:article_id/comments
        Adds a new comment to a specific article.

    DELETE /api/comments/:comment_id
        Deletes a specific comment by ID.

    GET /api/users
        Returns an array of all users.

    GET /api/users/:username
        Returns a specific user by username.

Each endpoint includes comprehensive error handling and validation to ensure robust and reliable API interactions.
Tasks Completed (Up to Task 14)

    Project Setup:

        Initialized the project with npm init.

        Installed necessary dependencies: express, pg, dotenv, jest, supertest.

        Configured environment variables for development and testing environments.

    Database Configuration:

        Set up PostgreSQL databases for development and testing.

        Created tables for topics, articles, users, and comments.

        Established relationships between tables using foreign keys.

    Seeding the Database:

        Developed seed scripts to populate the database with test data.

        Ensured data integrity and consistency across related tables.

    API Development:

        Built RESTful endpoints for all required routes.

        Implemented controllers and models to handle business logic and database interactions.

        Ensured endpoints return appropriate HTTP status codes and messages.

    Testing:

        Wrote comprehensive tests for all endpoints using Jest and Supertest.

        Achieved high test coverage to ensure reliability.

    Error Handling:

        Implemented middleware to handle custom errors and unexpected issues.

        Ensured consistent error responses across all endpoints.

    Code Quality:

        Followed best practices for code structure and organization.

        Maintained a clean and readable codebase

