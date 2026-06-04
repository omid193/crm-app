
# Job Board - Full-Stack Next.js Application

A modern, production-grade job board application built with Next.js 15, featuring role-based access control, JWT authentication, and a feature-based architecture.

## 📁 Project Structure

```markdown
src/
├── app/                            # Next.js App Router (routes only)
│   ├── (auth)/                     # Auth group (public routes)
│   │   ├── signin/page.tsx         # Sign in page
│   │   └── signup/page.tsx         # Sign up page
│   │
│   ├── (main)/                     # Main group (public routes)
│   │   └── posts/                  # Public job listings
│   │       ├── [id]/page.tsx       # Single post detail
│   │       └── page.tsx            # All posts listing
│   │
│   ├── api/                        # API Routes (thin layer)
│   │   ├── auth/
│   │   │   ├── signin/route.ts     # Sign in endpoint
│   │   │   └── signup/route.ts     # Sign up endpoint
│   │   ├── posts/
│   │   │   ├── [id]/route.ts       # PUT & DELETE post
│   │   │   └── route.ts            # POST create post
│   │   └── user/route.ts           # Current user info
│   │
│   ├── dashboard/                  # Protected dashboard routes
│   │   ├── employer/page.tsx       # Employer dashboard
│   │   ├── seeker/page.tsx         # Job seeker dashboard
│   │   └── page.tsx                # Dashboard redirect (by role)
│   │
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Global styles (dark theme)
│
├── features/                       # Feature-based modules
│   ├── auth/                       # Authentication feature
│   │   ├── components/             # UI components
│   │   │   ├── SigninForm.tsx      # Sign in form (React Hook Form + Zod)
│   │   │   └── SignupForm.tsx      # Sign up form (React Hook Form + Zod)
│   │   ├── lib/                    # Auth utilities
│   │   │   ├── jwt.ts              # JWT creation & verification (jose)
│   │   │   └── password.ts         # Password hashing (bcryptjs)
│   │   └── server/                 # Server-side handlers
│   │       ├── signin.ts           # Sign in business logic
│   │       └── signup.ts           # Sign up business logic
│   │
│   ├── employer/                   # Employer feature
│   │   └── components/
│   │       ├── CreatePostForm.tsx   # Job posting form
│   │       ├── DeletePostButton.tsx # Delete confirmation button
│   │       ├── EditPostButton.tsx   # Edit modal trigger
│   │       ├── EditPostForm.tsx     # Edit job form (modal)
│   │       ├── EmployerPage.tsx     # Employer dashboard (client)
│   │       └── PostList.tsx         # Employer's job listings
│   │
│   ├── posts/                      # Posts feature
│   │   └── server/                 # Server-side handlers
│   │       ├── create-post.ts      # Create post logic
│   │       ├── delete-post.ts      # Delete post logic
│   │       └── update-post.ts      # Update post logic
│   │
│   └── seeker/                     # Job seeker feature (ready for expansion)
│
├── shared/                         # Shared modules
│   ├── components/
│   │   └── layout/
│   │       └── Header.tsx          # Site header component
│   └── lib/
│       ├── db/                     # Database layer
│       │   ├── schema/             # Drizzle ORM schemas
│       │   │   ├── index.ts        # Schema exports
│       │   │   ├── posts.ts        # Job posts table
│       │   │   ├── profiles.ts     # User profiles table
│       │   │   └── users.ts        # Users table
│       │   └── index.ts            # Database connection (LibSQL)
│       ├── validations/            # Zod validation schemas
│       │   ├── auth.ts             # Signin & Signup schemas
│       │   ├── index.ts            # Validation exports
│       │   └── posts.ts            # Post CRUD schemas
│       ├── api-responses.ts        # Standardized API responses
│       └── config.ts               # Environment configuration
│
└── proxy.ts                        # API proxy configuration
```

## 🏗️ Architecture

### Thin Pages Pattern

The `app/` directory contains only routing logic. All business logic lives in `features/`. API routes are a single `export` line that delegates to handlers.

