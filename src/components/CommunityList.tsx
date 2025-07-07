import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

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
    <div className="flex flex-col gap-8 max-w-3xl mx-auto px-4">
      {data?.map((community, key) => (
        <div key={key} className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-lime-900 to-green-800 blur-lg opacity-0 group-hover:opacity-40 transition duration-300 pointer-events-none" />

          <Link
            to={`/community/${community.id}`}
            className="relative z-10 flex flex-col w-full overflow-hidden rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 hover:border-white/30 transition-shadow duration-300"
          >
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition line-clamp-2">
                {community.name}
              </h3>
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ textAlign: "justify" }}
              >
                {community.description || "No description available."}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
