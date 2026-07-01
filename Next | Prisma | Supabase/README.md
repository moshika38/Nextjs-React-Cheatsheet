 # Connecting Supabase with Prisma in Next.js

A step-by-step guide on setting up Prisma ORM v7 with a Supabase PostgreSQL database in a Next.js application, utilizing the new required Node.js driver adapter (`@prisma/adapter-pg`).

---

## Step-by-Step Setup

### 1. Initialize Next.js App
Create your Next.js application:
```bash
npx create-next-app@latest my-app
```

### 2. Install Prisma CLI
Install Prisma CLI as a developer dependency:
```bash
npm install prisma --save-dev
```

### 3. Install Driver Adapter & Database Dependencies
Install the PostgreSQL driver, driver adapter, and `dotenv` helper:
```bash
npm install @prisma/adapter-pg pg dotenv
```

### 4. Initialize Prisma
Initialize the Prisma schema configuration in the project:
```bash
npx prisma init
```

### 5. Configure Environment Variables
## if have any error. try to use 5432 port in both urls ( DATABASE_URL, DIRECT_URL )
Open your `.env` file in the root directory and add the Supabase connection strings (replace `[YOUR-PASSWORD]` with your actual Supabase database password):
```env
# Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
DATABASE_URL="postgresql://postgres.xwanojfzywdqlrdhrqgt:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Connect to Postgres via the shared session-mode pooler (used for migrations)
DIRECT_URL="postgresql://postgres.xwanojfzywdqlrdhrqgt:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"
```

### 6. Configure Prisma config file
Create a `prisma.config.ts` in the root of the project to manage schema and datasource configurations in Prisma v7:
```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL!,
  },
});
```

### 7. Configure Prisma Schema
Modify `prisma/schema.prisma` to configure your database provider and define your database models:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  content   String
  published Boolean
  user      User    @relation(fields: [userId], references: [id])
  userId    Int
}
```

### 8. Push Schema to Supabase
Sync your schema models with the database using the session-mode pooler URL:
```bash
npx prisma db push
```

### 9. Install Prisma Client
Install the Prisma Client package:
```bash
npm install @prisma/client
```

### 10. Generate Prisma Client
Generate the Prisma Client code based on your schema:
```bash
npx prisma generate
```

### 11. Setup the Database Client File
Create a `lib/prisma.js` file in your project. In Prisma v7, instantiating `PrismaClient` requires passing the driver adapter explicitly:
```javascript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### 12. Create API Routes
Create the following route files:

#### `app/api/users/route.js`
```javascript
import { prisma } from "@/lib/prisma";

// GET users
export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

// POST create user
export async function POST(req) {
  const body = await req.json();

  if (!body.name || !body.email) {
    return Response.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return Response.json(user);
}
```

#### `app/api/users/[id]/route.js`
```javascript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET single user
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update user
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }
    if (!body.name && !body.email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name: body.name, email: body.email },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

#### `app/api/posts/route.js`
```javascript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET posts
export async function GET() {
  const posts = await prisma.post.findMany({
    include: { user: true },
  });
  return Response.json(posts);
}

// POST create post
export async function POST(req) {
  const body = await req.json();

  if (!body.content || !body.userId) {
    return Response.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      content: body.content,
      published: body.published ?? false,
      userId: parseInt(body.userId),
    },
  });

  return Response.json(post);
}
```

#### `app/api/posts/[id]/route.js`
```javascript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET single post
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update post
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.content && body.published === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        content: body.content,
        published: body.published,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### 13. Create Post Route Folders
```powershell
New-Item -ItemType Directory -Force -Path 'app\api\posts\[id]'
New-Item -ItemType File -Force -Path 'app\api\posts\route.js'
New-Item -ItemType File -Force -Path 'app\api\posts\[id]\route.js'
```

### 14. Run the Development Server
```bash
npm run dev
```

---

## API Testing Reference

Use **Thunder Client** (VS Code) or any REST Client to test the endpoints:

---

# 01. Users

### GET all users

* *Method :* `GET`
* *URL :* `http://localhost:3000/api/users`
* *Response :* Returns a JSON array of all user records.

---

### CREATE user

* *Method :* `POST`
* *URL :* `http://localhost:3000/api/users`
* *Request Body :*
```json
{
  "name": "John Doe",
  "email": "johndoe@gmail.com"
}
```

---

### GET single user

* *Method :* `GET`
* *URL :* `http://localhost:3000/api/users/1`
* *Response :* Returns a single user record.

