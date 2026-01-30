# Store Rating Web App

This is a full-stack web application where users can rate stores. The platform supports three types of users: Admin, Normal User, and Store Owner, each with different functionalities and dashboards. It’s built using React.js for the frontend, Node.js (Express) for the backend, and MySQL for the database. Styling is done using Bootstrap.

# Features

## Admin

1. Can add new stores and users (normal users and store owners).
2. Dashboard shows total users, total stores, and total ratings.
3. Can view and filter lists of users and stores.
4. Assign a store to a store owner when creating it.
5. Sorting and searching available on all tables.

## Normal User

1. Can sign up, log in, and update password.
2. Can view all stores and submit or update ratings (1–5).
3. Search stores by name and address.
4. See their own submitted ratings alongside the store’s overall rating.

## Store Owner

1. Can log in and update password.
2. Dashboard shows users who rated their store.
3. Can see the average rating of their store.

## Form Validations

1. Name: 20–60 characters
2. Address: Maximum 400 characters
3. Email: Standard email format
4. Password: 8–16 characters, at least 1 uppercase letter and 1 special character
5. Ratings: Only 1 to 5 allowed

## Tech Stack

1. Frontend: React.js, Bootstrap
2. Backend: Node.js, Express.js
3. Database: MySQL
4. Authentication: JWT
5. API Calls: Axios

## Setup Instructions

Backend

Go to the server folder:
cd server

Install dependencies:
npm install

Create a .env file in the server folder:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=store_rating
JWT_SECRET=your_secret

Start the server:
node server.js
or
nodemon server.js

Frontend

Go to the client folder:
cd client

Install dependencies:
npm install

Start the React app:
npm run dev

Database Setup
schema.sql

### Admin Test Credentials (for testing)
Email: admin1@example.com
Password: Admin@123!

## How It Works

1. Admin logs in → can add users and stores, assign stores to store owners.
2. Normal users sign up → can view stores and submit ratings.
3. Store owners log in → can view ratings for their store and see the average score.
4. All tables support sorting and searching, and all forms have validation to ensure correct data.

### Project Structure
root/
  client/      
  server/        
  .gitignore
  README.md
