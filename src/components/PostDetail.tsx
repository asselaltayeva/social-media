import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

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
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 p-6 shadow-md">
    <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-green-400 via-white to-green-600 bg-clip-text text-transparent drop-shadow-md">
      {data?.title}
    </h2>
  
    {data?.image_url && (
      <div className="overflow-hidden rounded-xl border border-white/10 shadow-inner">
        <img
          src={data.image_url}
          alt={data?.title}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    )}
  
    <p className="text-gray-300 text-lg leading-relaxed">{data?.content}</p>
  
    <p className="text-gray-500 text-sm">
      Posted on:{" "}
      <span className="text-white/70">
        {new Date(data!.created_at).toLocaleDateString()}
      </span>
    </p>
  
    <div className="pt-2 border-t border-white/10">
      <LikeButton postId={postId} />
      <div className="mt-4">
        <CommentSection postId={postId} />
      </div>
    </div>
  </div>
  
  );
};