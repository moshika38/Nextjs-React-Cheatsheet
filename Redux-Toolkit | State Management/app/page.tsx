import Image from "next/image";
import { Counter } from "./features/counter/counterPage";
import { TodoPage } from "./features/todo/todoPage";

export default function Home() {
  return (
   <div className="flex w-screen h-screen flex-col justify-center items-center">
       <div className="flex flex-row w-screen h-screen justify-center items-center gap-10">

        <div className="">
          <Counter/>
        </div>

        <div className="">
          <TodoPage/>
        </div>

       </div>
   </div>
  );
}
