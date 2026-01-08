import React, { useState, useEffect } from "react";
import { href, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { cn } from "../../lib/utils.js";
import {
  faHome,
  faBookOpen,
  faClipboardList,
  faFileAlt,
  faUsers,
  faUser,
  faCog,
  faPowerOff,
  faSun,
  faVideo,
  faMoon,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Power, X } from "lucide-react";
import axios from "axios"; // If not installed, run: npm install axios

const icons = {
  Home: faHome,
  BookOpen: faBookOpen,
  ClipboardList: faClipboardList,
  FileText: faFileAlt,
  Settings: faCog,
  User: faUser,
  Users: faUsers,
  Power: faPowerOff,
  Sun: faSun,
  Moon: faMoon,
  X: faTimes,
  Video: faVideo, // <-- Add this mapping
};

const roleLabels = {
  1: "Admin",
  2: "Student",
  3: "Instructor",
};

const Sidebar = ({ onClose }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [theme, setTheme] = useState("light");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { user, signout, hasAnyRole } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      if (user?.role_id) {
        try {
          const res = await axios.get(`/menu/${user.role_id}`);
          setMenuItems(res.data.menu); // assuming { menu: [...] }
        } catch (err) {
          console.error("Failed to fetch menu:", err);
        }
      }
    };
    fetchMenu();
  }, [user?.role_id]);

  // Replace navigationItems with menuItems from API
  const filteredNavItems = menuItems.map((item) => ({
    name: item.name,
    href: item.href,
    icon: item.icon, // icon string from DB, must match your icons mapping
  }));

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      signout();
      navigate("/auth/signin");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLogoutLoading(false);
      setLogoutOpen(false);
    }
  };

  // Get role label based on role_id
  const roleLabel = user?.role_id ? roleLabels[user.role_id] || "User" : "Role";

  return (
    <div className="h-full flex items-start justify-center p-3">
      <div
        className="group"
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div
          className={`
            backdrop-blur-3xl bg-white/30 border border-white/20
            dark:bg-gray-900/30 dark:border-gray-700/20
            rounded-2xl shadow-2xl 
            flex flex-col transition-all duration-500 ease-out 
            overflow-y-hidden overflow-x-hidden
            before:absolute before:inset-0 before:bg-linear-to-br 
            before:from-white/10 before:to-transparent before:rounded-2xl
            relative
            ${collapsed ? "w-16" : "w-52"}
          `}
          style={{
            height: "calc(100vh - 24px)", // Full height minus padding
            minHeight: "600px", // Minimum height
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Close button for mobile */}
          <div className="lg:hidden flex justify-end p-2 shrink-0 relative z-10">
            <button
              onClick={onClose}
              className="p-2 text-gray-600/80 hover:text-gray-800 dark:text-gray-300/80 dark:hover:text-gray-100 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Header */}
          <div
            className={`flex flex-col items-start gap-3 border-b border-white/10 dark:border-gray-700/20 p-4 transition-all duration-300 shrink-0 relative z-10 ${
              collapsed ? "items-center p-3" : ""
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="bg-linear-to-br from-blue-500/90 to-purple-600/90 rounded-xl p-2 shadow-lg backdrop-blur-sm border border-white/20">
                <span className="text-white text-lg font-bold">📚</span>
              </div>
              <div
                className={`flex flex-col overflow-hidden transition-all duration-500 ease-out ${
                  collapsed
                    ? "w-0 opacity-0 translate-x-2"
                    : "w-auto opacity-100 translate-x-0"
                }`}
              >
                <div className="text-xs font-medium text-gray-500/80 dark:text-gray-400/80 uppercase tracking-wide">
                  {roleLabel}
                </div>
                <div className="font-semibold text-gray-800/90 dark:text-gray-100/90 text-sm text-nowrap">
                  {user?.full_name || "User"}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Content - Takes remaining space */}
          <div className="flex-1 py-4   relative z-10 overflow-y-hidden">
            <div className="space-y-1">
              {filteredNavItems.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="px-3 text-nowrap font-normal tracking-tight"
                  >
                    <NavLink
                      to={item.href}
                      onClick={() => onClose?.()}
                      end={item.href === "/dashboard"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center  py-1 rounded-xl transition-all duration-300 group backdrop-blur-sm",
                          collapsed ? "justify-center px-2" : "px-3",
                          isActive
                            ? "  text-blue-700 dark:text-blue-300 font-semibold border border-blue-500/30"
                            : "text-gray-700/90 dark:text-gray-300/90 hover:bg-white/20 dark:hover:bg-gray-800/20 hover:text-gray-900 dark:hover:text-gray-100"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={cn(
                              "shrink-0 transition-colors duration-300",
                              isActive
                                ? "text-blue-500 dark:text-blue-400"
                                : "text-gray-500/80 dark:text-gray-400/80 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                            )}
                          >
                            <FontAwesomeIcon
                              icon={icons[item.icon]}
                              size="lg"
                            />
                          </span>
                          <span
                            className={`overflow-hidden transition-all duration-500 ease-out text-sm font-medium ${
                              collapsed
                                ? "w-0 opacity-0 translate-x-2"
                                : "w-auto opacity-100 ml-3"
                            }`}
                          >
                            {item.name}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spacer to push bottom items down */}
          <div className="shrink-0 py-4"></div>

          {/* Theme Toggle & Logout - Fixed at bottom */}
          <div className="px-3 pb-3 flex flex-col items-center w-full space-y-2 shrink-0 border-t border-white/10 dark:border-gray-700/20 pt-3 relative z-10">
            <button
              onClick={handleThemeToggle}
              className={`flex items-center w-full py-2 rounded-xl transition-all duration-300 group backdrop-blur-sm ${
                collapsed ? "justify-center px-2" : "px-3"
              } ${
                theme === "dark"
                  ? "bg-gray-800/40 text-white/90 hover:bg-gray-700/60 border border-gray-600/30"
                  : "text-gray-800/90 hover:bg-white/30 border border-gray-300/30"
              }`}
            >
              <span className="shrink-0 transition-colors duration-300">
                <FontAwesomeIcon
                  icon={theme === "dark" ? icons.Moon : icons.Sun}
                  size="lg"
                />
              </span>
              {!collapsed && (
                <span className="ml-3 text-sm font-medium">
                  {theme === "dark" ? "Dark" : "Light"}
                </span>
              )}
            </button>

            <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
              <DialogTrigger asChild>
                <button
                  className={`flex items-center w-full py-2 rounded-xl text-red-500/90 hover:bg-red-50/30 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-300 group backdrop-blur-sm border border-red-200/30 dark:border-red-800/30 ${
                    collapsed ? "justify-center px-2" : "px-3"
                  }`}
                >
                  <span className="shrink-0 text-red-500/90 group-hover:text-red-600 transition-colors duration-300">
                    <Power size={20} />
                  </span>
                  {!collapsed && (
                    <span className="ml-3 text-sm font-medium">Logout</span>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Logout</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to logout?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setLogoutOpen(false)}
                    disabled={logoutLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {logoutLoading ? "Logging out..." : "Logout"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
