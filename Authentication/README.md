Here is the clean, scannable **Markdown code for your README** formatted perfectly for your cheat sheet collection.

Copy the entire block below into your `README.md` file:

```markdown
# NextAuth.js (Auth.js) v5 Quick Integration Guide (Next.js App Router)

A step-by-step guide to setting up **NextAuth.js (Auth.js)** in Next.js (v14/v15) App Router projects. Token verification, cookie management, encryption, and `httpOnly` flags are handled automatically under the hood.

---

## 🚀 Step-by-Step Implementation

### Step 1: Installation
Run the following command in your terminal to install the NextAuth beta version:
```

```bash
npm install next-auth@beta
```

### Step 2: Setup Environment Variables (`.env.local`)

Create a `.env.local` file in the root of your project and add your credentials:

```env
AUTH_SECRET=your_generated_secret_key
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret

```

> **Tip:** Generate a secure `AUTH_SECRET` by running `npx auth secret` in your terminal. Get GitHub credentials via *GitHub Profile -> Settings -> Developer Settings -> OAuth Apps*.
```
npx auth secret
```

### Step 3: Create Configuration File (`auth.ts`)

Create `auth.ts` in your root or `src/` directory to configure your providers and manage custom token payloads.

```typescript
// auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // Inject custom data (like User ID or Roles) into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.role = "user" 
      }
      return token
    },
    // Pass the custom token data into the client-accessible session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
      }
      return session
    }
  }
})

```

### Step 4: Create Route Handler (`app/api/auth/[...nextauth]/route.ts`)

Set up the API dynamic route handler to capture NextAuth's incoming authentication requests.

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"
export const { GET, POST } = handlers

```

### Step 5: Protect Routes via Middleware (`middleware.ts`)

Create a `middleware.ts` file in your root folder to restrict unauthorized access to specific routes (e.g., your dashboard).

```typescript
// middleware.ts
export { auth as middleware } from "@/auth"

export const config = {
  // Protects /dashboard and all nested structural sub-routes
  matcher: ["/dashboard/:path*"],
}

```

---

## 💻 Usage Examples

### Server Component Integration (e.g., Navbar)

Using the asynchronous `auth()` function inside Server Components automatically extracts and validates cookies to fetch user data safely.

```typescript
// app/components/Navbar.tsx
import { auth, signIn, signOut } from "@/auth"

export default async function Navbar() {
  const session = await auth() // Token validation & cookie checks happen automatically

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#f5f5f5" }}>
      <h3>My App</h3>
      <div>
        {session ? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <p>Hi, {session.user?.name}</p>
            <form action={async () => {
              "use server"
              await signOut()
            }}>
              <button type="submit">Sign Out</button>
            </form>
          </div>
        ) : (
          <form action={async () => {
            "use server"
            await signIn("github")
          }}>
            <button type="submit">Sign In with GitHub</button>
          </form>
        )}
      </div>
    </nav>
  )
}

```

---

## 🔒 Security Summary

* **Zero Manual Config:** Cookie storage, lifecycle, encryption, and signature validation against your `AUTH_SECRET` are fully automated.
* **XSS Defended:** Session tokens reside within secure `httpOnly` cookies, keeping them invisible to malicious client-side JavaScript execution.





