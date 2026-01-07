import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const Header = () => {
  const { user, signout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 text-gray-400">👤</div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {user?.role}
              </span>
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-600">
              ⚙️
            </button>

            <button
              onClick={signout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Sign out"
            >
              🚪
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
