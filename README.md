# CyberSafe - Cybercrime Reporting and Phishing Detection System

CyberSafe is a full-stack web app that lets citizens report cyber incidents, scan suspicious URLs for phishing risk, upload evidence, and track case progress. Admin users get a police-style command center for live monitoring, filtering, search, and case resolution.

## 1. Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Realtime: Socket.IO
- Auth: JWT + role-based route protection
- Email alerts: Nodemailer (SMTP)
- File uploads: Multer

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
│   ├── uploads/
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   ├── db.js
│       │   └── socket.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── phishingController.js
│       │   └── reportController.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── errorMiddleware.js
│       │   └── uploadMiddleware.js
│       ├── models/
│       │   ├── Report.js
│       │   └── User.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── phishingRoutes.js
│       │   └── reportRoutes.js
│       └── utils/
│           ├── emailService.js
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
  - Optional evidence files (`.png`, `.jpg`, `.jpeg`, `.webp`, `.pdf`, `.txt`)
- Automatic severity scoring (`low`, `medium`, `high`, `critical`)
- Status history tracking (`pending`, `investigating`, `resolved`)

### 3.3 Admin Command Center

- Dashboard KPI cards (total, pending, investigating, resolved, critical, last 24h)
- Search + filter by type/status/severity/keyword
- Update report status to investigating/resolved
- Tactical snapshot of top incident type
- Live dashboard updates via WebSocket events

### 3.4 Phishing Detection

- URL input scanner endpoint
- Flags suspicious TLDs, keywords, obfuscation patterns, IP domains
- Returns score + reasons + suspicious flag

### 3.5 User Case Tracking

- My Cases page with live status updates
- Evidence file links visible on case cards

### 3.6 Notifications

- Optional SMTP-based email alerts:
  - Admin email when a new report is filed
  - Reporter email when case status changes

### 3.7 UI/UX Enhancements

- Police-style cyber command-center theme
- Animated hacking background (grid + scanline + binary rain)
- Responsive desktop/mobile layouts

## 4. API Routes

Base URL: `http://localhost:5000/api`

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me` (protected)

### Reports

- `POST /reports` (protected, multipart form data, field name: `evidenceFiles`)
- `GET /reports/my` (protected)
- `GET /reports/overview` (admin only)
- `GET /reports` (admin only, query: `type`, `status`, `severity`, `q`)
- `PATCH /reports/:id/status` (admin only)

### Phishing

- `POST /phishing/check-url`

### Static Evidence

- `GET /uploads/:filename`

## 5. Realtime Events (Socket.IO)

Server emits:
- `reports:updated` for new reports and status updates

Client joins:
- Admin room: `dashboard:join`
- User room: `cases:join` with user id

## 6. Local Setup (Step-by-Step)

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

ENABLE_EMAIL_ALERTS=false
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=CyberSafe <no-reply@cybersafe.com>
```

### Step 4: Configure frontend env

Edit `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 5: Start MongoDB

- Local MongoDB: run `mongod`
- Or use MongoDB Atlas URI in `MONGO_URI`

### Step 6: Run backend

```bash
cd server
npm run dev
```

### Step 7: Run frontend

Open a second terminal:

```bash
cd client
npm run dev
```

### Step 8: Use the app

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## 7. Admin Access Setup

- Set `ADMIN_EMAIL` in `server/.env`
- Signup using the same email
- That user is automatically assigned `admin` role
- Login and open `/admin`

## 8. Validation Done

- Frontend production build successful
- Backend syntax checks passed
- Backend runtime dependencies audited with `npm audit --omit=dev` (0 vulnerabilities)
