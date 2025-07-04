import { Link } from "react-router";
import type { Post } from "./PostList";
import { useAuth } from "../context/AuthContext"; 

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  const { user } = useAuth(); 

  const avatarUrl =
    user?.user_metadata?.avatar_url || post.avatar_url || ""; 
  const userName = user?.user_metadata?.user_name || "Anonymous";

  return (
    <div className="relative group max-w-3xl mx-auto">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-lime-900 to-green-800 blur-lg opacity-0 group-hover:opacity-40 transition duration-300 pointer-events-none" />

      <Link
        to={`/post/${post.id}`}
        className="relative z-10 flex flex-col sm:flex-row w-full overflow-hidden rounded-2xl bg-black/30 backdrop-blur-md border border-white/40 hover:border-white/20 transition-shadow duration-300"
      >
        {post.image_url && (
          <div className="sm:w-[40%] h-[200px] sm:h-auto overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="p-5 flex flex-col justify-between flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#491F70]" />
              )}
              <span className="font-medium text-sm sm:text-base text-white">{userName}</span>
              <span className="mx-1">•</span>
              <span>
                {new Date(post.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition line-clamp-2">
              {post.title}
            </h3>

            <p className="text-sm text-gray-400 line-clamp-3">
              {post.content?.slice(0, 120) || "No content preview."}
            </p>
          </div>

          <div className="mt-4 flex gap-6 text-sm justify-end text-gray-500">
            <span>❤️ {post.like_count ?? 0}</span>
            <span>💬 {post.comment_count ?? 0}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