---

### PUT update user

* *Method :* `PUT`
* *URL :* `http://localhost:3000/api/users/1`
* *Body :*
```json
{
  "name": "John Updated",
  "email": "johnupdated@gmail.com"
}
```

---

### DELETE user

* *Method :* `DELETE`
* *URL :* `http://localhost:3000/api/users/1`

---

# 02. Posts

### GET all posts

* *Method :* `GET`
* *URL :* `http://localhost:3000/api/posts`
* *Response :* Returns a JSON array of all post records with user data included.

---

### CREATE post

* *Method :* `POST`
* *URL :* `http://localhost:3000/api/posts`
* *Request Body :*
```json
{
  "content": "My first post",
  "published": false,
  "userId": 1
}
```

---

### GET single post

* *Method :* `GET`
* *URL :* `http://localhost:3000/api/posts/1`
* *Response :* Returns a single post record with user data included.

---

### PUT update post

* *Method :* `PUT`
* *URL :* `http://localhost:3000/api/posts/1`
* *Body :*
```json
{
  "content": "Updated post content",
  "published": true
}
```

---

### DELETE post

* *Method :* `DELETE`
* *URL :* `http://localhost:3000/api/posts/1`


---

# Uploading Images 

* 2.0 app/api/posts/route.js
  
```
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
```

* 2.1 upload function
* 2.2 Create a storage bucket and paste the name here

```
    let imageUrl = null;
    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name || "image"}`;
      const arrayBuffer = await file.arrayBuffer();
      console.log("Uploading to Supabase storage:", fileName);

      const { data, error } = await supabase.storage
        .from("posts")   // update storage bucket name here
        .upload(fileName, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return Response.json({ error: error.message }, { status: 500 });
      }

      console.log("Upload success, data:", data);

      const { data: urlData } = supabase.storage
        .from("posts")
        .getPublicUrl(data.path);

      imageUrl = urlData.publicUrl;
    }
```

* 2.3 Continue updating the collection with imageUrl

```
  const post = await prisma.post.create({
      data: {
        title,
        content: content ?? "",
        published: false,
        userId: parseInt(userId),
        imageUrl,
      },
    });
```

* 2.4 Request type is formData

```
export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const userId = formData.get("userId");
    const file = formData.get("file");

    // continue

    }
}
```

---

# Api call example

* 3.0 api call

```
    const response = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          content: title,
          userId: 1,
          published: false,
        }),
      });
```

* 3.1 formData example

```
  import { FormEvent, useState } from "react";

  export default function Home() {

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function validate(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData();
    
      formData.append("title", title);
      formData.append("content", title);
      formData.append("userId", "1");
      if (file) formData.append("file", file);
    
      const response = await fetch("/api/posts", {
          method: "POST",
          body: formData,
      });

  }

  return (
    <div>
        // continue ai
    </div>
  );
}

```


---
---

# Uploading Common Errors

### Make sure the Supabase Storage bucket is created successfully.

### Make sure the Supabase Storage bucket policies are configured correctly.

**Path:**
Supabase → Storage → Policies → New Policies → For Full Customization

Enable the following permissions:

* SELECT
* INSERT
* UPDATE
* DELETE

**Target Roles:**

* anon (make sure **anon** is checked)

---
---

## app/api/posts/route.js
```
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { user: true },
  });
  return Response.json(posts);
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const userId = formData.get("userId");
    const file = formData.get("file");

    console.log("POST /api/posts", { title, content, userId, hasFile: !!file, fileSize: file?.size });

    if (!title || !userId) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    let imageUrl = null;
    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name || "image"}`;
      const arrayBuffer = await file.arrayBuffer();
      console.log("Uploading to Supabase storage:", fileName);

      const { data, error } = await supabase.storage
        .from("posts")
        .upload(fileName, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return Response.json({ error: error.message }, { status: 500 });
      }

      console.log("Upload success, data:", data);

      const { data: urlData } = supabase.storage
        .from("posts")
        .getPublicUrl(data.path);

      imageUrl = urlData.publicUrl;
    }

    console.log("Creating post in database...");
    const post = await prisma.post.create({
      data: {
        title,
        content: content ?? "",
        published: false,
        userId: parseInt(userId),
        imageUrl,
      },
    });

    return Response.json(post);
  } catch (err) {
    console.error("Full error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

```

---

# useRouter Example

```
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/posts");
```

