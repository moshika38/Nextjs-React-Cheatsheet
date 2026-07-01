// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center bg-gray-200 font-sans gap-4">
      <h1 className="text-2xl font-bold text-slate-800">Welcome to My Website 🏠</h1>
       <Link href="/dashboard" className="px-4 py-2 bg-slate-800 text-white rounded-lg">
        Go to Dashboard
      </Link>
    </div>
  );
}