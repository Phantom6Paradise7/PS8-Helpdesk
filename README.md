# Helpdesk: Complaint & Ticket Management System

A support desk where customers raise tickets, the support team assigns, discusses and resolves them, and admins see how the team is doing. Built for **PS8: Complaint & Helpdesk Ticket System** with the MERN stack (MongoDB Atlas, Express, React, Node.js).

**Live app:** https://ps-8-helpdesk.vercel.app/
**API:** https://ps8-helpdesk-omzk.onrender.com/
**Source:** https://github.com/Phantom6Paradise7/PS8-Helpdesk

> The backend may take up to a minute to respond on the first visit if it has been idle. Reload once if the first login is slow.

---

## Try it

Use these demo accounts on the live app:

| Role | Email | Password | What you can do |
|---|---|---|---|
| Admin / Support | `admin@example.com` | `Password@123` | Triage all tickets, assign departments, update status, manage departments, view the dashboard |
| Customer | `aarav@example.com` | `Password@123` | Raise tickets, track them, reply to support, edit or delete Open tickets |
| Customer | `priya@example.com` | `Password@123` | Has a Resolved ticket you can reopen once |

You can also create your own account from the **Register** page.

---

## What you can do

### As a customer
- Register and log in.
- Raise a ticket with a title, category, priority (Low / Medium / High), description and an optional screenshot link.
- See every ticket in **My Tickets** and filter by status.
- Follow the conversation with support on each ticket, with timestamps.
- Edit or delete a ticket while it is **Open**.
- Reopen a **Resolved** ticket once if the problem is not fixed.

### As support or admin
- See all tickets and filter them by status.
- Assign a ticket to a department.
- Move a ticket through **Open → In Progress → Resolved → Closed**.
- Reply to customers on the ticket thread.
- Create, edit and delete departments.
- Open the dashboard: open vs resolved tickets, average resolution time, priority and category breakdowns, and an **Overdue** count.

### Rules the app enforces
- Every ticket gets a readable ID such as `TKT-1024`.
- Customers can edit or delete a ticket only while it is Open.
- A Resolved ticket can be reopened once.
- Closed tickets are read-only, and no new replies can be added.
- High-priority tickets that stay unresolved for more than 24 hours are flagged **Overdue**.
- These rules are checked on the server as well as in the interface.

### Look and feel
Light and dark themes with a warm, editorial style. Use the toggle in the navigation bar to switch.

---

## Screenshots

Add your screenshots to `docs/screenshots/` and keep these paths.

| Screen | Image |
|---|---|
| Home | `docs/screenshots/home.png` |
| Login | `docs/screenshots/login.png` |
| My Tickets | `docs/screenshots/my-tickets.png` |
| Ticket detail | `docs/screenshots/ticket-detail.png` |
| Admin tickets | `docs/screenshots/admin-tickets.png` |
| Departments | `docs/screenshots/departments.png` |
| Dashboard (light and dark) | `docs/screenshots/dashboard.png` |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), react-router-dom |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Authentication | JWT, passwords hashed with bcrypt |
| Hosting | Vercel (frontend), Render (backend) |

---

## Project structure

```
PS8-Helpdesk/
├── backend/
│   ├── config/          # database connection
│   ├── models/          # User, Department, Ticket, Comment
│   ├── controllers/     # auth, tickets, comments, departments, dashboard
│   ├── routes/          # one route file per resource, mounted under /api
│   ├── middleware/      # JWT check, role guard, error handler
│   ├── seed.js          # demo users, departments, tickets and comments
│   └── server.js
└── frontend/
    └── src/
        ├── api/         # all fetch calls
        ├── components/  # Navbar, ProtectedRoute, TicketForm, DepartmentForm,
        │                # CommentSection, StatusBadge
        ├── pages/       # one file per route
        ├── styles/      # stylesheets
        ├── App.jsx
        └── main.jsx
```

---

## Run it locally

**You need:** Node.js 18 or newer, and a MongoDB Atlas cluster (or any MongoDB connection string).

### 1. Get the code
```bash
git clone https://github.com/Phantom6Paradise7/PS8-Helpdesk.git
cd PS8-Helpdesk
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env     # then fill in your own values (see the table below)
npm run seed             # loads the demo users, departments, tickets and comments
npm run dev              # starts the API on the port you set (default 5000)
```

### 3. Frontend
In a second terminal:
```bash
cd frontend
npm install
cp .env.example .env     # set VITE_API_URL to your backend URL
npm run dev              # opens on http://localhost:5173
```

Log in with the demo accounts above once the seed script has run.

---

## Environment variables

Never commit real values. Each folder has a `.env.example` to copy from.

### Backend (`backend/.env`)

| Variable | What it is |
|---|---|
| `PORT` | Port the API listens on, for example `5000` |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random string used to sign login tokens |
| `CLIENT_URL` | The frontend address allowed to call the API, for example `http://localhost:5173` locally or your Vercel URL in production |

### Frontend (`frontend/.env`)

| Variable | What it is |
|---|---|
| `VITE_API_URL` | Base URL of the API, for example `http://localhost:5000/api` |

---

## API overview

All routes start with `/api`. Except register and login, every route needs an `Authorization: Bearer <token>` header.

| Method | Endpoint | Who | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Anyone | Create an account |
| POST | `/auth/login` | Anyone | Log in and receive a token |
| GET | `/tickets/my-tickets` | Customer | List your own tickets |
| POST | `/tickets` | Customer | Raise a ticket |
| GET | `/tickets` | Admin, Support | List all tickets |
| GET | `/tickets/:id` | Owner, Admin, Support | Get one ticket |
| PUT | `/tickets/:id` | Customer | Edit a ticket (only while Open) |
| DELETE | `/tickets/:id` | Customer | Delete a ticket (only while Open) |
| PATCH | `/tickets/:id/status` | Admin, Support | Change ticket status |
| PATCH | `/tickets/:id/assign` | Admin, Support | Assign a department |
| GET | `/tickets/:id/comments` | Owner, Admin, Support | Read the conversation |
| POST | `/tickets/:id/comments` | Owner, Admin, Support | Add a reply (blocked when Closed) |
| GET | `/departments` | Admin, Support | List departments |
| POST | `/departments` | Admin, Support | Create a department |
| PUT | `/departments/:id` | Admin, Support | Update a department |
| DELETE | `/departments/:id` | Admin, Support | Delete a department |
| GET | `/dashboard/stats` | Admin, Support | Dashboard numbers |

Errors come back as JSON with a clear message and a proper status code (400, 401, 403, 404, 409, 500).

---

## Deploying your own copy

| Part | Where | Settings |
|---|---|---|
| Backend | Render (Web Service) | Root directory `backend`, build `npm install`, start `npm start`, add the four backend variables above |
| Frontend | Vercel | Root directory `frontend`, add `VITE_API_URL` pointing to your deployed API |

Set `CLIENT_URL` on the backend to your deployed frontend address. The frontend includes an SPA rewrite so refreshing any page works.

---

## Author

**Mansa Bhatt**, Roll No. `48`
Assignment 6: Individual MERN Project (PS8)
