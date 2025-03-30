
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import EspositoreDetail from "./pages/EspositoreDetail";
import GestioneFierePage from "./pages/GestioneFierePage";
import GestioneCategoriePage from "./pages/GestioneCategoriePage";
import GestioneEspositoriPage from "./pages/GestioneEspositoriPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/fiere" element={<GestioneFierePage />} />
          <Route path="/admin/categorie" element={<GestioneCategoriePage />} />
          <Route path="/admin/espositori" element={<GestioneEspositoriPage />} />
          <Route path="/espositori/:id" element={<EspositoreDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
