import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar.jsx";
import MobileBottomNav from "../components/shared/MobileBottomNav.jsx";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Desktop Sidebar - Fixed positioning for hover expansion */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen z-30">
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content with dynamic left margin for desktop */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden lg:ml-20">
        {/* Main content area - Add bottom padding for mobile nav */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 lg:pb-0">
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
};

export default DashboardLayout;
