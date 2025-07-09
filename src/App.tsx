import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { Footer } from "./pages/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100 transition-opacity duration-700">
      <Navbar />

      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePostPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/community/create" element={<CreateCommunityPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/community/:id" element={<CommunityPage />} />
          </Routes>
        </div>
      </main>


      <Footer />
    </div>
  );
}

export default App;
