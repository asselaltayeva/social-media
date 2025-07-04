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
    <div className="max-w-3xl mx-auto space-y-8 rounded-2xl bg-black/40 backdrop-blur-lg border border-white/10 p-8 shadow-xl transition-shadow duration-300 relative">
      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="absolute top-4 left-4 p-2 rounded-md hover:bg-white/10 transition"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Title */}
      <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-green-400 via-white/90 to-green-800 bg-clip-text text-transparent drop-shadow-md">
        {data?.title}
      </h2>

      {/* Image */}
      {data?.image_url && (
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-inner">
          <img
            src={data.image_url}
            alt={data.title}
            className="w-full h-72 object-cover transition-transform duration-500"
          />
        </div>
      )}

      {/* Content */}
      <p
        className="text-gray-300 text-lg leading-relaxed text-justify"
        style={{ textAlign: "justify" }}
      >
        {data?.content}
      </p>

      {/* Meta */}
      <p className="text-gray-500 text-sm text-center">
        Posted on{" "}
        <span className="text-white/70 font-medium">
          {new Date(data!.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </p>

      {/* Interaction */}
      <div className="pt-6 border-t border-white/10">
        <div className="flex justify-between items-center">
          <LikeButton postId={postId} />
        </div>
        <div className="mt-6">
          <CommentSection postId={postId} />
        </div>
      </div>
    </div>
  );
};
