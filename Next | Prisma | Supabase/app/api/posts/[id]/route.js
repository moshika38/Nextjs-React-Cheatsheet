import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET single post
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update post
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.content && body.published === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        content: body.content,
        published: body.published,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE post
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}