```typescript
// app/api/auth/signin/route.ts
export { signin as POST } from "@/features/auth/server/signin";
```

### Feature-Based Architecture

Each feature is self-contained with its own components, server logic, and utilities:

- **`features/auth/`** — Authentication (sign in, sign up, JWT)
- **`features/employer/`** — Employer dashboard & job management
- **`features/posts/`** — Job post CRUD operations
- **`features/seeker/`** — Job seeker functionality (extensible)

### Hybrid Rendering

- **Server Components** — Data fetching, session checks, page layouts
- **Client Components** — Forms, interactive UI, modals
- **`router.refresh()`** — Real-time UI updates after mutations without full reload

## 🔐 Authentication & Authorization

### JWT + HTTP-Only Cookies

- Tokens are stored in HTTP-only cookies (inaccessible to JavaScript)
- Created using `jose` library (modern, Edge-compatible)
- 7-day expiration with automatic renewal

### Middleware Protection

```typescript
// middleware.ts
- Protects /api/posts routes
- Verifies JWT token from cookies
- Injects user info (x-user-id, x-user-email, x-user-role) into headers
- Role-based access: only employers can POST/PUT/DELETE
- GET requests are public
```

### Role-Based Access Control

| Role | Permissions |
|:---|:---|
| **employer** | Create, edit, delete own job posts |
| **jobSeeker** | View all job posts, edit profile |
| **public** | View all job posts (GET only) |

## 🗄️ Database

### Schema (Drizzle ORM + SQLite/LibSQL)

**Users** — id, name, email, password (hashed), role (employer/jobSeeker), timestamps

**Profiles** — id, bio, userId (one-to-one with users)

**Posts** — id, title, description, category, location, salary, authorId (FK to users), timestamps

### Relationships

- User → Profile (One-to-One)
- User → Posts (One-to-Many)
- All deletions cascade

## 🛡️ Security

| Measure | Implementation |
|:---|:---|
| Password Hashing | bcryptjs with salt rounds (10) |
| JWT Secret | Environment variable (`JWT_SECRET`) |
| HTTP-Only Cookies | JavaScript cannot access tokens |
| CSRF Protection | `sameSite: "lax"` cookie attribute |
| Input Validation | Zod schemas on both client & server |
| Ownership Check | Posts can only be modified by their author |
| Password in Response | Never returned (destructured out) |

## 🎨 UI/UX

- **Dark theme** — Tailwind CSS with gray-900/800/700 palette
- **Responsive** — Mobile-first design
- **Form validation** — React Hook Form + Zod with Persian error messages
- **Loading states** — `isSubmitting` flags on all forms
- **Success/Error messages** — Color-coded (green/red) with auto-dismiss
- **Modal** — Edit post in a modal overlay
- **Confirmation** — Delete requires user confirmation

## 🧰 Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict) |
| **Database** | SQLite (local) / LibSQL |
| **ORM** | Drizzle ORM |
| **Auth** | JWT (jose) + HTTP-only cookies |
| **Validation** | Zod |
| **Forms** | React Hook Form + @hookform/resolvers |
| **Password** | bcryptjs |
| **Styling** | Tailwind CSS |
| **Icons** | Emoji (📍 💰) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-me"
```

## 📝 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| POST | `/api/auth/signup` | Create account | No |
| POST | `/api/auth/signin` | Sign in | No |
| GET | `/api/auth/logout` | Sign out | No |

### Posts

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| GET | `/api/posts` | Get all posts | No |
| GET | `/api/posts/:id` | Get single post | No |
| POST | `/api/posts` | Create post | Employer |
| PUT | `/api/posts/:id` | Update post | Employer (owner) |
| DELETE | `/api/posts/:id` | Delete post | Employer (owner) |

### User

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| GET | `/api/user` | Get current user | Yes |

## 🧪 Testing (Coming Soon)

- **Vitest** — Unit & integration tests
- **React Testing Library** — Component tests
- **MSW** — API mocking

## 📄 License

MIT

---

Built with ❤️ as a learning project for modern full-stack Next.js development.
