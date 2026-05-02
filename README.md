# CyberSafe - Cybercrime Reporting and Phishing Detection System

CyberSafe is a full-stack web application where users can report cybercrime incidents and check suspicious URLs for phishing risk. Admin users can review all reports, filter cases, and update investigation status.

## 1. Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT token-based authentication

## 2. Complete Folder Structure

```text
CyberSafe/
├── client/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── api/
│       │   └── axios.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── pages/
│           ├── AdminDashboardPage.jsx
│           ├── HomePage.jsx
│           ├── LoginPage.jsx
│           ├── PhishingPage.jsx
│           ├── ReportPage.jsx
│           └── SignupPage.jsx
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── phishingController.js
│       │   └── reportController.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   └── errorMiddleware.js
│       ├── models/
│       │   ├── Report.js
│       │   └── User.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── phishingRoutes.js
│       │   └── reportRoutes.js
│       └── utils/
│           └── phishingUtils.js
├── .gitignore
└── README.md
```

## 3. Core Features Implemented

### 3.1 User Authentication

- Signup and login with JWT
- Password hashing using bcrypt
- Role-based users (`user`, `admin`)
- Protected backend routes via middleware

### 3.2 Cybercrime Report Form

- Fields included:
  - Name
  - Email
  - Incident Type (`phishing`, `fraud`, `harassment`, `identity_theft`, `other`)
  - Description
  - Optional URL/Phone
- Stores reports with default status `pending`

### 3.3 Admin Dashboard

- View all reports
- Filter by incident type and status
- Update status to `investigating` or `resolved`

### 3.4 Phishing Detection

- Input URL and evaluate risk
- Detection logic flags:
  - Suspicious top-level domains
  - Risky keywords in URL/domain
  - IP-based domains
  - Obfuscated patterns (`@`, too many subdomains, long domain)
- Returns risk score and reason list

### 3.5 Responsive Modern UI

- Clean layout with reusable cards/forms/buttons
- Responsive navbar and dashboard for desktop/mobile
- Protected frontend routes for report and admin pages

## 4. API Routes

Base URL: `http://localhost:5000/api`

### Auth

- `POST /auth/signup` - register new user
- `POST /auth/login` - login user
- `GET /auth/me` - get current user (protected)

### Reports

- `POST /reports` - create report (protected)
- `GET /reports/my` - get current user's reports (protected)
- `GET /reports` - get all reports (admin only, supports query `type`, `status`)
- `PATCH /reports/:id/status` - update report status (admin only)

### Phishing

- `POST /phishing/check-url` - analyze URL for phishing risk

## 5. Local Setup (Step-by-Step)

### Step 1: Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### Step 2: Configure environment variables

1. Create `server/.env` from `server/.env.example`
2. Create `client/.env` from `client/.env.example`

Example `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cybersafe
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@cybersafe.com
```

Example `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Start MongoDB

If local MongoDB is installed:

```bash
mongod
```

Or use MongoDB Atlas and set `MONGO_URI` accordingly.

### Step 4: Run backend

```bash
cd server
npm run dev
```

### Step 5: Run frontend

Open a second terminal:

```bash
cd client
npm run dev
```

### Step 6: Use the app

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## 6. How to Access Admin Dashboard

- Set `ADMIN_EMAIL` in `server/.env`.
- Signup using that same email.
- That account is assigned role `admin` automatically.
- Login and open `/admin`.

## 7. Suggested Next Improvements

- Add email verification and password reset
- Add pagination for admin reports
- Integrate ML/scanner APIs (VirusTotal, Google Safe Browsing)
- Add audit logs and SIEM integration
- Add automated tests (Jest + Supertest + React Testing Library)
