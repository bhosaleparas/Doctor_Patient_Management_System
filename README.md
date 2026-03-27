# 🏥 MediBook — Doctor Patient Management System

A full-stack web application for managing hospital appointments. Patients can discover hospitals, find doctors, and book appointments. Doctors manage their availability and track appointments. Admins oversee hospital operations and analytics.

---

## 📁 Project Structure

```
Doctor_Patient_Management_System/
├── backend/                 
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── jobs/
│   ├── prisma/schema.prisma
│   ├── index.js
│   └── .env
│
└── client/                   
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   ├── user/
    │   │   ├── doctor/
    │   │   └── admin/
    │   ├── pages/
    │   │   ├── public/
    │   │   ├── user/
    │   │   ├── doctor/
    │   │   └── admin/
    │   ├── services/
    │   ├── hooks/
    │   ├── context/
    │   ├── routes/
    │   ├── constants/
    │   └── utils/
    └── .env
```

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Flowbite |
| Backend   | Node.js, Express.js (ESM)           |
| Database  | PostgreSQL (Neon DB)                |
| ORM       | Prisma                              |
| Auth      | JWT (jsonwebtoken)                  |
| Charts    | Recharts                            |
| Password  | bcrypt                              |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database (or Neon DB)
- npm

---

### Backend Setup

```bash
# 1. Go to backend folder
cd Doctor_Patient_Management_System/backend

# 2. Install dependencies
npm install

# 3. Create .env file
touch .env
```

Add to `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
TZ=Asia/Kolkata
```

```bash
# 4. Push schema to database
npx prisma db push            # make sure db exists

# 5. Start backend
npm run dev
# Runs on http://localhost:8000
```

---

### Frontend Setup

```bash
# 1. Go to client folder
cd Doctor_Patient_Management_System/client

# 2. Install dependencies
npm install

# 3. Create .env file
touch .env
```

Add to `client/.env`:
```env
VITE_API_URL=http://localhost:8000
```

```bash
# 4. Start frontend
npm run dev
# Runs on http://localhost:5173
```

---

### CORS — Required Backend Config

Add to `backend/index.js` before all routes:

```js
import cors from 'cors';

app.use(cors({
  origin     : 'http://localhost:5173',
  credentials: true,
}));
```

```bash
npm install cors
```

---

## 🧪 Testing Guide (Postman + Browser)

Test in this exact order so data builds up correctly.

---

### Step 1 — Create Hospital

```
POST http://localhost:8000/hospital/create
Content-Type: application/json

{
  "name"   : "City Care Hospital",
  "address": "123 MG Road",
  "city"   : "Pune",
  "phone"  : "9876543210",
  "email"  : "citycare@hospital.com",
  "pincode": "411001"
}
```

**Response:**
```json
{
  "message": "Hospital created successfully",
  "hospital": {
    "id"  : 1,
    "name": "City Care Hospital",
    "slug": "city-care-hospital"
  }
}
```

> 📌 Note the `id` (1) and `slug` (city-care-hospital) — needed for next steps.

---

### Step 2 — Register Admin

```
POST http://localhost:8000/admin/register
Content-Type: application/json

{
  "username"  : "admin01",
  "password"  : "admin@123",
  "hospitalId": 1
}
```

---

### Step 3 — Admin Login

```
POST http://localhost:8000/admin/login
Content-Type: application/json

{
  "username": "admin01",
  "password": "admin@123"
}
```

**Save the token** from response — needed for adding doctors.

---

### Step 4 — Add Doctors (Admin)

Use admin token in Authorization header: `Bearer <token>`

**Doctor 1:**
```
POST http://localhost:8000/admin/doctors
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "username"      : "drramesh01",
  "email"         : "ramesh.sharma@hospital.com",
  "name"          : "Dr. Ramesh Sharma",
  "password"      : "doctor@123",
  "specialization": "Cardiology",
  "cabin"         : "A-101",
  "fee"           : 800,
  "gender"        : "Male",
  "hospitalId"    : 1
}
```

**Doctor 2:**
```json
{
  "username"      : "drpriya02",
  "email"         : "priya.mehta@hospital.com",
  "name"          : "Dr. Priya Mehta",
  "password"      : "doctor@123",
  "specialization": "Dermatology",
  "cabin"         : "B-202",
  "fee"           : 600,
  "gender"        : "Female",
  "hospitalId"    : 1
}
```

**Doctor 3:**
```json
{
  "username"      : "drarjun03",
  "email"         : "arjun.patel@hospital.com",
  "name"          : "Dr. Arjun Patel",
  "password"      : "doctor@123",
  "specialization": "Orthopedics",
  "cabin"         : "C-303",
  "fee"           : 1000,
  "gender"        : "Male",
  "hospitalId"    : 1
}
```

**Doctor 4:**
```json
{
  "username"      : "drsneha04",
  "email"         : "sneha.kulkarni@hospital.com",
  "name"          : "Dr. Sneha Kulkarni",
  "password"      : "doctor@123",
  "specialization": "Pediatrics",
  "cabin"         : "D-404",
  "fee"           : 700,
  "gender"        : "Female",
  "hospitalId"    : 1
}
```


