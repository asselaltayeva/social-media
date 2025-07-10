import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities, type Community } from "./CommunityList";
const DEFAULT_AVATAR_URL = "https://eldelrdijnvrdxrlqwph.supabase.co/storage/v1/object/public/default/default.jpg";
import { Check } from "lucide-react";
const MAX_CONTENT_LENGTH = 550;

interface PostInput {
  title: string;
  content: string;
  avatar_url?: string | null;
  community_id?: number | null;
}

const createPost = async (
  post: PostInput,
  imageFile: File,
  userId: string,
  author: string
) => {
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
    .insert({
      ...post,
      image_url: publicURLData.publicUrl,
      user_id: userId,
      author: author,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);

  const { user } = useAuth();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) =>
      createPost(
        data.post,
        data.imageFile,
        user?.id || "",
        user?.user_metadata?.user_name || "Anonymous"
      ),
    onSuccess: () => {
      setTitle("");
      setContent("");
      setSelectedFile(null);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) return;

    if (!user?.id || !user?.user_metadata?.user_name) {
      alert("You must be logged in to create a post.");
      return;
    }

    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || DEFAULT_AVATAR_URL,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; 
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; 
    }
  }, [content]);

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
            placeholder="Enter a clear title..."
            className="w-full px-4 py-2 bg-black/30 border border-white/10 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <div className="group">
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1 group-focus-within:text-green-400">
            Content
          </label>
          <textarea
            ref={textareaRef}
            value={content}
            required
            onChange={(e) => {
              const input = e.target.value;
              if (input.length <= MAX_CONTENT_LENGTH + 100) {
                setContent(input);
              }
            }}          
            placeholder="Write your thoughts here..."
            className="w-full px-4 py-2 bg-black/30 border border-white/10 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
            rows={5} 
            style={{ overflow: "hidden" }} 
          />
          <p
            className={`text-xs mt-1 text-right ${
              content.length > MAX_CONTENT_LENGTH
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {content.length}/{MAX_CONTENT_LENGTH}
          </p>
          {content.length > MAX_CONTENT_LENGTH && (
            <p className="text-xs text-red-400 mt-1">
              ⚠️ Your content exceeds {MAX_CONTENT_LENGTH} characters. 
            </p>
          )}
        </div>

        <div className="group">
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
            Community Tags
          </label>
          <div className="flex flex-wrap gap-1">
            {communities?.map((community) => {
              const selected = communityId === community.id;
              return (
                <button
                  key={community.id}
                  type="button"
                  onClick={() =>
                    setCommunityId(selected ? null : community.id)
                  }
                  className={`flex items-center gap-2 px-2 py-1 rounded-sm border border-transparent transition-colors duration-200`}
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-sm border transition-colors duration-200 ${
                      selected ? "text-white" : "border-white/30"
                    }`}
                  >
                    {selected && <Check size={16} strokeWidth={3} />}
                  </span>
                  <span className="text-white/90 font-mono text-sm/tight whitespace-nowrap">
                    {community.name}
                  </span>
                </button>
              );
            })}
          </div>
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
