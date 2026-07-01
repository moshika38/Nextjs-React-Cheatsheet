# Next.js Route Handlers (API Routing)

Next.js allows you to create custom request handlers for a given route using Web [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) Requests and Responses. These are called **Route Handlers** (formerly known as API Routes).

Route Handlers are configured inside the `app/` directory and must be defined in a **`route.ts`** (or `route.js`) file.

---

## 📁 File Structure

Route Handlers mirror the folder-based system used by pages. However, **you cannot have a `route.ts` and a `page.tsx` file at the same folder level** (e.g., `app/dashboard/route.ts` and `app/dashboard/page.tsx` will cause a conflict).

```text
app/
├── page.tsx               # Web Page (.com/)
└── api/
    ├── users/
    │   └── route.ts       # GET/POST Endpoint (.com/api/users)
    └── products/
        └── [id]/
            └── route.ts   # Dynamic Endpoint (.com/api/products/123)

```

## 1. Simple GET & POST Route Handler (app/api/users/route.ts)

```tsx
import { NextResponse } from 'next/server';

// Handle GET Requests
export async function GET() {
  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" }
  ];
  
  return NextResponse.json(users, { status: 200 });
}

// Handle POST Requests
export async function POST(request: Request) {
  try {
    const body = await request.json(); // Read incoming JSON body
    
    // Perform database insertion here...
    
    return NextResponse.json({ message: "User created!", data: body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
```


---


## 2. Dynamic Route Handler (app/api/products/[id]/route.ts)
To read dynamic parameters (like IDs or slugs) from the URL path:

```tsx
import { NextResponse } from 'next/server';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  const { id } = await params; // Extract the dynamic 'id'
  
  // Fetch product from DB based on ID...
  
  return NextResponse.json({ productId: id, name: `Product Sample ${id}` });
}
```


---


## 3.⚙️ Advanced Features
Reading Query Parameters (URL Query Strings)
To read variables passed in the URL like ?search=shoes&limit=10:

```tsx
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('search'); // returns 'shoes'
  const limit = searchParams.get('limit');   // returns '10'

  return NextResponse.json({ query, limit });
}
```


---


## 4.Setting Headers and Cookies
You can read and modify outgoing headers or inspect browser cookies directly within the API endpoint:

```tsx
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');

  const headersList = await headers();
  const userAgent = headersList.get('user-agent');

  return new NextResponse('API Response Data', {
    status: 200,
    headers: { 'Set-Cookie': `theme=dark; Path=/` },
  });
}
```


---


## 5.⚡️ Caching

### 5.1 🔗 Fetch Data from Route Handlers
can invoke these APIs from any Client Component using standard fetch methods:

```tsx
"use client";
import { useEffect, useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, [users]);

  return (
    <ul>
      {users.map((user: any) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```
 


 