---

### Step 5 — Doctor Login

```
POST http://localhost:8000/doctor/login
Content-Type: application/json

{
  "email"   : "ramesh.sharma@hospital.com",
  "password": "doctor@123"
}
```

**Save the doctor token.**

---

### Step 6 — Doctor Sets Availability

```
POST http://localhost:8000/doctor/availability
Authorization: Bearer <doctor_token>
Content-Type: application/json

{
  "date": "2026-04-01",
  "timeWindows": [
    { "startTime": "09:00", "endTime": "12:00" }
  ]
}
```

> This generates **6 slots**, each 30 minutes long.

---

### Step 7 — Register Patient

```
POST http://localhost:8000/user/register
Content-Type: application/json

{
  "name"    : "Paras Shah",
  "email"   : "paras@gmail.com",
  "password": "paras@123",
  "phone"   : "9876543210",
  "dob"     : "1995-06-15",
  "gender"  : "Male",
  "city"    : "Pune",
  "address" : "123 MG Road",
  "pincode" : "411001"
}
```

---

### Step 8 — Patient Login

```
POST http://localhost:8000/user/login
Content-Type: application/json

{
  "email"   : "paras@gmail.com",
  "password": "paras@123"
}
```

**Save the user token.**

---

### Step 9 — View Available Slots

```
GET http://localhost:8000/user/doctor/available/1?date=2026-04-01
Authorization: Bearer <user_token>
```

> Note the `id` of an available slot from the response.

---

### Step 10 — Book Appointment

```
POST http://localhost:8000/user/book
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "slotId"    : 3,
  "name"      : "Paras Shah",
  "patientAge": 30
}
```

---

### Step 11 — View My Appointments (Patient)

```
GET http://localhost:8000/user/my-appointments
Authorization: Bearer <user_token>
```

Filter by status:
```
GET http://localhost:8000/user/my-appointments?status=pending
GET http://localhost:8000/user/my-appointments?status=completed
GET http://localhost:8000/user/my-appointments?status=cancelled
```

---

### Step 12 — Cancel Appointment (Patient)

```
PATCH http://localhost:8000/user/cancel-appointment/1
Authorization: Bearer <user_token>
```

> ⚠️ Only works if appointment is more than 2 hours away.

---

### Step 13 — Doctor Views Appointments

```
GET http://localhost:8000/doctor/appointments
Authorization: Bearer <doctor_token>

# Filter by date
GET http://localhost:8000/doctor/appointments?date=2026-04-01

# Filter by status
GET http://localhost:8000/doctor/appointments?status=pending
```

---

### Step 14 — Doctor Marks Appointment Complete

```
PATCH http://localhost:8000/doctor/appointments/1/complete
Authorization: Bearer <doctor_token>
```

---

### Step 15 — Admin Analytics

```
GET http://localhost:8000/admin/analytics
Authorization: Bearer <admin_token>
```

---

## 🌐 All API Routes

### 🏥 Hospital
| Method | Route                        | Auth   | Description             |
|--------|------------------------------|--------|-------------------------|
| POST   | /hospital/create             | None   | Create hospital         |
| GET    | /hospital/all                | None   | Get all hospitals       |
| GET    | /hospital/search             | None   | Search by name/city     |
| GET    | /hospital/:slug              | None   | Get hospital by slug    |
| GET    | /hospital/:slug/doctors      | None   | Get hospital's doctors  |
| GET    | /hospital/city/:city         | None   | Get hospitals by city   |

### 👤 User (Patient)
| Method | Route                              | Auth        | Description              |
|--------|------------------------------------|-------------|--------------------------|
| POST   | /user/register                     | None        | Register patient         |
| POST   | /user/login                        | None        | Patient login            |
| GET    | /user/doctor/:id                   | User Token  | Get doctor by ID         |
| GET    | /user/doctor/available/:doctorId   | User Token  | Get available slots      |
| POST   | /user/book                         | User Token  | Book appointment         |
| GET    | /user/my-appointments              | User Token  | View my appointments     |
| PATCH  | /user/cancel-appointment/:id       | User Token  | Cancel appointment       |

### 👨‍⚕️ Doctor
| Method | Route                                  | Auth          | Description               |
|--------|----------------------------------------|---------------|---------------------------|
| POST   | /doctor/login                          | None          | Doctor login              |
| PATCH  | /doctor/password                       | Doctor Token  | Change password           |
| GET    | /doctor/appointments                   | Doctor Token  | View appointments         |
| PATCH  | /doctor/appointments/:id/complete      | Doctor Token  | Mark complete             |
| PATCH  | /doctor/appointments/:id/no-show       | Doctor Token  | Mark no show              |
| POST   | /doctor/availability                   | Doctor Token  | Set availability + slots  |
| GET    | /doctor/slots                          | Doctor Token  | View own slots            |
| PATCH  | /doctor/slot/:id/block                 | Doctor Token  | Block a slot              |
| PATCH  | /doctor/slot/:id/unblock               | Doctor Token  | Unblock a slot            |

