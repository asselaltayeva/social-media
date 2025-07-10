import { Link } from "react-router";
import type { Post } from "./PostList";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  const avatarUrl = post.avatar_url || "";
  const userName = post.author || "Anonymous";

  const getPreviewText = (text: string, maxLength: number) => {
    if (!text) return "No content preview.";
    const trimmed = text.slice(0, maxLength);
    return trimmed.slice(0, trimmed.lastIndexOf(" ")) + "…";
  };

  return (
    <div className="relative group max-w-3xl mx-auto">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-green-800 to-black blur-lg opacity-0 group-hover:opacity-40 transition duration-300 pointer-events-none" />

      <Link
        to={`/post/${post.id}`}
        className="relative z-10 flex flex-col sm:flex-row w-full overflow-hidden rounded-2xl bg-black/30 backdrop-blur-md border border-white/40 hover:border-white/20 transition-shadow duration-300"
      >
        {post.image_url && (
          <div className="sm:w-[40%] h-[100px] sm:h-auto overflow-hidden flex-shrink-0">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 aspect-video"
            />
          </div>
        )}

        <div className="p-6 flex flex-col justify-between flex-1">
          <div className="space-y-4">
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

            <h3 className="text-xl font-semibold text-white group-hover:text-green-500 transition line-clamp-2">
              {post.title}
            </h3>

            <p className="text-base text-gray-400 leading-relaxed text-justify">
              {getPreviewText(post.content || "", 370)}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div className="flex gap-4">
              <span>❤️ {post.like_count ?? 0}</span>
              <span>💬 {post.comment_count ?? 0}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-gray-400 font-mono group-hover:underline decoration-gray-400 underline-offset-4 transition">
              Read more →
            </span>

          </div>
        </div>
      </Link>
    </div>
  );
};
