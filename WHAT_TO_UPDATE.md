# 🔧 What You Need to Update - Action Checklist

## 📋 IMMEDIATE ACTIONS REQUIRED

### 1. ⚠️ UPDATE JWT_SECRET (CRITICAL)
**File:** `/home/navgurukul/Gym/GYM_Backend/.env`

**Current (INSECURE):**
```
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

**What to do:**
Generate a strong random secret. Run this command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Update .env to:**
```
JWT_SECRET=<paste_the_generated_secret_here>
```

**Example:**
```
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c03e33a8b3e43b77e3c2e8e7c3e8e7c3e8e7c3e8e7c3e8e7c3e8e7c3e
```

---

### 2. 🗄️ INSTALL MONGODB (REQUIRED)

**Status:** MongoDB is NOT installed on your system

**Option A - Automated (Recommended):**
```bash
cd /home/navgurukul/Gym/GYM_Backend
sudo ./install-mongodb.sh
```

**Option B - Manual Installation:**

For Ubuntu/Debian:
```bash
# 1. Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# 2. Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 3. Update package list
sudo apt-get update

# 4. Install MongoDB
sudo apt-get install -y mongodb-org

# 5. Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 6. Verify it's running
sudo systemctl status mongod
```

**Verify MongoDB is running:**
```bash
sudo systemctl status mongod
# Should show "active (running)"
```

---

### 3. 🌱 SEED THE DATABASE

**After MongoDB is running**, populate initial data:

```bash
cd /home/navgurukul/Gym/GYM_Backend
npm run seed
```

**This creates:**
- ✅ Default admin account
  - Email: `admin@gym.com`
  - Password: `admin123`
- ✅ Three membership plans:
  - Quarterly (3 months) - ₹3,000
  - Half Yearly (6 months) - ₹5,500
  - Yearly (12 months) - ₹10,000

---

### 4. 🚀 RESTART BACKEND SERVER

**Stop current server** (if running):
```bash
# Press Ctrl+C in the terminal where server is running
```

**Start with MongoDB connection:**
```bash
cd /home/navgurukul/Gym/GYM_Backend
npm start
```

**Expected output:**
```
Loaded env from ./.env
🔗 MongoDB Connected: localhost
🚀 Server running on port 4000
```

---

## 🔒 SECURITY UPDATES (Before Production)

### 5. Change Default Admin Password

**After first login, immediately change the password!**

**Current default:**
- Email: `admin@gym.com`
- Password: `admin123` ⚠️ **CHANGE THIS!**

**How to change:**
1. Login to admin panel (when frontend is ready)
2. Go to profile settings
3. Update password to something strong

**Or update directly in MongoDB:**
```bash
mongosh gym_management
db.admins.updateOne(
  { email: "admin@gym.com" },
  { $set: { password: "your-new-password" } }
)
# Note: This won't be hashed, better to change through the app
```

---

### 6. Update FRONTEND_URL (When Deploying)

**File:** `/home/navgurukul/Gym/GYM_Backend/.env`

**Current (for local development):**
```
FRONTEND_URL=http://localhost:5174
```

**Update when deploying to:**
```
FRONTEND_URL=https://your-actual-domain.com
```

---

## ✅ TESTING YOUR SETUP

### Test 1: Check MongoDB Connection
```bash
cd /home/navgurukul/Gym/GYM_Backend
npm start
```
**Look for:** `🔗 MongoDB Connected: localhost`

### Test 2: Login as Admin
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gym.com","password":"admin123"}'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Admin",
    "email": "admin@gym.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test 3: Get Dashboard Stats (with token)
```bash
# Copy the token from Test 2 response
curl http://localhost:4000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalMembers": 0,
      "activeSubscriptions": 0,
      "expiredSubscriptions": 0,
      "totalPlans": 3,
      ...
    }
  }
}
```

### Test 4: Get All Plans (public route)
```bash
curl http://localhost:4000/api/plans
```

**Expected response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "name": "Quarterly",
      "duration": 3,
      "price": 3000,
      ...
    }
  ]
}
```

---

## 🎨 FRONTEND UPDATES NEEDED

### Update Contact Form Component

**File:** `/home/navgurukul/Gym/GYM_MERN_Frontend-1/src/components/Contact.jsx`

**Current:** Only sends email via `/send/mail`

**Update to ALSO save in database:**

```javascript
// In the sendMail function, add this BEFORE or AFTER the email call:

// Save to database
await axios.post('http://localhost:4000/api/contacts', {
  name,
  email,
  message
});

// Then still send email
await axios.post('http://localhost:4000/send/mail', {
  name,
  email,
  message
});
```

---

### Create Environment Variable File

**File:** `/home/navgurukul/Gym/GYM_MERN_Frontend-1/.env`

**Create this file:**
```env
VITE_API_BASE_URL=http://localhost:4000
VITE_API_URL=http://localhost:4000/api
```

---

### Update axios Configuration

**File:** `/home/navgurukul/Gym/GYM_MERN_Frontend-1/src/service/axios.config.js`

**Already done!** ✅ This file uses environment variables

---

## 📝 SUMMARY CHECKLIST

### Backend Setup:
- [ ] Generate and update JWT_SECRET in .env
- [ ] Install MongoDB (`sudo ./install-mongodb.sh`)
- [ ] Start MongoDB (`sudo systemctl start mongod`)
- [ ] Run database seeder (`npm run seed`)
- [ ] Restart backend server (`npm start`)
- [ ] Verify "MongoDB Connected" message appears
- [ ] Test admin login with curl
- [ ] Test dashboard stats endpoint

### Frontend Updates:
- [ ] Create .env file with VITE_API_BASE_URL
- [ ] Update Contact.jsx to save to database
- [ ] Create admin login page (new)
- [ ] Create admin dashboard page (new)
- [ ] Add protected routes wrapper (new)
- [ ] Connect "Join Now" to /api/members (new)

### Security (Before Production):
- [ ] Change admin password from admin123
- [ ] Update FRONTEND_URL to production domain
- [ ] Enable MongoDB authentication
- [ ] Add rate limiting middleware
- [ ] Review and remove console.logs

---

## 🆘 TROUBLESHOOTING

### MongoDB won't start
```bash
# Check status
sudo systemctl status mongod

# Check logs
sudo journalctl -u mongod

# Restart
sudo systemctl restart mongod
```

### "Cannot connect to MongoDB"
```bash
# Verify MongoDB is running
sudo systemctl status mongod

# Check if port 27017 is listening
sudo netstat -tulpn | grep 27017

# Try connecting with mongosh
mongosh
```

### "JWT must be provided" error
- Make sure you're sending the Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`
- Token should start with `eyJ`

### CORS errors
- Check FRONTEND_URL in .env matches your frontend port
- For development, any localhost port should work
- Check browser console for exact error

---

## 📞 NEXT STEPS AFTER SETUP

1. **Test all backend endpoints** using the curl commands above
2. **Create frontend admin pages**:
   - Login page (`/admin/login`)
   - Dashboard (`/admin/dashboard`)
   - Member management (`/admin/members`)
   - Subscription management (`/admin/subscriptions`)
3. **Connect existing UI**:
   - Link "Join Now" buttons to member registration
   - Update pricing cards to use /api/plans
   - Update contact form to save in database
4. **Deploy to production** when ready

---

**Priority Order:**
1. **Generate JWT_SECRET** (2 minutes) ⚠️
2. **Install MongoDB** (5-10 minutes) ⚠️
3. **Run seeder** (30 seconds)
4. **Restart server** (30 seconds)
5. **Test with curl** (2 minutes)
6. **Then start frontend work**

Good luck! 🚀
