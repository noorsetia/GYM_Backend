# Gym Management System - Backend

A comprehensive MERN-based Gym Management System backend with MongoDB, JWT authentication, member management, subscription tracking, and admin dashboard.

## Features

### Authentication & Authorization
- ✅ Admin login using email + password
- ✅ JWT-based authentication
- ✅ Protected routes middleware

### Member Management
- ✅ Create member (public - from "Join Now" button)
- ✅ View all members (admin only)
- ✅ View member details (admin only)
- ✅ Update member (admin only)
- ✅ Delete member (admin only)

### Subscription Management
- ✅ Create subscription for members
- ✅ View all subscriptions
- ✅ View active subscriptions
- ✅ View expired subscriptions
- ✅ Auto-expiry tracking
- ✅ Subscription history by member

### Plan Management
- ✅ Create membership plans (Quarterly, Half Yearly, Yearly)
- ✅ View all plans (public)
- ✅ Update plans (admin only)
- ✅ Delete plans (admin only)

### Contact Management
- ✅ Contact form submissions (public)
- ✅ Store submissions in database
- ✅ View all contacts (admin only)
- ✅ Mark as read/replied

### Admin Dashboard
- ✅ Overview statistics (members, subscriptions, revenue)
- ✅ Revenue analytics
- ✅ Member growth statistics
- ✅ Expiring subscriptions alerts
- ✅ Recent activities

### Additional Features
- ✅ Email notifications (SMTP)
- ✅ BMI Calculator
- ✅ CORS configuration
- ✅ Data validation

## Tech Stack

- **Runtime**: Node.js v20.19.6
- **Framework**: Express.js v4.21.2
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcryptjs
- **Validation**: express-validator
- **Email**: nodemailer
- **Environment**: dotenv

## Installation

### Prerequisites

1. **Node.js** (v14 or higher)
   ```bash
   node --version
   ```

2. **MongoDB** (v4.4 or higher)
   
   **For Ubuntu/Debian:**
   ```bash
   # Import MongoDB public key
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   
   # Add MongoDB repository
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   
   # Update package list
   sudo apt-get update
   
   # Install MongoDB
   sudo apt-get install -y mongodb-org
   
   # Start MongoDB service
   sudo systemctl start mongod
   
   # Enable MongoDB to start on boot
   sudo systemctl enable mongod
   
   # Check status
   sudo systemctl status mongod
   ```
   
   **For macOS:**
   ```bash
   # Using Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```
   
   **For Windows:**
   - Download MongoDB from https://www.mongodb.com/try/download/community
   - Follow installation wizard
   - MongoDB will run as a service

### Setup Steps

1. **Clone or navigate to the repository**
   ```bash
   cd /home/navgurukul/Gym/GYM_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `.env` file with your settings:
   ```env
   PORT=4000
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   
   # SMTP Configuration (for email)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SERVICE=gmail
   SMTP_MAIL=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/gym_management
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=30d
   ```

4. **Seed initial data**
   ```bash
   npm run seed
   ```
   
   This will create:
   - Default admin account (email: admin@gym.com, password: admin123)
   - Three default plans (Quarterly, Half Yearly, Yearly)

5. **Start the server**
   ```bash
   npm start
   ```
   
   Server will run on http://localhost:4000

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new admin (for first admin)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin profile (protected)

### Member Routes (`/api/members`)
- `POST /api/members` - Create member (public - from Join Now button)
- `GET /api/members` - Get all members (protected)
- `GET /api/members/:id` - Get single member (protected)
- `PUT /api/members/:id` - Update member (protected)
- `DELETE /api/members/:id` - Delete member (protected)

### Plan Routes (`/api/plans`)
- `GET /api/plans` - Get all active plans (public)
- `GET /api/plans/:id` - Get single plan (public)
- `POST /api/plans` - Create plan (protected)
- `PUT /api/plans/:id` - Update plan (protected)
- `DELETE /api/plans/:id` - Delete plan (protected)

### Subscription Routes (`/api/subscriptions`)
- `GET /api/subscriptions` - Get all subscriptions (protected)
- `GET /api/subscriptions/active` - Get active subscriptions (protected)
- `GET /api/subscriptions/expired` - Get expired subscriptions (protected)
- `GET /api/subscriptions/member/:memberId` - Get member subscriptions (protected)
- `GET /api/subscriptions/:id` - Get single subscription (protected)
- `POST /api/subscriptions` - Create subscription (protected)
- `PUT /api/subscriptions/:id` - Update subscription (protected)
- `DELETE /api/subscriptions/:id` - Delete subscription (protected)

### Contact Routes (`/api/contacts`)
- `POST /api/contacts` - Submit contact form (public)
- `GET /api/contacts` - Get all contacts (protected)
- `GET /api/contacts/unread` - Get unread contacts (protected)
- `GET /api/contacts/:id` - Get single contact (protected)
- `PUT /api/contacts/:id/read` - Mark as read (protected)
- `PUT /api/contacts/:id/replied` - Mark as replied (protected)
- `DELETE /api/contacts/:id` - Delete contact (protected)

### Dashboard Routes (`/api/dashboard`)
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)
- `GET /api/dashboard/revenue` - Get revenue statistics (protected)
- `GET /api/dashboard/member-growth` - Get member growth statistics (protected)

### Legacy Routes (kept for backward compatibility)
- `POST /send/mail` - Send contact email
- `GET /mail/verify` - Verify SMTP configuration
- `POST /calculate-bmi` - Calculate BMI

## Data Models

### Admin
- name, email, password (hashed with bcrypt)

### Member
- name, email, phone, age, gender, height, weight, address, emergencyContact

### Plan
- name, duration (months), price, description, features, isActive

### Subscription
- member (ref), plan (ref), startDate, endDate, status (active/expired), paymentMethod, amountPaid

### Contact
- name, email, message, isRead, repliedAt

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

To get a token, login via `/api/auth/login`:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gym.com","password":"admin123"}'
```

