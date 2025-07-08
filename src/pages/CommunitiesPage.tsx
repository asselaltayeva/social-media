import { CommunityList } from "../components/CommunityList"

export const CommunitiesPage = () => {
    return (
        <div className="min-h-screen pt-16 px-4 bg-black text-white relative">
              <div className="absolute inset-0 z-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
        
              <div className="relative z-10 text-center mb-12 animate-fade-in">
                <h2 className="text-3xl md:text-5xl font-mono font-bold bg-gradient-to-r from-white via-green-500 to-green-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,150,0.3)]">
                  {"<Community.Tags />"}
                </h2>
                <p className="mt-2 text-sm text-gray-500 font-mono tracking-wide">
                  Latest content from the community.
                </p>
              </div>
        
              <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                <CommunityList />
              </div>
            </div>
    )
}