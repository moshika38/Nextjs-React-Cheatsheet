import { prisma } from "@/lib/prisma";

// GET users
export async function GET() {
  const users = await prisma.User.findMany();
  return Response.json(users);
}
// SAVE users
export async function POST(request: Request) {
  const userData = await request.json();
  const user = await prisma.User.create({ data: userData });
  return Response.json(user);
}


