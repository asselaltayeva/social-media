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
    <div className="max-w-3xl mx-auto rounded-2xl bg-black/40 backdrop-blur-lg border border-white/10 p-4 md:p-6 shadow-xl  relative">
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="p-2 rounded-md hover:bg-white/10 transition"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <h2 className="text-center text-base sm:text-lg md:text-xl font-semibold leading-relaxed text-white">
    {data?.title}
  </h2>

        <div className="w-6" />
      </div>

      <div className="h-px bg-white/10 w-full mb-4" />


      <div className="flex flex-col md:flex-row gap-6 items-start">
        {data?.image_url ? (
          <div className="w-full md:w-60 h-60 md:h-72 overflow-hidden rounded-xl border border-white/10 shadow-inner flex-shrink-0">
            <img
              src={data.image_url}
              alt={data.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full md:w-60 h-60 md:h-72 bg-white/5 flex items-center justify-center rounded-xl border border-white/10 text-gray-500 text-sm flex-shrink-0">
            No image
          </div>
        )}


        <div className="w-full overflow-auto pr-1">
        <div className="text-gray-300 text-base md:text-lg leading-relaxed text-justify space-y-4">
          {data?.content
            ?.split(/\r?\n+/) 
            .filter(line => line.trim() !== "") 
            .map((paragraph, i) => (
            <p key={i} className="whitespace-pre-wrap">
              {paragraph.trim()}
            </p>
          ))}
          </div>
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
        <div className="flex justify-center items-center">
          <LikeButton postId={postId} />
        </div>
        <div className="mt-4">
          <CommentSection postId={postId} />
        </div>
      </div>
    </div>
  );
};
