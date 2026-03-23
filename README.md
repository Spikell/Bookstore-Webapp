# BookHaven (MERN Bookstore)

BookHaven is a full-stack bookstore application built with React + Vite on the frontend and Express + MongoDB on the backend. It includes browsing, search/filtering, cart-related Firebase integration, and dashboard book management.

## Features

- Browse all books with category and title filtering
- View single-book details
- Dashboard flows for upload, edit, and delete
- Firebase authentication integration
- Firestore/Storage integration for user/cart-related flows
- Responsive UI with Tailwind CSS and Flowbite

## Tech Stack

- Frontend: React 18, Vite, React Router, Tailwind CSS, Flowbite
- Backend: Node.js, Express
- Database: MongoDB (`BookInventory` / `books`)
- Auth + Cloud: Firebase (Auth, Firestore, Storage)

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas connection string
- Firebase project credentials

## Quick Start

1. Install dependencies:

```bash
cd server
npm install
cd ../client
npm install
```

2. Run backend (terminal 1):

```bash
cd server
npm run dev
```

3. Run frontend (terminal 2):

```bash
cd client
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`).

## Database Notes

Use MongoDB Atlas for your cluster and create a database user + network access before connecting.
For full setup details, follow the official Atlas guide:
https://www.mongodb.com/docs/atlas/

## API Testing / Data Upload

You can test and seed endpoints with Postman or any API client.

## Available Scripts

### `server/`

- `npm start` - Run server with Node
- `npm run dev` - Run server with Nodemon

### `client/`

- `npm run dev` - Start Vite dev server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
