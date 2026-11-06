# Sélon Coffee — Careers Portal (Frontend)

The modern, high-performance public careers portal for **Sélon Coffee**, built with React 18, Vite, and responsive CSS.

## 🚀 Features

- **Live Job Listings**: Direct integration with the Sélon backend / Zoho Recruit API.
- **Dynamic Role-Specific Pre-Screening**: Tailored questionnaire dynamically updates depending on selected position (Barista, Shift Supervisor, Roaster, General).
- **Smooth Application UX**: Inline role selection, resume upload support (PDF, DOC, DOCX up to 5MB), and immediate application feedback.
- **Clean Public UI**: Stripped of internal admin buttons or developer badges; pristine customer-facing design.
- **Configurable API Endpoint**: Seamlessly points to local backend or production cloud URL.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Typography**: Gloock (Editorial Serif) & Figtree (Clean Sans)

---

## 📦 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your backend API URL in `.env`:

```env
# Local Development (or leave blank to use the Vite dev proxy):
VITE_API_BASE_URL=http://localhost:5001

# Production (e.g. Render, Railway, AWS, Fly.io):
# VITE_API_BASE_URL=https://your-backend-api.onrender.com
```

### 3. Development Server

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 4. Production Build

```bash
npm run build
```

The output will be in the `dist/` directory, ready to deploy.

---

## 🌐 Deployment Guide

### Deploying to Vercel

1. Push this repository to GitHub.
2. In [Vercel Dashboard](https://vercel.com/), click **Add New Project** and import this repository.
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g., `https://selon-careers-api.onrender.com`).
6. Click **Deploy**.

### Deploying to Netlify

1. In [Netlify Dashboard](https://app.netlify.com/), click **Add new site** > **Import an existing project**.
2. Select your GitHub repository.
3. **Build Command**: `npm run build`
4. **Publish Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com`
6. For client-side routing, ensure Netlify redirects are configured (or use `/* /index.html 200`).

