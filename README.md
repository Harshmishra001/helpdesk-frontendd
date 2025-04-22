# Helpdesk Web Application

A MERN stack Helpdesk Web Application for managing customer support tickets.

## Features

- User authentication and role-based access control (Customer, Agent, Admin)
- Ticket management system
- Customer management
- Dashboard with statistics (Admin only)
- Responsive design

## Tech Stack

- **Frontend**: React, React Router, Formik, Yup, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## User Roles

### Customer
- Self-register and create account
- Submit new support tickets
- Add notes/replies to existing tickets
- View list of all their tickets

### Customer Service Agent
- View all tickets from all customers
- Add notes/replies to any ticket
- Update the status of any ticket

### Admin
- All agent capabilities
- Manage user profiles and create new ones
- Access dashboard with system statistics

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Setup

1. Clone the repository
```
git clone <repository-url>
cd helpdesk-app
```

2. Install server dependencies
```
cd server
npm install
```

3. Install client dependencies
```
cd ../client
npm install
```

4. Create a .env file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

## Running the Application

1. Start the server
```
cd server
npm run dev
```

2. Start the client
```
cd ../client
npm run dev
```

3. Access the application at http://localhost:5173

## API Endpoints

### Authentication
- POST /api/users/register - Register a new user
- POST /api/users/login - Login user

### Users
- GET /api/users/me - Get current user
- GET /api/users - Get all users (Admin only)
- GET /api/users/:id - Get user by ID (Admin only)
- PUT /api/users/:id - Update user (Admin only)
- POST /api/users - Create new user (Admin only)

### Tickets
- GET /api/tickets - Get all tickets
- GET /api/tickets/:id - Get ticket by ID
- POST /api/tickets - Create new ticket
- PUT /api/tickets/:id - Update ticket
- POST /api/tickets/:id/notes - Add note to ticket
- GET /api/tickets/stats - Get dashboard stats (Admin only)

## License

This project is licensed under the MIT License.
