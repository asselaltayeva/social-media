import { useState } from "react";
import type { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Arrow  from "./Icons/Arrow"
import { Send } from "lucide-react";

interface Props {
  comment: Comment & {
    children?: Comment[];
  };
  postId: number;
}

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to reply.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
  };

  return (
    <div className="pl-4 border-l border-white/10">
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-base font-medium text-white">
            {"@"}{comment.author}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-300">{comment.content}</p>
        <button
          onClick={() => setShowReply((prev) => !prev)}
          className="text-green-500 text-sm mt-1"
        >
          {showReply ? "Cancel" : "Reply"}
        </button>
      </div>
      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="mb-2">
        <div className="relative w-full">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            placeholder="Write a reply..."
            className="w-full resize-none rounded-md border border-white/10 bg-transparent p-2 pr-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={!replyText || isPending}
            aria-label="Post reply"
            className={`absolute bottom-2 right-2 p-1 rounded-md transition-opacity
              ${replyText ? "opacity-90 hover:opacity-100" : "opacity-30 cursor-default"}
              bg-white/10 text-white`}
          >
            <Send size={18} />
          </button>
        </div>
        {isError && (
          <p className="text-red-500 mt-1">Error posting reply.</p>
        )}
      </form>
      )}
    
          {comment.children && comment.children.length > 0 && (
            <div>
              <Arrow
              isCollapsed={isCollapsed}
              toggleCollapsed={() => setIsCollapsed((prev) => !prev)}
              /> 
              {!isCollapsed && (
                <div className="space-y-2">
                  {comment.children.map((child, key) => (
                    <CommentItem key={key} comment={child} postId={postId} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    };