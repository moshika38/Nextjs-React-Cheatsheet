 
import { auth, signIn, signOut } from "@/app/auth"

export default async function Navbar() {
  const session = await auth() 

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", background: "#eee" }}>
      <h3>My App</h3>
      <div>
        {session ? (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <p>Hello, {session.user?.name}</p>
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