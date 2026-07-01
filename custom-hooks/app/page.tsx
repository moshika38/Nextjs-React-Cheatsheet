import Image from "next/image";
import UserList from "./components/UserList";

export default function Home() {
  return (
    <>
    <div className="flex flex-col justify-center items-center w-full h-screen">

      <h1 className="mb-20">User List</h1>
      <UserList/>

    </div>
    </>
  );
}
