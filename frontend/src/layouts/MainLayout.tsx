import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Container from "@/components/ui/Container";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slateBg bg-page-mesh bg-hero-gradient font-body text-zinc-100">
      <Navbar />
      <main className="py-6 sm:py-12">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;