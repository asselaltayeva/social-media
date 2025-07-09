import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { X } from "lucide-react";
import { useNavigate } from "react-router";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const navigate = useNavigate();

  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 py-10 animate-pulse">
        Loading post...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-10">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto rounded-2xl bg-black/40 backdrop-blur-lg border border-white/10 p-6 shadow-xl transition-shadow duration-300 relative">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="p-2 rounded-md hover:bg-white/10 transition"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <h2 className="flex-1 text-3xl font-bold text-center bg-gradient-to-r from-green-400 via-white/90 to-green-800 bg-clip-text text-transparent drop-shadow-md">
          {data?.title}
        </h2>

        <div className="h-px bg-white/10 w-full" />

        <div className="w-10" />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
        {data?.image_url ? (
          <div className="h-72 w-60 overflow-hidden rounded-xl border border-white/10 shadow-inner">
            <img
              src={data.image_url}
              alt={data.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-72 w-60 bg-white/5 flex items-center justify-center rounded-xl border border-white/10 text-gray-500 text-sm">
            No image
          </div>
        )}

        <div className="max-h-72 overflow-auto pr-1">
          <p className="text-gray-300 text-base leading-relaxed text-justify whitespace-pre-wrap">
            {data?.content}
          </p>
        </div>
      </div>

      <p className="text-gray-500 text-sm text-left mt-6">
        Posted on{" "}
        <span className="text-white/70 font-medium">
          {new Date(data!.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </p>

      <div className="pt-4 border-t border-white/10 mt-4">
        <div className="flex justify-between items-center">
          <LikeButton postId={postId} />
        </div>
        <div className="mt-4">
          <CommentSection postId={postId} />
        </div>
      </div>
    </div>
  );
};
