import { useParams } from "react-router";
import { CommunityDisplay } from "../components/CommunityDisplay";

export const CommunityPage = () => {    
    const { id } = useParams<{ id: string }>();
  return (
    <div className="min-h-screen pt-28 px-4 bg-black text-white relative">
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <CommunityDisplay communityId={Number(id)}/>
          </div>
        </div>
  );
}