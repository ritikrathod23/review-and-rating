# ReviewSphere - MERN Stack Monorepo Review & Rating Platform

ReviewSphere is a production-ready, high-fidelity **MERN Stack Review & Rating Platform** built using a modern **Monorepo Architecture** powered by **Turborepo** and **pnpm workspaces**.

The platform is designed with a premium, state-of-the-art dark-first user interface styled with **Tailwind CSS**, featuring **glassmorphism elements**, glowing ambient backdrops, dynamic loading skeletons, interactive rating inputs, and responsive cards.

---

## 🚀 Key Features

1. **Company Management Module**:
   - Register new company profiles via a beautiful, responsive form styled with **zod validation**.
   - Logo Uploading dropzone using **Multer + Cloudinary** (with a seamless automatic local directory fallback if credentials are unconfigured).
   - Display registered companies in a fully responsive, card-based grid layout.
   - Live query-based company **Search by Name/Location** and drop-down filtration by **City**.
   - Custom-tailored dynamic loading skeletons and elegant empty states.

2. **Testimonials & Review Engine**:
   - Company detail page listing all key corporate information (founded date, website, locations).
   - Average score meter calculating ratings (1 to 5 stars) dynamically.
   - Add Review component featuring clickable, hoverable Star ratings.
   - Dynamic sorting filters to rank user testimonials by `Latest`, `Highest Rating`, `Lowest Rating`, or `Most Liked`.
   - Atomic **Like Review** count increment operations.
   - **Share Review** utility copying the direct viewport anchor link directly to the clipboard with visual toast confirmations.

3. **Production-Ready Core Architecture**:
   - Fully decoupled monorepo workspace split into independent applications (`apps/*`) and shared packages (`packages/*`).
   - Standardized Express REST controller & service routing systems with centralized error handling.
   - High-fidelity **Database Auto-Seeder** that populates Mongoose collections with professional sample companies and reviews on initial connection startup for instant UI inspection.
   - Unified ESLint, Prettier, and TypeScript configurations.

---

## 🛠️ Technology Stack

* **Monorepo**: [Turborepo](https://turbo.build/) + [pnpm Workspaces](https://pnpm.io/)
* **Frontend**: [Next.js 15 (App Router)](https://nextjs.org/) + TypeScript + [Zustand](https://github.com/pmndrs/zustand) (State Management)
* **Backend**: Node.js + Express + TypeScript + Mongoose + [Multer](https://github.com/expressjs/multer) (File Uploads)
* **Database**: MongoDB (Mongoose Schemas & dynamic Aggregation Recalculation)
* **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod Schema Validation](https://zod.dev/)
* **API Clients**: Axios
* **Design & Styling**: Tailwind CSS + Custom HSL Color Systems + Google Fonts (`Outfit`, `Plus Jakarta Sans`)

---

## 📁 Repository Structure

```
review-rating-app/
├── apps/
│   ├── web/                     # Next.js 15 App Router Frontend (Port 3000)
│   └── api/                     # Express Node.js Backend Server (Port 5000)
│
├── packages/
│   ├── types/                   # Shared TypeScript models (ICompany, IReview, API payloads)
│   ├── utils/                   # Shared validators (companySchema, reviewSchema, formatters)
│   ├── ui/                      # Shared helper classes (cn merger class values)
│   └── configs/                 # Shared base TSConfig compilation profiles
│
├── turbo.json                   # Turborepo task pipeline mappings
├── pnpm-workspace.yaml          # Monorepo workspaces definition
└── package.json                 # Monorepo scripts & dependencies
```

---

## ⚡ Setup & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (v10+ recommended)
- [MongoDB](https://www.mongodb.com/) (either running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI string)

### 2. Install Dependencies
Run the command below in the root folder of the repository to install all workspace dependencies and link the shared package packages:
```bash
pnpm install
```

### 3. Environment Variable Configuration
Create a copy of `.env.example` in the root folder and name it `.env` (or configure individual variables within `apps/api/.env` and `apps/web/.env`):
```bash
cp .env.example .env
```

Ensure your `.env` contains the correct values:
* `MONGODB_URI`: Your MongoDB database connection string.
* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: (Optional) Credentials to upload logos to Cloudinary. If omitted, files will be saved in the local public directory.

---

## 💻 Running the Platform Locally

To spin up both the **Express REST API** (Port 5000) and the **Next.js Frontend** (Port 3000) concurrently with hot-reloading active, execute the root package development command:

```bash
pnpm run dev
```

The console will boot Turborepo and present unified service outputs:
* **Next.js Website**: [http://localhost:3000](http://localhost:3000)
* **REST Express API**: [http://localhost:5000/api](http://localhost:5000/api)
* **API Healthcheck**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Seeding & Testing Data

Upon booting the API for the first time, if Mongoose detects an empty database collection, it will **automatically execute a high-fidelity database seeder**. 

This seeds:
- **3 Tech Companies** (Google, Microsoft, Stripe) with complete metadata and hosted logos.
- **7 Professional Reviews** linked to these companies.
- Fully synchronized rating scores and count aggregation totals.

This guarantees you have a rich, interactive environment loaded instantly when you visit the dashboard for the first time!
