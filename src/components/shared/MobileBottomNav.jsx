import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { cn } from "../../lib/utils.js";
import {
  faHome,
  faBookOpen,
  faClipboardList,
  faFileAlt,
  faUsers,
  faUser,
  faPowerOff,
  faCog,
  faSun,
  faMoon,
  faTimes,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

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
  Video: faVideo  , // <-- Add this mapping
};

const MobileBottomNav = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      if (user?.role_id) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/menu/${user.role_id}`,
          );
          setMenuItems(res.data.menu || []);
        } catch (err) {
          console.error("Failed to fetch menu:", err);
        }
      }
    };
    fetchMenu();
  }, [user?.role_id]);

  // Show all menu items, but only 4 visible at a time with horizontal scroll
  const maxVisible = 4;
  const filteredNavItems = menuItems;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-1">
        <div
          className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{
            WebkitOverflowScrolling: "touch",
            maxWidth: "100vw",
          }}
        >
          {filteredNavItems.map((item) => {
            const IconComponent = icons[item.icon];
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[70px]",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 active:bg-gray-50",
                  )
                }
                style={{ flex: `0 0 calc(100vw/${maxVisible})` }}
              >
                {({ isActive }) => (
                  <>
                    {IconComponent ? (
                      <FontAwesomeIcon
                        icon={IconComponent}
                        className={cn(
                          "transition-colors duration-200",
                          isActive ? "text-blue-600" : "text-gray-500",
                        )}
                        size="lg"
                      />
                    ) : null}
                    <span
                      className={cn(
                        "text-[0.5rem] font-normal mt-1 transition-colors duration-200",
                        isActive ? "text-blue-600" : "text-gray-500",
                      )}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
