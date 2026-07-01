import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { user: true },
  });
  return Response.json(posts);
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const content = formData.get("content");
    const userId = formData.get("userId");
    const file = formData.get("file");

    console.log("POST /api/posts", { title, content, userId, hasFile: !!file, fileSize: file?.size });

    if (!title || !userId) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    let imageUrl = null;
    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name || "image"}`;
      const arrayBuffer = await file.arrayBuffer();
      console.log("Uploading to Supabase storage:", fileName);

      const { data, error } = await supabase.storage
        .from("posts")
        .upload(fileName, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return Response.json({ error: error.message }, { status: 500 });
      }

      console.log("Upload success, data:", data);

      const { data: urlData } = supabase.storage
        .from("posts")
        .getPublicUrl(data.path);

      imageUrl = urlData.publicUrl;
    }

    console.log("Creating post in database...");
    const post = await prisma.post.create({
      data: {
        title,
        content: content ?? "",
        published: false,
        userId: parseInt(userId),
        imageUrl,
      },
    });

    return Response.json(post);
  } catch (err) {
    console.error("Full error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
