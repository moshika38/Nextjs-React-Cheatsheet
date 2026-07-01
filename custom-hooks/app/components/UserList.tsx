"use client";
import useFetch from '../hooks/useFetch';

interface Student {
  id: string | number;
  name: string;
  class: string;
  email: string;
}

export default function UserList() {

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/students`;
  const { data, loading, error } = useFetch(apiUrl);


  // const users = data as unknown as Student[];
  const users = data as any as Student[];

  if (loading) return <p>Loading users... </p>;
  if (error) return <p>Error: {error} </p>;

  return (
    <ul>
      {users?.map((user) => (
        <div key={user.id} className="mb-3 flex gap-5 items-center">
          <li className="font-medium">{user.id}</li>
          <li className="font-medium">{user.name}</li>
          <li className="text-sm text-slate-500">{user.email}</li>
          <li className="text-sm text-slate-500">{user.class}</li>
        </div>
      ))}
    </ul>
  );
}