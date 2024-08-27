# BookHaven

BookHaven is a modern web app for book lovers to buy, sell, and explore books.

## Features

- **Book Management**: Upload, edit, and manage books.
- **User Authentication**: Secure login/signup with Firebase.
- **Responsive Design**: Optimized for all devices.
- **Search & Filter**: Search by title and filter by categories.
- **Customer Reviews**: Display reviews using Swiper.

## Technologies

- **Frontend**: React, Vite, Tailwind CSS, Flowbite, NextUI
- **Backend**: Express, MongoDB
- **Auth**: Firebase
- **Icons**: React Icons
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/bookhaven.git
    cd bookhaven
    ```

2. Install dependencies:
    ```sh
    cd client
    npm install
    cd ../server
    npm install
    ```

### Running the App

1. Start the backend:
    ```sh
    cd server
    npm start
    ```

2. Start the frontend:
    ```sh
    cd ../client
    npm run dev
    ```

3. Open `http://localhost:3000`.

## Project Structure

### Client

- **Components**: Reusable UI components
- **Pages**: Main pages (e.g., `Home.jsx`, `Shop.jsx`)
- **Dashboard**: Admin components (e.g., `EditBook.jsx`)
- **Assets**: Images and icons
- **Styles**: CSS and Tailwind config

### Server

- **index.js**: Main server file
- **Routes**: API endpoints

## Configuration

### Firebase

Configure in `client/src/Firebase/firebase.config.js`.

### MongoDB

Set up in `server/index.js`.

## Scripts

### Client

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint

### Server

- `npm start`: Start backend server
