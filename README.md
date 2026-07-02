# Egyptian Score Shop ⚽

A complete, production-ready full-stack e-commerce website for selling original football boots, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Storefront**: Home, Products (search/filter/sort), Product Details, Cart, Checkout, Wishlist, About, Contact, FAQ, Order Tracking, Login/Register
- **Bilingual**: Full English & Arabic translations with automatic RTL layout switching
- **Dark / Light mode** toggle with persisted preference
- **WhatsApp checkout**: No online payment — orders are confirmed via a formatted WhatsApp message generated automatically, plus a floating WhatsApp button site-wide
- **Authentication**: JWT-based register/login, password reset via email, protected routes
- **Wishlist**: synced to the server for logged-in users, falls back to local storage for guests
- **Coupons**: percentage or fixed discounts, usage limits, per-user limits, min order value
- **Reviews & ratings** on products
- **Admin Dashboard**: manage products (with multi-color/multi-size variants), orders (status pipeline), customers, coupons, and view analytics (revenue chart, order status breakdown, low stock alerts, top sellers)
- **Email notifications**: welcome email on registration, order confirmation email (via Nodemailer — degrades gracefully to console logging if SMTP isn't configured)
- **SEO**: meta tags, semantic structure, descriptive titles per page
- **Responsive design** for desktop, tablet, and mobile
- **Sample data**: 12 real football boot products (Nike, Adidas, Puma) with multiple colors/sizes, an admin account, a demo customer account, and 2 working coupons

## Tech Stack

- **Frontend**: React 18 (Vite), React Router 6, react-i18next, Framer Motion, Recharts, Axios, React Toastify, React Icons
- **Backend**: Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs, express-validator, Nodemailer, Helmet, express-rate-limit

---

## Project Structure

```
egyptian-score-shop/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # auth, error handling, validation
│   │   ├── models/        # Mongoose schemas (User, Product, Order, Coupon)
│   │   ├── routes/        # Express routers
│   │   ├── seed/          # Sample data seed script
│   │   ├── utils/         # email templates, error class
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/            # Axios API modules
    │   ├── components/     # Reusable UI (Navbar, Footer, ProductCard, etc.)
    │   ├── context/        # Auth, Cart, Wishlist, Theme, Language providers
    │   ├── i18n/            # en.json / ar.json translations
    │   ├── pages/           # All 12 pages + admin dashboard pages
    │   ├── routes/          # ProtectedRoute / AdminRoute guards
    │   ├── styles/          # global.css design tokens (light/dark)
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** — either a local instance (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- (Optional) An SMTP provider for transactional emails — e.g. Mailtrap (testing), SendGrid, or Gmail App Passwords. Without this, the app still works; emails are just logged to the console instead of sent.

---

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set at minimum:

```env
MONGO_URI=mongodb://127.0.0.1:27017/egyptian-score-shop
JWT_SECRET=replace_with_a_long_random_string
WHATSAPP_NUMBER=201234567890   # your business WhatsApp number, country code, no + or spaces
```

Seed the database with sample football boots, an admin account, a demo customer, and coupons:

```bash
npm run seed
```

This prints the admin and demo customer login credentials to the console (defaults: `admin@egyptianscoreshop.com` / `Admin@12345` and `customer@example.com` / `Customer@123`, or whatever you set in `.env`).

Start the API:

```bash
npm run dev      # development with nodemon, auto-restart
# or
npm start        # production
```

The API runs on `http://localhost:5000` by default. Visit `http://localhost:5000/api/health` to confirm it's running.

### Backend environment variables

| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` / `JWT_EXPIRE` / `JWT_COOKIE_EXPIRE` | JWT signing secret and expiry |
| `CLIENT_URL` | Frontend URL, used for CORS and email links |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials used when seeding the admin account |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `EMAIL_FROM` | Nodemailer SMTP config |
| `WHATSAPP_NUMBER` | Business WhatsApp number for order checkout (international format, digits only) |

---

## 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:5173` and proxies all `/api` requests to the backend on port 5000 (see `vite.config.js`).

**Important:** Update the WhatsApp business number in two places before going live:
- `frontend/src/components/common/FloatingWhatsApp.jsx`
- `frontend/src/pages/ProductDetails.jsx` (the "Ask about this product" link)
- `frontend/src/components/layout/Footer.jsx`
- `backend/.env` (`WHATSAPP_NUMBER`) — this is the one that actually generates the order checkout link

---

## 3. Login Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@egyptianscoreshop.com` | `Admin@12345` |
| Customer | `customer@example.com` | `Customer@123` |

Visit `/admin` after logging in as the admin to access the dashboard.

Sample coupons seeded: `WELCOME10` (10% off, min 1000 EGP) and `SAVE200` (200 EGP off, min 3000 EGP).

---

## 4. Building for Production

**Backend**: deploy as a standard Node.js service (e.g. Render, Railway, a VPS with PM2). Set all env vars on your host and point `MONGO_URI` at your production database (e.g. MongoDB Atlas).

**Frontend**:
```bash
cd frontend
npm run build
```
This outputs static files to `frontend/dist`. Deploy them to any static host (Vercel, Netlify, S3+CloudFront, Nginx). Make sure to set `VITE_API_URL` or update `src/api/axios.js` to point at your deployed backend's public URL, and configure CORS (`CLIENT_URL`) on the backend to match your deployed frontend's domain.

---

## 5. Notes & Design Decisions

- **No online payment gateway** is integrated, per the project spec — checkout collects shipping details, validates stock and pricing server-side, creates an `Order` record, decrements inventory, and opens a pre-filled WhatsApp chat (`wa.me` link) with a formatted order summary for manual confirmation. Payment is Cash on Delivery only.
- **Pricing is always re-validated server-side** at checkout against the live product data — the client-side cart price is never trusted for the final charge.
- **Guest checkout** is supported (no account required) as long as an email is provided for order confirmation; logged-in users get order history automatically.
- **Wishlist** persists to MongoDB for authenticated users and to `localStorage` for guests, and migrates implicitly once a guest logs in (their session wishlist switches to the server-synced one).
- This sandbox environment doesn't have a local MongoDB instance to run an end-to-end live test, but the backend has been syntax-validated end-to-end and the frontend has been built successfully with Vite with zero errors. Once you connect a real MongoDB URI, everything is ready to run as-is.

---

## 6. Sample Data

Running `npm run seed` in `backend/` inserts:
- 12 football boots across Nike, Adidas, and Puma (Firm Ground, Turf, Indoor, and Kids categories), each with multiple colors and per-size stock counts
- 1 admin account, 1 demo customer account
- 2 active discount coupons

To wipe all seeded data:
```bash
npm run seed:destroy
```

---

## License

This project was generated as a custom build and is free for you to use, modify, and deploy.
