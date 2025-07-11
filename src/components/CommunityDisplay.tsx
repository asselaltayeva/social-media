import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";


interface Props {
    communityId: number;
}

interface PostWithCommunity extends Post {
    communities: {
        name: string
    };
}

export const fetchCommunityPost = async (communityId:number): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithCommunity[];
};

export const CommunityDisplay = ({communityId} : Props) =>{
    const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
        queryKey: ["communityPost", communityId],
        queryFn: ()=> fetchCommunityPost(communityId),
      });
    
      if (isLoading) {
        return <div className="text-center text-gray-400 py-10">Loading communities...</div>;
      }
    
      if (error) {
        return (
          <div className="text-red-500 border-l-4 border-red-600 pl-4 py-4 bg-red-950/20 rounded-md max-w-xl mx-auto mt-10">
            ⚠️ Error: {error.message}
          </div>
        );
      }

    return (
  <>
    <div className="text-center text-2xl font-semibold text-transparent bg-gradient-to-r from-green-400 via-white to-green-600 bg-clip-text drop-shadow-sm mb-8 tracking-tight ">
        #{data && data[0].communities.name}
        <div className="h-px w-1/2 mx-auto mt-2 bg-white/10" />
    </div>

    {data && data.length > 0 ? (
      <div className="space-y-6">
        {data.map((post, key) => (
          <PostItem key={key} post={post} />
        ))}
      </div>
    ) : (
      <p>No posts yet</p>
    )}
  </>
);
};