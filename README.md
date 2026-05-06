# 🏨 Smart Hostel Management System

Full-stack web application — Node.js + Express backend connected to a MySQL database, with the existing HTML/CSS/JS frontend.

---

## 📁 Project Structure

```
shms/
├── server.js              ← Express app entry point
├── db.js                  ← MySQL connection pool
├── seed.js                ← Seeds database with demo data
├── schema.sql             ← Full database schema + seed SQL
├── .env                   ← Environment variables (edit this first)
│
├── middleware/
│   └── auth.js            ← JWT authentication middleware
│
├── routes/
│   ├── auth.js            ← POST /api/auth/login, logout, me
│   ├── complaints.js      ← GET/POST /api/complaints, PUT /:id
│   ├── ragging.js         ← GET/POST /api/ragging, PUT /:id
│   ├── notices.js         ← GET/POST /api/notices, PUT/DELETE /:id
│   ├── menu.js            ← GET/POST /api/menu, PUT /:id
│   └── students.js        ← GET /api/students, profile, stats
│
└── public/
    └── smart_hostel.html  ← Frontend (API-connected)
```

---

## ⚙️ Setup Instructions

### 1. Install Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MySQL](https://dev.mysql.com/downloads/) 8.0+

### 2. Create the Database

```bash
mysql -u root -p < schema.sql
```

Or manually in MySQL Workbench / shell:
```sql
CREATE DATABASE smart_hostel_db;
```
Then run the full `schema.sql` content.

### 3. Configure Environment

Edit `.env` with your MySQL credentials:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=smart_hostel_db
JWT_SECRET=shms_super_secret_jwt_key_2025
JWT_EXPIRES_IN=24h
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Seed the Database

```bash
node seed.js
```

This creates users with properly hashed passwords and populates all tables.

### 6. Start the Server

```bash
node server.js
```

Open your browser at: **http://localhost:3000**

---

## 🔑 Demo Login Credentials

| Role    | Username  | Password  |
|---------|-----------|-----------|
| Student | `student` | `student` |
| Warden  | `warden`  | `warden`  |

---

## 📡 API Reference

All routes require `Authorization: Bearer <token>` except `/api/auth/login`.

### Auth
| Method | Endpoint           | Access  | Description          |
|--------|--------------------|---------|----------------------|
| POST   | /api/auth/login    | Public  | Login, returns JWT   |
| POST   | /api/auth/logout   | Any     | Logout (client-side) |
| GET    | /api/auth/me       | Any     | Get current user     |

### Complaints
| Method | Endpoint              | Access  | Description              |
|--------|-----------------------|---------|--------------------------|
| GET    | /api/complaints       | Any     | Student: own; Warden: all|
| POST   | /api/complaints       | Student | Submit new complaint     |
| PUT    | /api/complaints/:id   | Warden  | Update complaint status  |
| DELETE | /api/complaints/:id   | Warden  | Delete complaint         |

### Ragging Reports
| Method | Endpoint          | Access  | Description            |
|--------|-------------------|---------|------------------------|
| GET    | /api/ragging      | Warden  | View all reports       |
| POST   | /api/ragging      | Student | Submit ragging report  |
| PUT    | /api/ragging/:id  | Warden  | Update report status   |

### Notices
| Method | Endpoint          | Access  | Description         |
|--------|-------------------|---------|---------------------|
| GET    | /api/notices      | Any     | View all notices    |
| POST   | /api/notices      | Warden  | Post new notice     |
| PUT    | /api/notices/:id  | Warden  | Edit notice         |
| DELETE | /api/notices/:id  | Warden  | Delete notice       |

### Food Menu
| Method | Endpoint       | Access  | Description            |
|--------|----------------|---------|------------------------|
| GET    | /api/menu      | Any     | View full weekly menu  |
| POST   | /api/menu      | Warden  | Add/upsert menu entry  |
| PUT    | /api/menu/:id  | Warden  | Update menu entry      |

### Students
| Method | Endpoint                    | Access  | Description          |
|--------|-----------------------------|---------|----------------------|
| GET    | /api/students               | Warden  | All student profiles |
| GET    | /api/students/profile       | Student | Own profile          |
| PUT    | /api/students/profile       | Student | Update own profile   |
| GET    | /api/students/dashboard-stats | Student | Dashboard stats    |
| GET    | /api/students/warden-stats  | Warden  | Warden dashboard stats|

---

## 🛠️ Tech Stack

- **Frontend** — HTML5, CSS3, JavaScript (vanilla)
- **Backend**  — Node.js, Express.js
- **Database** — MySQL 8 via `mysql2`
- **Auth**     — JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`)
- **Config**   — `dotenv`, `cors`
