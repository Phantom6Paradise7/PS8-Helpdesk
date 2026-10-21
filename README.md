# PS8: Helpdesk - Intelligent Complaint & Ticket Management System

Complaint & Helpdesk Ticket System (PS8). Built with the MERN stack (MongoDB, Express, React 18, Node.js), featuring a retro-editorial dual-theme UI, automated SLA overdue tracking, and role-based workflows.

---

## Live Deployments & Repository

- **GitHub Repository:** https://github.com/Phantom6Paradise7/PS8-Helpdesk
- **Frontend (Vercel):** https://ps-8-helpdesk.vercel.app/
- **Backend (Render):** https://ps8-helpdesk-omzk.onrender.com/

---

## Pre-seeded Credentials for Evaluation

- **Administrator / Support:**
  - Email: `admin@example.com`
  - Password: `Password@123`
  - Access: Full ticket triage, department CRUD, live analytics dashboard, overdue alerts

- **Customer 1:**
  - Email: `aarav@example.com`
  - Password: `Password@123`
  - Access: My Tickets, conversation thread with support, ticket creation

- **Customer 2:**
  - Email: `priya@example.com`
  - Password: `Password@123`
  - Access: Ticket tracking, one-time reopen demonstration

---

## Core Capabilities

1. **Role-Based Access Control (RBAC):**
   - Distinct, secure portals for Customers, Support Representatives, and Administrators.
2. **Dual Theme Engine (Dark & Light):**
   - Exact implementation matching editorial neo-brutalist aesthetics with solid offset shadows and Fraunces serif typography.
3. **Automated SLA Overdue Calculation:**
   - Highlights high-priority tickets unattended after 24 hours with visual OVERDUE badges.
4. **Finite State Machine:**
   - Enforced lifecycle flow: Open -> In Progress -> Resolved -> Closed.
   - Protected single-click reopen loop for resolved tickets.
5. **Bidirectional Conversation Feed:**
   - Timestamped comment timeline between customers and support staff.
6. **Executive Dashboard:**
   - Live metrics for open vs resolved tickets, average resolution hours, and category/priority breakdowns.

---

## Local Development Setup

### 1. Backend Setup
\`\`\`bash
cd backend
npm install
npm run seed
npm run dev
\`\`\`

### 2. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

---

## Deployment Instructions

### Backend on Render (Web Service)
1. Go to https://dashboard.render.com/ and click **New + > Web Service**.
2. Connect the repository: `https://github.com/Phantom6Paradise7/PS8-Helpdesk`.
3. Configure the service:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: `mongodb+srv://mansabhatt62587_db_user:48wNMlZjlNr26tYf@cluster7.klfzxyk.mongodb.net/`
   - `JWT_SECRET`: `6519aa7bcfe36aa1b95b41fec8fa54aa33b94fa07bdbe94af87665bad45108f4`
   - `CLIENT_URL`: `*`
5. Click **Create Web Service**.

### Frontend on Vercel
1. Go to https://vercel.com/mansabhatt62587-6900 and click **Add New... > Project**.
2. Import `https://github.com/Phantom6Paradise7/PS8-Helpdesk`.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://ps8-helpdesk-omzk.onrender.com/api`
5. Click **Deploy**.