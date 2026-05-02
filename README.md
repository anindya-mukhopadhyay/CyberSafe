# CyberSafe - Cybercrime Reporting and Phishing Detection System

CyberSafe is a full-stack web app that lets citizens report cyber incidents, scan suspicious URLs for phishing risk, and track case progress. Admin users get a command-center dashboard for filtering, searching, and resolving reports.

## 1. Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + role-based route protection

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
│       │   ├── CyberBackdrop.jsx
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── pages/
│           ├── AdminDashboardPage.jsx
│           ├── HomePage.jsx
│           ├── LoginPage.jsx
│           ├── MyCasesPage.jsx
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

## 3. Core Features

### 3.1 Authentication

- Signup and login with JWT
- Password hashing with bcrypt
- Role-based access (`user`, `admin`)

### 3.2 Cybercrime Reporting

- Submit incidents with:
  - Name
  - Email
  - Incident type
  - Description
  - Optional URL/phone
- Automatic severity scoring (`low`, `medium`, `high`, `critical`)
- Status history tracking (`pending`, `investigating`, `resolved`)

### 3.3 Admin Command Center

- Dashboard KPI cards (total, pending, investigating, resolved, critical, last 24h)
- Search + filter by type/status/severity
- Update report status to investigating/resolved
- Tactical snapshot of top incident type

### 3.4 Phishing Detection

- URL input scanner endpoint
- Flags suspicious TLDs, keywords, obfuscation patterns, IP domains
- Returns score + reasons + suspicious flag

### 3.5 UI/UX Enhancements

- Police-style cyber command-center theme
- Animated hacking background (grid + scanline + binary rain)
- Responsive mobile/desktop layouts
- My Cases page for users to track their submitted reports

## 4. API Routes

Base URL: `http://localhost:5000/api`

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me` (protected)

### Reports

- `POST /reports` (protected)
- `GET /reports/my` (protected)
- `GET /reports/overview` (admin only)
- `GET /reports` (admin only, query: `type`, `status`, `severity`, `q`)
- `PATCH /reports/:id/status` (admin only)

### Phishing

- `POST /phishing/check-url`

## 5. Local Setup (Step-by-Step)

### Step 1: Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### Step 2: Create env files

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Step 3: Configure backend env

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cybersafe
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@cybersafe.com
```

### Step 4: Start MongoDB

- Local MongoDB: run `mongod`
- Or use MongoDB Atlas URI in `MONGO_URI`

### Step 5: Run backend

```bash
cd server
npm run dev
```

### Step 6: Run frontend

Open a second terminal:

```bash
cd client
npm run dev
```

### Step 7: Use the app

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## 6. Admin Access Setup

- Set `ADMIN_EMAIL` in `server/.env`.
- Signup using the same email.
- That user is automatically assigned `admin` role.
- Login and open `/admin`.

## 7. Validation Done

- Frontend production build successful
- Backend syntax checks passed

## 8. Next Upgrade Ideas

- Evidence upload (screenshots/documents)
- Email alerts for status changes
- Pagination + CSV export for admin reports
- Integrate external threat intelligence APIs
- Add automated tests (Jest/Supertest/RTL)
