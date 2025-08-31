import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import AppLayout from "./components/layout/AppLayout";
import Vitals from "./pages/Vitals";
import Labs from "./pages/Labs";
import Lifestyle from "./pages/Lifestyle";
import Simulator from "./pages/Simulator";
import OrganHealth from "./pages/OrganHealth";
import DoctorShare from "./pages/DoctorShare";
import Settings from "./pages/Settings";
import ConnectDevices from "./pages/ConnectDevices";
import UploadImaging from "./pages/UploadImaging";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/vitals" element={<Vitals />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/lifestyle" element={<Lifestyle />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/organ-health" element={<OrganHealth />} />
            <Route path="/doctor-share" element={<DoctorShare />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/connect-devices" element={<ConnectDevices />} />
            <Route path="/upload-imaging" element={<UploadImaging />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
