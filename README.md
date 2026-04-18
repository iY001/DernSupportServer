# DernSupport - Backend API

> Professional Support Management System Backend API built with Express.js, Prisma, and MongoDB

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Security](#security)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

DernSupport Backend is a robust, scalable RESTful API for managing support tickets, problems, and user interactions. It includes AI-powered chat functionality, image handling, and comprehensive user management.

## Features

✅ User authentication and authorization with JWT  
✅ Ticket management system  
✅ Problem reporting and solutions  
✅ Reply/Comment system  
✅ Image upload and retrieval  
✅ AI-powered chat support (OpenAI, Cohere, HuggingFace)  
✅ Role-based access control (Admin/User)  
✅ Email notifications  
✅ Rate limiting for security  
✅ Comprehensive error handling  
✅ Request logging  
✅ CORS support  
✅ Helmet security headers  
✅ Request compression  

## Tech Stack

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js 4.x
- **Database**: MongoDB (with Prisma ORM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **File Upload**: Multer
- **Email**: Nodemailer
- **AI APIs**: OpenAI, Cohere, HuggingFace
- **Security**: Helmet, express-rate-limit
- **Dev Tools**: ESLint, Prettier, Nodemon

## Prerequisites

- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- MongoDB account (MongoDB Atlas recommended)
- Gmail account with app-specific password
- OpenAI API key (for AI features)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd Backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate
```

## Configuration

1. **Create .env file** from .env.example:

```bash
cp .env.example .env
```

2. **Update .env with your credentials**:

```env
DATABASE_URL="your_mongodb_connection_string"
JWT_SECRET="your_super_secret_key"
OPENAI_API_KEY="your_openai_key"
# ... other configurations
```

3. **Initialize Prisma database**:

```bash
npm run prisma:migrate
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT)

### Available Scripts

```bash
npm run start              # Start production server
npm run dev               # Start development server with auto-reload
npm run lint              # Check code quality
npm run lint:fix          # Fix linting issues
npm run format            # Format code with Prettier
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio
```

## API Documentation

### Health Check
```
GET /health
Response: { success: true, data: { status: "OK" } }
```

### Authentication Endpoints

#### Sign Up
```
POST /user/signup
Body: { email, password, name, phone }
```

#### Sign In
```
POST /user/signin
Body: { email, password }
Response: { token, user: { id, email, name, role } }
```

#### Forgot Password
```
POST /user/forgotPassword
Body: { email }
```

#### Reset Password
```
POST /user/resetPassword
Body: { token, password, confirmPassword }
```

### Ticket Endpoints (Protected)

```
GET    /tickets/getAllTickets      # Get all tickets
POST   /tickets/postTicket         # Create ticket
GET    /tickets/:id                # Get ticket by ID
PUT    /tickets/:id                # Update ticket
DELETE /tickets/:id                # Delete ticket
POST   /tickets/solveTicket/:id    # Mark ticket as solved
```

### Problem Endpoints

```
GET    /problems/getAllProblems    # Get all problems
POST   /problems/postProblem       # Post new problem
GET    /problems/:id               # Get problem by ID
DELETE /problems/:id               # Delete problem
POST   /problems/sendSolution/:id  # Send solution
```

### Reply Endpoints (Protected)

```
GET    /replies/getAllReplies      # Get all replies
POST   /replies/postReply          # Create reply
GET    /replies/getByTicketId/:id  # Get replies for ticket
PUT    /replies/:id                # Update reply
DELETE /replies/:id                # Delete reply
```

### Image Endpoints

```
POST   /images/addImage            # Upload image
GET    /images/getImage/:id        # Get image
```

### AI Chat Endpoint

```
POST   /aichat/chat                # Send message to AI
Body: { message, model }
```

## Project Structure

```
Backend/
├── config/                 # Configuration files
│   └── environment.js     # Environment variables validation
├── middleware/            # Express middlewares
│   ├── errorHandler.js    # Global error handler
│   ├── responseHandler.js # Response formatter
│   ├── addPhoto.js        # Image upload
│   ├── checkAuthorized.js # JWT verification
│   └── adminMWPremission.js # Admin check
├── routes/                # API routes
│   ├── User.js
│   ├── Tickets.js
│   ├── Replies.js
│   ├── Problems.js
│   ├── Images.js
│   └── aiChat.js
├── services/              # Business logic
│   ├── User/
│   ├── Ticket/
│   ├── Problems/
│   ├── Relpy/
│   ├── Images/
│   └── aiChatController.js
├── prisma/                # Database schema
│   └── schema.prisma
├── Validators/            # Input validation
├── utils/                 # Utility functions
│   └── logger.js         # Logging system
├── logs/                  # Application logs
├── .env                   # Environment variables (local)
├── .env.example          # Environment template
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
├── index.js              # Server entry point
└── package.json          # Dependencies
```

## Error Handling

The API uses a standardized error response format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### HTTP Status Codes

- **200**: OK
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **429**: Too Many Requests
- **500**: Internal Server Error

## Security

- **Helmet**: Sets security HTTP headers
- **CORS**: Restricts cross-origin requests
- **Rate Limiting**: Prevents brute-force attacks
- **JWT**: Secure token-based authentication
- **bcrypt**: Password hashing and salting
- **Input Validation**: Joi for request validation
- **Environment Variables**: Sensitive data protection

### Best Practices

1. Never commit `.env` file (use `.env.example`)
2. Keep dependencies updated
3. Use strong JWT secrets
4. Enable HTTPS in production
5. Regularly backup database
6. Monitor error logs

## Development

### Code Quality

```bash
# Check code quality
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Database Management

```bash
# View database UI
npm run prisma:studio

# Create new migration
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Environment Variables in Production

Set these in your hosting platform's environment settings:
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `GOOGLE_APP_PASSWORD`
- `NODE_ENV=production`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details

## Support

For support, email: support@dernsupport.com

---

**Last Updated**: April 2024  
**Version**: 1.0.0
