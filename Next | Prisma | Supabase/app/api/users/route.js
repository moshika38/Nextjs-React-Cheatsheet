import { prisma } from "@/lib/prisma";

// GET users
export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

// POST create user
export async function POST(req) {
  const body = await req.json();

  if (!body.name || !body.email) {
    return Response.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });

  return Response.json(user);
}