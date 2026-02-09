# 🚀 QUICK START GUIDE - Do These 5 Things NOW

## 1️⃣ UPDATE JWT_SECRET (30 seconds)

**Open file:** `/home/navgurukul/Gym/GYM_Backend/.env`

**Find this line:**
```
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

**Replace with:**
```
JWT_SECRET=df362a554165ecba1ad78ec63cd6b418ba8168eb7e8600117de50b11caf0ba80e0b49518e671b52bc841fb7aefa11a7003685789ca2a690bcec37385f9de285f
```

---

## 2️⃣ INSTALL MONGODB (5 minutes)

**Run this ONE command:**
```bash
sudo /home/navgurukul/Gym/GYM_Backend/install-mongodb.sh
```

**Or if that doesn't work, run these:**
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Verify:**
```bash
sudo systemctl status mongod
# Should say "active (running)"
```

---

## 3️⃣ SEED DATABASE (30 seconds)

```bash
cd /home/navgurukul/Gym/GYM_Backend
npm run seed
```

**You should see:**
```
✅ Default admin created (email: admin@gym.com, password: admin123)
✅ Default plans created (Quarterly, Half Yearly, Yearly)
✅ Database seeded successfully!
```

---

## 4️⃣ RESTART BACKEND (30 seconds)

**Stop current server** (Ctrl+C in the terminal where it's running)

**Then start:**
```bash
cd /home/navgurukul/Gym/GYM_Backend
npm start
```

**You should see:**
```
Loaded env from ./.env
🔗 MongoDB Connected: localhost
🚀 Server running on port 4000
```

---

## 5️⃣ TEST IT WORKS (2 minutes)

**Test login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gym.com","password":"admin123"}'
```

**You should get a response with a token:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Admin",
    "email": "admin@gym.com",
    "token": "eyJhbGci..."
  }
}
```

**Test getting plans (public route):**
```bash
curl http://localhost:4000/api/plans
```

**You should see 3 plans:**
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

## ✅ DONE!

Your backend is now ready! 

**Default credentials:**
- **Email:** admin@gym.com
- **Password:** admin123

**⚠️ IMPORTANT:** Change this password after first login!

---

## 📱 WHAT'S WORKING NOW

### ✅ Public API Endpoints (No login needed):
- `GET /api/plans` - Get all membership plans
- `POST /api/members` - Create new member (Join Now button)
- `POST /api/contacts` - Submit contact form
- `POST /api/auth/login` - Admin login

### ✅ Protected API Endpoints (Need JWT token):
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/members` - List all members
- `GET /api/subscriptions` - List all subscriptions
- `POST /api/subscriptions` - Create subscription
- And 20+ more endpoints!

---

## 🎨 FRONTEND TODO (Next Phase)

Create these new pages:

1. **Admin Login** (`/admin/login`)
   - Email/password form
   - Call: `POST /api/auth/login`
   - Store JWT token in localStorage

2. **Admin Dashboard** (`/admin/dashboard`)
   - Show stats from: `GET /api/dashboard/stats`
   - Display: total members, revenue, active subscriptions

3. **Member Management** (`/admin/members`)
   - Table showing all members
   - Add/Edit/Delete buttons
   - Call: `/api/members` endpoints

4. **Update Existing Pages:**
   - Contact form → ALSO save to database: `POST /api/contacts`
   - Join Now button → Call: `POST /api/members`
   - Pricing section → Fetch from: `GET /api/plans`

---

## 🆘 IF SOMETHING GOES WRONG

### MongoDB not starting?
```bash
sudo systemctl status mongod
sudo journalctl -u mongod  # Check logs
sudo systemctl restart mongod
```

### Seeder fails?
Make sure MongoDB is running first!
```bash
sudo systemctl start mongod
# Then try again
npm run seed
```

### Server won't start?
Check for errors in terminal. Common issues:
- MongoDB not running
- Port 4000 already in use
- Missing .env file

### Can't login?
Make sure you ran the seeder first:
```bash
npm run seed
```

---

**That's it! Follow these 5 steps and you're ready to build the frontend! 🎉**
