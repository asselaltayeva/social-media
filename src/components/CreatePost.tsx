import { useState, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
const DEFAULT_AVATAR_URL = "https://eldelrdijnvrdxrlqwph.supabase.co/storage/v1/object/public/default/default.jpg";


interface PostInput {
  title: string;
  content: string;
  avatar_url?: string | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {user} = useAuth();

  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) =>
      createPost(data.post, data.imageFile),
    onSuccess: () => {
      setTitle("");
      setContent("");
      setSelectedFile(null);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;
    mutate({ post: { title, content, avatar_url: user?.user_metadata.avatar_url || DEFAULT_AVATAR_URL}, imageFile: selectedFile });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 relative animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-[rgba(15,15,15,0.85)] backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8 space-y-8"
      >
        
        <div className="flex items-center gap-2 font-mono text-sm text-green-400">
          <span className="text-white">&gt;</span> CreatePost()
        </div>

        <div className="group">
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1 group-focus-within:text-green-400">
            Title
          </label>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear, descriptive title..."
            className="w-full px-4 py-2 bg-black/30 border border-white/10 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <div className="group">
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1 group-focus-within:text-green-400">
            Content
          </label>
          <textarea
            value={content}
            required
            rows={5}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="w-full px-4 py-2 bg-black/30 border border-white/10 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

    
        <div className="group">
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                Upload Image
                </label>
            <div className="relative w-full bg-black/30 border border-dashed border-white/10 rounded-md px-4 py-10 text-center text-gray-400 hover:border-green-500 hover:text-white transition cursor-pointer">
            <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <p className="text-sm">
            {selectedFile
                ? `📁 ${selectedFile.name}`
                : "Click to upload or Drop an image"}
            </p>
        </div>
        </div>

        <button
          type="submit"
          disabled={isPending || !selectedFile}
          className={`w-full py-2 text-sm uppercase font-semibold tracking-widest rounded-md transition ${
            isPending || !selectedFile
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isPending ? "Uploading..." : "Post"}
        </button>

        {isError && (
          <p className="text-sm text-red-500 border-l-2 border-red-500 pl-2">
            ⚠️ {error?.message}
          </p>
        )}
        {isSuccess && (
          <p className="text-sm text-green-400 border-l-2 border-green-500 pl-2">
            ✅ Post created successfully.
          </p>
        )}
      </form>
    </div>
  );
};
