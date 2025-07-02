import { CreatePost } from "../components/CreatePost";

export const CreatePostPage = () => {
  return (
    <div className="min-h-screen pt-28 px-4 bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-5xl font-mono font-bold text-transparent bg-gradient-to-r from-white via-green-500 to-green-500 bg-clip-text drop-shadow-[0_0_10px_rgba(0,255,150,0.3)]">
          {"<Create.NewPost />"}
        </h2>
        <p className="mt-2 text-sm text-gray-500 font-mono tracking-wide">
          Write something worth sharing with the world.
        </p>
      </div>

      {/* Post Form */}
      <div className="relative z-10">
        <CreatePost />
      </div>
    </div>
  );
};
