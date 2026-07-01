import { prisma } from "@/lib/prisma";

// POST - Create post
export async function POST(request: Request) {
  const body = await request.json();

   
  const user = await prisma.user.findUnique({
    where: { id: body.authorId },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

   
  const newPost = await prisma.post.create({
    data: {
      title: body.title,
      authorId: body.authorId,
    },
  });

  return Response.json(newPost, { status: 201 });
}

// GET - Single post
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  
) {
  const { id } = await params; 

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  return Response.json(post);
}

// PATCH - Update post
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

 
  const existing = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  const updated = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      title: body.title,
    },
  });

  return Response.json(updated);
}

// DELETE - Delete post
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

   
  const existing = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) {
    return Response.json({ error: "Post not found" }, { status: 404 });
  }

  await prisma.post.delete({
    where: { id: Number(id) },
  });

  return Response.json({ message: "Post deleted successfully" });
}