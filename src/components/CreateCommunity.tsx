import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput) => {
  const { error, data } = await supabase.from("communities").insert(community);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const {
    mutate,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      setName("");
      setDescription("");
      navigate("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 relative animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-[rgba(15,15,15,0.85)] backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8 space-y-8"
      >
        <div className="flex items-center gap-2 font-mono text-sm text-green-400">
          <span className="text-white">&gt;</span> CreateCommunity()
        </div>

        <div className="group">
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1 group-focus-within:text-green-400">
            Community Name
          </label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., design, react devs, tech tips"
            className="w-full px-4 py-2 bg-black/30 border border-white/10 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <div className="group">
          <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1 group-focus-within:text-green-400">
            Description
          </label>
          <textarea
            value={description}
            required
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this community about?"
            className="w-full px-4 py-2 bg-black/30 border border-white/10 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-2 text-sm uppercase font-semibold tracking-widest rounded-md transition ${
            isPending
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isPending ? "Creating..." : "Create Community"}
        </button>

        {isError && (
          <p className="text-sm text-red-500 border-l-2 border-red-500 pl-2">
            ⚠️ {error?.message}
          </p>
        )}
        {isSuccess && (
          <p className="text-sm text-green-400 border-l-2 border-green-500 pl-2">
            ✅ Community created successfully.
          </p>
        )}
      </form>
    </div>
  );
};