## Testing the API

### 1. Login as Admin
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gym.com","password":"admin123"}'
```

### 2. Get Dashboard Stats (with token)
```bash
curl http://localhost:4000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Create a Member
```bash
curl -X POST http://localhost:4000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "age": 25,
    "gender": "Male",
    "height": 175,
    "weight": 70,
    "address": "123 Main St",
    "emergencyContact": "9876543210"
  }'
```

### 4. Get All Plans (public)
```bash
curl http://localhost:4000/api/plans
```

## Project Structure

```
GYM_Backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── memberController.js  # Member CRUD
│   ├── planController.js    # Plan CRUD
│   ├── subscriptionController.js
│   ├── contactController.js
│   └── dashboardController.js
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── Admin.js             # Admin schema
│   ├── Member.js            # Member schema
│   ├── Plan.js              # Plan schema
│   ├── Subscription.js      # Subscription schema
│   └── Contact.js           # Contact schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── members.js           # Member routes
│   ├── plans.js             # Plan routes
│   ├── subscriptions.js     # Subscription routes
│   ├── contacts.js          # Contact routes
│   └── dashboard.js         # Dashboard routes
├── utils/
│   ├── sendEmail.js         # Email utility
│   └── generateToken.js     # JWT token generator
├── app.js                   # Express app configuration
├── seed.js                  # Database seeder
├── .env                     # Environment variables
└── package.json             # Dependencies
```

## NPM Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "seed": "node seed.js"
  }
}
```

## Security Notes

- ⚠️ **Change default admin password** after first login
- ⚠️ **Update JWT_SECRET** to a strong random string in production
- ⚠️ **Enable MongoDB authentication** in production
- ⚠️ **Use environment-specific .env files** (don't commit to git)
- ⚠️ **Implement rate limiting** for production

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running: `sudo systemctl status mongod`
- Check MongoDB URI in `.env` file
- Verify port 27017 is not in use: `sudo netstat -tulpn | grep 27017`

### JWT Token Issues
- Ensure JWT_SECRET is set in `.env`
- Check token expiry (default 30 days)
- Verify token format: `Bearer <token>`

### CORS Errors
- Check FRONTEND_URL in `.env`
- For development, localhost ports are auto-allowed
- For production, set exact frontend URL

## Next Steps

1. ✅ Install MongoDB and start service
2. ✅ Run database seeder: `npm run seed`
3. ✅ Start backend server: `npm start`
4. 🔄 Update frontend to use new API endpoints
5. 🔄 Create admin login page
6. 🔄 Build admin dashboard UI
7. 🔄 Connect "Join Now" buttons to member registration

## License

MIT