### 🛡️ Admin
| Method | Route                           | Auth        | Description               |
|--------|---------------------------------|-------------|---------------------------|
| POST   | /admin/register                 | None        | Register admin            |
| POST   | /admin/login                    | None        | Admin login               |
| POST   | /admin/doctors                  | Admin Token | Add doctor                |
| GET    | /admin/doctors                  | Admin Token | Get all doctors           |
| PATCH  | /admin/doctors/:id/deactivate   | Admin Token | Deactivate doctor         |
| PATCH  | /admin/doctors/:id/reactivate   | Admin Token | Reactivate doctor         |
| GET    | /admin/users                    | Admin Token | Get all patients          |
| GET    | /admin/analytics                | Admin Token | Get analytics data        |

---

## 🖥️ Frontend Pages

| Page                  | URL                        | Role    |
|-----------------------|----------------------------|---------|
| Home                  | /                          | Public  |
| Register              | /register                  | Public  |
| Login                 | /login                     | Public  |
| Patient Dashboard     | /dashboard                 | Patient |
| Find Hospitals        | /hospitals                 | Patient |
| Hospital Detail       | /hospital/:slug            | Patient |
| Doctor Detail         | /doctors/:id               | Patient |
| Book Appointment      | /book/:doctorId            | Patient |
| My Appointments       | /my-appointments           | Patient |
| Doctor Dashboard      | /doctor/dashboard          | Doctor  |
| Doctor Appointments   | /doctor/appointments       | Doctor  |
| Manage Slots          | /doctor/slots              | Doctor  |
| Change Password       | /doctor/password           | Doctor  |
| Admin Dashboard       | /admin/dashboard           | Admin   |
| Manage Doctors        | /admin/doctors             | Admin   |
| Analytics             | /admin/analytics           | Admin   |
| 404 Not Found         | /*                         | All     |
| Unauthorized          | /unauthorized              | All     |

---

## 🔐 Authentication

JWT tokens are stored in `localStorage` and automatically attached to every API request via Axios interceptors.

Token payload contains:
```json
// Patient
{ "id": 1, "role": "user" }

// Doctor
{ "id": 1, "role": "doctor", "hospitalId": 1 }

// Admin
{ "id": 1, "role": "admin", "hospitalId": 1 }
```

---

## 📋 Appointment Status Flow

```
Created → [pending]
              │
    ┌─────────┼──────────┐
    ▼         ▼          ▼
[completed] [cancelled] [no_show]

- completed : Doctor marks after visit
- cancelled : Patient cancels (>2 hrs before)
- no_show   : Doctor marks if patient didn't show up
              OR auto-marked by cron job every 30 mins
```

---

## ⏰ Slot System

- Each slot = **30 minutes**
- Doctor sets time windows (e.g. 09:00–13:00, 15:00–17:00)
- System auto-generates slots for each window
- Slots can be: **Open** / **Booked** / **Blocked**
- Doctor can block/unblock individual open slots
- Booked slots cannot be blocked
- When appointment is cancelled, slot is freed back to Open

---

## 🚫 Business Rules

| Rule | Details |
|------|---------|
| Cancellation | Only allowed if appointment is > 2 hours away |
| Double booking | Only one appointment per doctor per day per patient |
| Past slots | Cannot book or create slots for past dates/times |
| Inactive doctors | Hidden from patient search |
| Mark complete | Only after slot end time has passed |
| Mark no show | Only after slot end time has passed |
| Concurrent booking | Row-level DB lock prevents double booking race conditions |

---

## 🗄️ Database Schema

```
Hospital ──< Admin
Hospital ──< Doctor ──< Slot ──< Appointment >── User
                   └──< DoctorAvailability ──< Slot
```

### Models
- **Hospital** — name, slug, address, city, phone, email, pincode
- **Admin** — username, password, hospitalId
- **User** — email, name, password, phone, dob, city, address, pincode, gender
- **Doctor** — username, email, name, password, specialization, cabin, fee, gender, status, hospitalId
- **DoctorAvailability** — doctorId, hospitalId, date (unique per doctor per day)
- **Slot** — doctorId, availabilityId, date, startTime, endTime, isBooked, isBlocked
- **Appointment** — userId, doctorId, slotId (unique), name, date, status, patientAge

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| CORS error | Missing cors middleware | Add `app.use(cors({ origin: 'http://localhost:5173' }))` |
| Login shows no error but stays | Backend not returning user object | Check response has `user/doctor/admin` key |
| Doctors not showing | `status: false` in DB | Reactivate via `PATCH /admin/doctors/:id/reactivate` |
| Slots not generating | Past date/time | Use future date and future time windows |
| patientAge required error | Validation bug | Remove `patientAge` from required check |
| Token expired | JWT expired | Login again to get new token |
| Hospital not found | Wrong slug | Check slug matches exactly from `/hospital/all` |

---

## 👨‍💻 Author

Built as a full-stack assignment project demonstrating:
- REST API design with Express.js
- Prisma ORM with PostgreSQL
- JWT-based role authentication (Patient / Doctor / Admin)
- Hospital-scoped multi-tenant architecture
- React component-based frontend with Vite
- Real-time slot management with race condition prevention
