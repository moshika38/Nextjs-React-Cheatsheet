"use client";

import { FormEvent, useState } from "react";
import { showToast } from "nextjs-toast-notify";

export default function Home() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function validate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.trim() === "" || file === null) {
      showToast.error("Please fill out all the feilds", {
        duration: 4000,
        position: "top-right",
        transition: "bounceIn",
        sound: true,
        progress: true,
      });
      return;
    }

    try {
      setUploading(true);

      // const response = await fetch("/api/posts", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     title: title,
      //     content: title,
      //     userId: 1,
      //     published: false,
      //   }),
      // });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", title);
      formData.append("userId", "1");
      if (file) formData.append("file", file);

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      showToast.success("Post uploaded successfully!", {
        duration: 4000,
        position: "top-right",
        transition: "bounceIn",
        sound: true,
        progress: true,
      });
      setUploading(false);
    } catch (e) {
      setUploading(false);
      showToast.error("Upload failed", {
        duration: 4000,
        position: "top-right",
        transition: "bounceIn",
        sound: true,
        progress: true,
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-[0_32px_120px_-72px_rgba(15,23,42,0.6)] p-8 sm:p-10">
        <div className="mb-8 text-center">
          {uploading ? <p>Uploading...</p> : null}
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Create a post
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Upload your story
          </h1>
          <p className="mt-3 text-slate-500">
            Choose an image, add a title, and share a short description.
          </p>
        </div>

        <form onSubmit={validate} className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <label
              className="mb-3 block text-sm font-medium text-slate-700"
              htmlFor="title"
            >
              Post title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="A beautiful sunset..."
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex flex-col items-center justify-center gap-3 rounded-3xl bg-white px-5 py-6 text-slate-700 transition hover:bg-slate-100"
            >
              <span className="text-4xl">📤</span>
              <span className="text-base font-medium">
                Select an image to upload
              </span>
              <span className="text-sm text-slate-500">
                PNG, JPG, GIF up to 10MB
              </span>
            </label>
            <input
              id="file-upload"
              name="file"
              type="file"
              className="sr-only"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="inline-flex justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              Upload post
            </button>
            <button
              type="reset"
              className="inline-flex justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Clear form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
