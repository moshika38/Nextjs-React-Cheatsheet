
# 🚀 Prisma v6 + Next.js Setup  

## ⚙️ #. Create Next.js Project
```
npx create-next-app@latest my-app
```

---

## ⚙️ 1. Install Prisma

🥇 Recommended (latest stable)

```bash
npm install prisma --save-dev
npm install @prisma/client
```

---

🥈 OR pinned version (Prisma v6)

```bash
npm install prisma@6 --save-dev
npm install @prisma/client@6
```

---

## ⚙️ 2. Initialize Prisma

```bash
npx prisma init
```

👉 This creates:

```
/prisma/schema.prisma
.env
```

---

## 🗄️ 3. Configure Database (SQLite Example)

📁 `.env`

```env
DATABASE_URL="file:./dev.db"
```

---

## 🧠 4. Prisma Schema Example

📁 `/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
}
```

---

## 🔄 5. Run Migration (Create Database)

```bash
npx prisma migrate dev --name init
```

👉 This will:

* Create database
* Create tables
* Generate Prisma Client (auto)

---

## ⚡ 6. (Optional but safe) Generate Client

```bash
npx prisma generate
```

---

## 🧩 7. Setup Prisma Client (Singleton - IMPORTANT)

📁 `/lib/prisma.js`

```js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

---

## 🌐 8. Next.js API Routes

---

# ✅ OPTION A: App Router (Recommended)

📁 `app/api/users/route.js`

```js
import { prisma } from "@/lib/prisma";

// GET users
export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

// POST create user
export async function POST(req) {
  const body = await req.json();

  if (!body.name || !body.email || !body.password) {
    return Response.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: body,
  });

  return Response.json(user);
}
```

---
---
---

# 📝 Posts API — Next.js + Prisma

A simple REST API built with **Next.js 15 App Router** and **Prisma ORM** for managing users and posts.

---

## 📁 Folder Structure

```
my-app/
├── app/
│   └── api/
│       ├── posts/
│       │   ├── route.ts           # POST /api/posts
│       │   └── [id]/
│       │       └── route.ts       # GET, PATCH, DELETE /api/posts/:id
│       └── users/
│           └── route.tsx          # GET, POST /api/users
├── lib/
│   └── prisma.ts                  # Prisma client instance
├── prisma/
│   └── schema.prisma              # Database schema
├── .env                           # DATABASE_URL lives here
├── package.json
└── README.md
```

---

## ⚙️ Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup your .env
DATABASE_URL="your_database_url_here"

# 3. Push schema to database
npx prisma db push

# 4. Start dev server
npm run dev
```

---

## 🗄️ Prisma Schema

```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}
```

---

## 📮 API Endpoints

| Method   | URL                     | Description         |
|----------|-------------------------|---------------------|
| `POST`   | `/api/posts`            | Create a new post   |
| `GET`    | `/api/posts/:id`        | Get a single post   |
| `PATCH`  | `/api/posts/:id`        | Update a post       |
| `DELETE` | `/api/posts/:id`        | Delete a post       |

---

## 🧪 Postman Examples

### ➕ POST — Create Post

```
Method : POST
URL    : http://localhost:3000/api/posts
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw → JSON):**
```json
{
  "title": "My First Post",
  "authorId": 1
}
```

**Success Response `201`:**
```json
{
  "id": 1,
  "title": "My First Post",
  "authorId": 1
}
```

**Error Response `404`:**
```json
{
  "error": "User not found"
}
```

---

### 🔍 GET — Single Post

```
Method : GET
URL    : http://localhost:3000/api/posts/1
```

> Body එකක් නෑ — URL එකේ `1` තැන post id දාන්න.

**Success Response `200`:**
```json
{
  "id": 1,
  "title": "My First Post",
  "authorId": 1
}
```

**Error Response `404`:**
```json
{
  "error": "Post not found"
}
```

---

### ✏️ PATCH — Update Post

```
Method : PATCH
URL    : http://localhost:3000/api/posts/1
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw → JSON):**
```json
{
  "title": "Updated Title"
}
```

**Success Response `200`:**
```json
{
  "id": 1,
  "title": "Updated Title",
  "authorId": 1
}
```

**Error Response `404`:**
```json
{
  "error": "Post not found"
}
```

---

### 🗑️ DELETE — Delete Post

```
Method : DELETE
URL    : http://localhost:3000/api/posts/1
```

> Body එකක් නෑ — URL එකේ id එක විතරයි.

**Success Response `200`:**
```json
{
  "message": "Post deleted successfully"
}
```

**Error Response `404`:**
```json
{
  "error": "Post not found"
}
```

---

## ⚠️ Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `500 MODULE_UNPARSABLE` | Stale `.next` cache | `rm -rf .next` then `npm run dev` |
| `prisma.User is not a function` | Wrong casing | Use `prisma.user` (lowercase) |
| `params.id` undefined | Next.js 15 params change | Use `await params` with `Promise<{id: string}>` |

---

 
 