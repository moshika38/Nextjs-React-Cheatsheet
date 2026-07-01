## 🌐 Understanding Next.js Routing 

Next.js uses a **File-system based router**, which means the folder structure directly defines the URL routes in your application. Each folder represents a **route segment** that maps to a URL segment.

 
 ### 1. Basic Routing  
Each folder name becomes part of the URL path:

* `app/page.tsx` ──> `yourdomain.com/` (Home Page)
* `app/about/page.tsx` ──> `yourdomain.com/about` (About Page)
* `app/contact/page.tsx` ──> `yourdomain.com/contact` (Contact Page)



---



### 2. Nested Routing 
You can nest folders inside one another to create deeper URL structures:

* `app/blog/page.tsx` ──> `yourdomain.com/blog` (Blog List Page)
* `app/blog/news/page.tsx` ──> `yourdomain.com/blog/news` (Blog News Page)



---



### 3. Dynamic Routing 
When you don't know the exact segment name ahead of time (e.g., blog post IDs or product slugs), you can use **Square Brackets `[ ]`** to create a dynamic route:

* `app/blog/[id]/page.tsx` ──> `yourdomain.com/blog/123` or `yourdomain.com/blog/hello-world`

Inside the `page.tsx`, you can access the dynamic `id` using `params`:

```tsx
export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <h1>Viewing Blog Post ID: {id}</h1>;
}

```



---



### 🔗 Navigating Between Pages
To link pages together, always use the Next.js <Link> component instead of the traditional HTML <a> tag. This ensures client-side navigation without refreshing the full page:

```tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}
```



---



### Programmatic Navigation (Client Components)
If you need to navigate users based on an action (like submitting a form), use the useRouter hook:

```tsx
"use client";
import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = () => {
    // Perform authentication logic...
    router.push('/dashboard');
  };

  return <button onClick={handleLogin}>Log In</button>;
}
```


