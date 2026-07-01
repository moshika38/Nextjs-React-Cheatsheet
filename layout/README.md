# Next.js Dashboard with Route Groups

This project demonstrates how to structure a Next.js application using **Route Groups `( )`** to share a common layout (Sidebar & Navigation) across multiple pages while keeping the URLs clean and user-friendly.

 
## 📂 Folder Structure

```text
app/
├── layout.tsx             # Main Root Layout (Applies to the entire site)
├── page.tsx               # Main Home Page (.com/)
└── (shell)/               # Route Group (Omitted from the URL)
    ├── layout.tsx         # Dashboard Layout (Shared Sidebar & Header)
    ├── dashboard/
    │   └── page.tsx       # Dashboard Screen (.com/dashboard)
    └── profile/
        └── page.tsx       # Profile Screen (.com/profile)

```



## 01. page.tsx
```tsx
function Home() {
  return (
    <div className='flex w-screen h-screen items-center justify-center'>
        <Link href="/dashboard"> Go to Dashboard </Link>
    </div>
  )
}

```

## 02. (shell)/layout.tsx

```tsx
  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
    { name: "Settings", href: "/settings" },
 
  ];
```
```tsx

  return (
    <div className="min-h-screen flex bg-red-800 text-slate-900">
      
      {/* Sidebar */}
      <aside className='bg-slate-800 w-72 flex-none h-screen p-5' >
        <nav>
          <ul>

            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-slate-100 text-slate-950 shadow-sm shadow-slate-900/10"
                      : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                      }`}
                  >
                    <span className="w-full">{item.name}</span>
                  </Link>
                </li>
              );
            })}

          </ul>
        </nav>
      </aside>

      {/* Content Area */}
      <main style={{ flex: 1, padding: "20px", background: "#f8fafc" }}>
        {children}
      </main>

    </div>
  )
 

```

## 03. (shell)/dashboard/page.tsx
```tsx
function Dashboard() {
  return (
    <div className='flex w-screen h-screen items-center justify-center'>
        <h1>Dashboard screen</h1>
    </div>
  )
}

export default Dashboard
```



 