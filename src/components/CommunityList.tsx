import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";
import { BookOpen, Users, Globe, Sparkles, Atom, Landmark } from "lucide-react";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading) {
    return <div className="text-center text-gray-500 py-12 animate-pulse">Loading communities...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 border-l-4 border-red-600 pl-4 py-4 bg-red-950/20 rounded-md max-w-xl mx-auto mt-10">
        ⚠️ Error: {error.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 italic py-12">
        No communities yet.{" "}
        <Link
          to="/create-community"
          className="text-green-400 underline underline-offset-4 hover:text-green-300 transition"
        >
          Create one now →
        </Link>
      </div>
    );
  }

  const iconMap = [BookOpen, Users, Globe, Sparkles, Atom, Landmark];

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-xl font-semibold text-white mb-6">Browse Communities</h2>

   
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((community, i) => {
          const Icon = iconMap[i % iconMap.length];
          return (
            <Link
              key={community.id}
              to={`/community/${community.id}`}
              className="group flex items-start gap-4 bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 rounded-2xl p-4"
            >
              <div className="text-green-400 mt-1">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-medium text-lg group-hover:text-green-400 transition">
                  {community.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {community.description || "No description available."}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      
      <div className="mt-10 text-center text-sm text-gray-400">
        <span>Not on the tag list?</span>{" "}
        <Link
          to="/community/create"
          className="text-green-400 underline underline-offset-4 hover:text-green-300 transition"
        >
          Create one now →
        </Link>
      </div>
    </div>
  );
};
