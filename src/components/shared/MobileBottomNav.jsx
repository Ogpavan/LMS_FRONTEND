import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { cn } from "../../lib/utils.js";
import {
  Home,
  BookOpen,
  ClipboardList,
  FileText,
  Users,
  User,
} from "lucide-react";

const icons = {
  Home,
  BookOpen,
  ClipboardList,
  FileText,
  Users,
  User,
};

const MobileBottomNav = () => {
  const { hasAnyRole } = useAuth();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "Home",
      roles: ["admin", "instructor", "student"],
    },
    {
      name: "Courses",
      href: "/dashboard/courses",
      icon: "BookOpen",
      roles: ["admin", "instructor", "student"],
    },
    {
      name: "Tasks",
      href: "/dashboard/assignments",
      icon: "ClipboardList",
      roles: ["admin", "instructor", "student"],
    },
    {
      name: "Quizzes",
      href: "/dashboard/quizzes",
      icon: "FileText",
      roles: ["admin", "instructor", "student"],
    },
    {
      name: "People",
      href: "/dashboard/students",
      icon: "Users",
      roles: ["admin", "instructor"],
    },
    {
      name: "Profile",
      href: "/dashboard/settings",
      icon: "User",
      roles: ["student"],
    },
  ];

  const filteredNavItems = navigationItems
    .filter((item) => hasAnyRole(item.roles))
    .slice(0, 5); // Limit to 5 items for mobile

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-1">
        <div className="flex justify-around items-center">
          {filteredNavItems.map((item) => {
            const IconComponent = icons[item.icon];
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 active:bg-gray-50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <IconComponent
                      size={20}
                      className={cn(
                        "transition-colors duration-200",
                        isActive ? "text-blue-600" : "text-gray-500"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium mt-1 transition-colors duration-200",
                        isActive ? "text-blue-600" : "text-gray-500"
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
