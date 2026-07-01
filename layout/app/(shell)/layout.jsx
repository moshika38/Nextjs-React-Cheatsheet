"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React from 'react'

function DashboardLayout({ children }) {

  const pathname = usePathname();
  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
    { name: "Settings", href: "/settings" },

  ];


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
}

export default DashboardLayout