# 🍕 SwiggyClone — Full-Stack Food Delivery Platform

A production-grade, Swiggy-inspired food delivery web application built with **React**, **Node.js/Express**, **Supabase (PostgreSQL)**, and **Tailwind CSS**.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Setup Guide](#setup-guide)
  - [1. Supabase Setup](#1-supabase-setup)
  - [2. Clone & Install](#2-clone--install)
  - [3. Environment Variables](#3-environment-variables)
  - [4. Database Setup](#4-database-setup)
  - [5. Run Locally](#5-run-locally)
- [API Reference](#api-reference)
- [Pages Overview](#pages-overview)
- [Admin Panel](#admin-panel)
- [Deployment](#deployment)

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v3   |
| Routing    | React Router v6                   |
| State      | Context API (Auth, Cart, Location)|
| HTTP Client| Axios                             |
| Backend    | Node.js, Express.js               |
| Database   | Supabase (PostgreSQL)             |
| Auth       | Supabase Auth (Email + Google)    |
| Icons      | Lucide React                      |
| Toasts     | React Toastify                    |

---

## 📁 Project Structure

```
project/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # AuthContext, CartContext, LocationContext
│   │   ├── pages/             # One file per page/route
│   │   ├── services/          # api.js (Axios + all API calls)
│   │   ├── lib/               # supabase.js client
│   │   ├── App.jsx            # Route definitions
│   │   └── main.jsx           # React root entry point
│   ├── .env.example
│   └── package.json
│
├── server/                    # Node.js + Express Backend
│   ├── config/                # supabaseClient.js
│   ├── controllers/           # Business logic per resource
│   ├── routes/                # Express routers
│   ├── middleware/            # authMiddleware, errorHandler
│   ├── index.js               # Express app entry point
│   ├── .env.example
│   └── package.json
│
├── supabase/
│   ├── schema.sql             # Full DB schema with RLS policies
│   └── seed.sql               # 10 restaurants, 30+ menu items, coupons
│
└── README.md
```

---

## ✨ Features

- 🔐 **Supabase Auth** — Email/password + Google OAuth
- 🛒 **Cart** — Persisted in localStorage, cross-restaurant guard
- 🔍 **Restaurant Filtering** — By cuisine, veg, rating, price, sort
- 📱 **Responsive Design** — Mobile-first, works on all screen sizes
- 🏷️ **Coupon Codes** — Validate & apply discount codes
- 📦 **Order Management** — Place, track, and view order history
- 👨‍💼 **Admin Panel** — Dashboard stats, manage restaurants/menu/orders
- 🍽️ **Menu Search** — Search within restaurant menu
- 🎨 **Skeleton Loading** — Smooth loading states
- 🔔 **Toast Notifications** — For cart, errors, success events

---

## 🚀 Setup Guide

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a **new project**
2. Note your **Project URL** and **anon/public key** (Settings → API)
3. Note your **service_role key** (Settings → API → keep it secret!)
4. To enable **Google OAuth**:
   - Go to Authentication → Providers → Google
   - Enable and add your Google OAuth credentials from [console.cloud.google.com](https://console.cloud.google.com)
   - Add redirect URL: `http://localhost:5173` (and your production URL)

### 2. Clone & Install

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Variables

**Client** — copy `.env.example` to `.env`:
```bash
cd client
copy .env.example .env
```

Edit `client/.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=http://localhost:5000/api
```

**Server** — copy `.env.example` to `.env`:
```bash
cd server
copy .env.example .env
```

Edit `server/.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 4. Database Setup

1. Open your **Supabase Project Dashboard**
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open and **run** `supabase/schema.sql` — creates all tables, RLS policies, and triggers
5. Then **run** `supabase/seed.sql` — inserts 10 restaurants, 30+ menu items, and coupons

### 5. Run Locally

Open **two terminals**:

**Terminal 1 — Frontend:**
```bash
cd client
npm run dev
```
Runs on → `http://localhost:5173`

**Terminal 2 — Backend:**
```bash
cd server
npm run dev
```
Runs on → `http://localhost:5000`

> **Note:** The `npm run dev` for the server uses Node.js built-in file watcher (`--watch`). For older Node.js versions, you may need to install `nodemon` globally: `npm install -g nodemon` and run `nodemon index.js`.

---

## 📡 API Reference

| Method | Endpoint                    | Auth    | Description                        |
|--------|-----------------------------|---------|------------------------------------|
| GET    | `/api/health`               | None    | Health check                       |
| GET    | `/api/restaurants`          | None    | List restaurants (filters+page)    |
| GET    | `/api/restaurants/:id`      | None    | Get single restaurant              |
| GET    | `/api/restaurants/:id/menu` | None    | Get menu grouped by category       |
| POST   | `/api/orders`               | User    | Place a new order                  |
| GET    | `/api/orders/user`          | User    | Get current user's orders          |
| GET    | `/api/orders/:id`           | User    | Get single order                   |
| PUT    | `/api/orders/:id/status`    | Admin   | Update order status                |
| GET    | `/api/orders/admin/all`     | Admin   | All orders                         |
| GET    | `/api/orders/admin/stats`   | Admin   | Dashboard metrics                  |
| GET    | `/api/coupons/:code`        | None    | Validate coupon code               |
| GET    | `/api/restaurants/admin/all`| Admin   | All restaurants (admin)            |
| POST   | `/api/restaurants`          | Admin   | Create restaurant                  |
| PUT    | `/api/restaurants/:id`      | Admin   | Update restaurant                  |
| DELETE | `/api/restaurants/:id`      | Admin   | Delete restaurant                  |

### Filter Parameters for `GET /api/restaurants`:
| Param      | Example        | Description              |
|------------|----------------|--------------------------|
| `city`     | `Bangalore`    | Filter by city           |
| `cuisine`  | `Pizza`        | Filter by cuisine type   |
| `veg`      | `true`         | Pure veg only            |
| `minRating`| `4.0`          | Minimum rating           |
| `sortBy`   | `rating`       | Sort: `rating`, `delivery_time`, `cost_asc`, `cost_desc` |
| `page`     | `1`            | Page number              |
| `limit`    | `12`           | Items per page           |

---

## 📄 Pages Overview

| Route               | Description                          | Auth Required |
|---------------------|--------------------------------------|---------------|
| `/`                 | Landing page                         | No            |
| `/login`            | Email/password + Google sign in      | No (redirects to /home if logged in) |
| `/signup`           | Create new account                   | No            |
| `/home`             | Restaurant listing with filters      | Yes           |
| `/restaurant/:id`   | Restaurant detail + menu             | Yes           |
| `/cart`             | Cart + address + coupon + checkout   | Yes           |
| `/order-success`    | Order confirmation & tracking UI     | Yes           |
| `/profile`          | Profile, addresses, order history    | Yes           |
| `/admin`            | Admin dashboard (admin role only)    | Admin only    |

---

## 👨‍💼 Admin Panel

To make a user an **admin**:

1. Sign up with the email you want to make admin
2. Go to **Supabase SQL Editor**
3. Run:
```sql
update profiles set role = 'admin' where email = 'your-admin@email.com';
```

The admin panel at `/admin` will now be accessible with:
- 📊 Dashboard metrics (orders, revenue, restaurants, users)
- 🏪 Restaurant management (add/edit/delete)
- 🍽️ Menu item management (add/edit/delete per restaurant)
- 🛵 Order management (view all, update status)

---

## 🌐 Deployment

### Frontend (Vercel or Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder to Vercel/Netlify
```

Add the same environment variables in your hosting dashboard.

### Backend (Railway, Render, or Fly.io)
Deploy the `/server` folder as a Node.js app.
Set environment variables in your hosting dashboard.

### Supabase
- Already hosted — no extra steps needed for the database.
- Add your production domain to Supabase Auth URLs.

---

## 🎨 Color System

| Token       | Value     | Usage                 |
|-------------|-----------|-----------------------|
| `primary`   | `#FC8019` | Orange — CTA, accents |
| `gray-900`  | `#111827` | Headings              |
| `gray-500`  | `#6B7280` | Body text             |
| `green-600` | `#16a34a` | Rating ≥4, veg badge  |
| `red-500`   | `#ef4444` | Non-veg, errors       |

---

## 📦 Coupon Codes (Demo)

| Code        | Discount           | Min Order |
|-------------|--------------------|-----------|
| `SAVE50`    | 50% off (max ₹150) | ₹299      |
| `FIRST100`  | ₹100 off           | ₹199      |
| `FLAT20`    | 20% off (max ₹200) | ₹399      |
| `WELCOME30` | 30% off (max ₹120) | ₹249      |
| `BIGORDER`  | 15% off (max ₹500) | ₹999      |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

Made with ❤️ and 🍕 by SwiggyClone
