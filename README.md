# 🚀 TukTracer API

A **Real-Time Three-Wheeler (Tuk-Tuk) Tracking System** built with Node.js, Express, Prisma, and PostgreSQL.
This system simulates and manages GPS-based tracking of tuk-tuks across Sri Lanka with secure APIs and reporting capabilities.

---

## 🌐 Live Deployment

🔗 **API Base URL**
https://tuktracer-api.onrender.com

📄 **Swagger Documentation**
https://tuktracer-api.onrender.com/api-docs

---

## 🔐 Test Credentials

```json
{
  "email": "hqadmin@tuktracer.lk",
  "password": "Admin@123"
}
```

---

## 📌 Key Features

### 🚖 Tuk-Tuk Management

* Create, update, delete tuk-tuks
* Assign drivers and devices
* Track operational status (ACTIVE / INACTIVE / SUSPENDED)

### 👨‍✈️ Driver & Device Management

* Register drivers with NIC & license validation
* Secure device registration with API keys
* Device-to-vehicle assignment

### 📍 Real-Time Tracking

* GPS location ping ingestion
* Latest location retrieval
* Live tracking across regions

### 🕒 Location History

* Retrieve movement history using date filters
* Supports time-based tracking for analysis

### 🗺️ Regional Filtering

* Filter tuk-tuks by:

  * Province
  * District
  * Police station

### 📊 Reporting APIs

* System summary (counts, stats)
* Province & district-level summaries
* Inactive vehicle detection

### 🔐 Security

* JWT Authentication
* Role-based access control (Admin / Police)

---

## 🧠 System Architecture

The application follows a **layered architecture**:

```txt
Routes → Controllers → Services → Prisma ORM → PostgreSQL (Neon)
```

### Explanation:

* **Routes** → Define API endpoints
* **Controllers** → Handle HTTP requests/responses
* **Services** → Contain business logic
* **Prisma** → ORM for database interaction
* **Database** → PostgreSQL hosted on Neon

This separation improves:

* Maintainability
* Scalability
* Testability

---

## 🛠️ Tech Stack

| Technology | Usage             |
| ---------- | ----------------- |
| Node.js    | Backend runtime   |
| Express.js | API framework     |
| PostgreSQL | Database          |
| Prisma     | ORM               |
| Neon       | Cloud database    |
| Render     | Deployment        |
| JWT        | Authentication    |
| Swagger    | API documentation |

---

## 📦 Simulation

To meet coursework requirements, a simulation script generates:

* 🚖 **200 Tuk-Tuks**
* 📍 **~14,000 Location Logs**
* 🗓️ **7 Days of Tracking Data**
* 📅 Fixed date range: **April 26 → May 2**

### Run Simulation

```bash
node src/scripts/simulate.js
```

---

## ⚙️ Local Setup

### 1️⃣ Clone repository

```bash
git clone https://github.com/your-username/tuktracer-api.git
cd tuktracer-api
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create `.env` file:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
PORT=5000
```

### 4️⃣ Generate Prisma client

```bash
npx prisma generate
```

### 5️⃣ Run project

```bash
npm run dev
```

---

## 📡 API Endpoints Overview

### Authentication

* `POST /api/auth/login`

### Tuk-Tuks

* `GET /api/tuktuks`
* `POST /api/tuktuks`
* `GET /api/tuktuks/:id`

### Tracking

* `POST /api/tracking/ping`
* `GET /api/tuktuks/:id/location/latest`
* `GET /api/tuktuks/:id/location/history`

### Reports

* `GET /api/reports/summary`
* `GET /api/reports/inactive-vehicles`

👉 Full API details available in Swagger UI.

---

## 🚀 Deployment

The API is deployed using:

* **Render** → Backend hosting
* **Neon** → PostgreSQL database

---

## 🎓 Coursework Alignment

This project satisfies:

✔ RESTful API design
✔ Authentication & security
✔ Real-time data handling
✔ Historical data tracking
✔ Filtering & reporting
✔ Deployment (non-localhost)
✔ API documentation (Swagger)

---

## 👨‍💻 Author

**Nadeesh Hirushan**
Software Engineer

---

## ⭐ Final Note

This project demonstrates a **real-world backend system** for vehicle tracking, focusing on scalability, clean architecture, and practical API design.

---

✨ *Built for academic and real-world learning purposes*
