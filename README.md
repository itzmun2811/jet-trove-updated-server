Jet_Trove Server

## Project Purpose
The backend server for Jet_Trove, a tour package booking platform that handles user authentication, tour package management by guides, booking processing, and secure data storage. The server exposes RESTful APIs to support the client application, enabling dynamic interactions such as package CRUD, user booking, and admin control.

## Features
-User Authentication & Authorization using Firebase tokens

-CRUD operations on tour packages (Add, Update, Delete, View)

-Booking management for authenticated users

-Role-based access control to differentiate guides and regular users

-Data storage using MongoDB for packages and bookings

-Secure API endpoints with token verification

-Filtering and search by email or package details

## Live URL -


## Tech Stack
-Node.js — JavaScript runtime environment

-Express.js — Web framework for building RESTful APIs

-MongoDB — NoSQL database for storing packages and bookings

-Firebase Admin SDK — For user authentication and token verification

-dotenv — Environment variable management

## Used NPM Packages
-Core Packages
express — Fast, minimal web framework for Node.js

-mongodb — Official MongoDB driver for Node.js

-firebase-admin — Firebase admin SDK for backend authentication

-dotenv — Load environment variables from .env file

## Middleware & Utilities
-cors — Cross-Origin Resource Sharing middleware

-body-parser — Parse incoming request bodies (JSON support)

-nodemon (devDependency) — Automatically restarts server during development

