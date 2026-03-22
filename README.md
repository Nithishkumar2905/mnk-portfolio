# MNK Portfolio — Nithish Kumar M

A full-stack portfolio website for a graphic designer and UI/UX student.

**Frontend**: React + Vite · **Backend**: Node.js + Express · **Database**: MongoDB · **Images**: Cloudinary

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your MongoDB URI, Cloudinary keys, and JWT secret in .env
npm install
npm run seed    # Creates admin user + sample projects
npm run dev     # Starts API on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

---

## Environment Variables (backend/.env)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random secret string for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |

---

## URLs

| URL | Description |
|---|---|
| `http://localhost:5173/` | Portfolio homepage |
| `http://localhost:5173/projects/:id` | Project detail page |
| `http://localhost:5173/admin/login` | Admin login |
| `http://localhost:5173/admin/dashboard` | Admin dashboard |
| `http://localhost:5000/api/health` | API health check |
| `http://localhost:5000/api/projects` | Projects API |

---

## Project Structure

```
mnk_portfolio/
├── backend/
│   ├── src/
│   │   ├── config/       # DB + Cloudinary config
│   │   ├── controllers/  # Auth + Project business logic
│   │   ├── middleware/   # JWT auth middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API route definitions
│   │   ├── seed.js       # Database seeder
│   │   └── server.js     # Express server entry
│   └── .env.example
├── frontend/
│   └── src/
│       ├── components/   # Navbar, Hero, ProjectCard...
│       ├── context/      # AuthContext
│       ├── pages/        # Home, ProjectDetail, Admin pages
│       └── utils/        # Axios API client
```
