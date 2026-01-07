import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // <-- No dummy user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  const signin = async (credentials) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save token
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Save full user (including role_id)
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }

        return { success: true, token: data.token };
      } else {
        return {
          success: false,
          error: data.msg || data.error || "Signin failed",
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userData.email,
            phone: null,
            username: null, // or omit if backend allows
            password: userData.password,
            full_name: userData.name,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error: data.msg || data.error || "Signup failed",
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission);
  };

  const hasAnyRole = (roles) => {
    if (!user || !user.role_id) return false;
    return roles.map(String).includes(String(user.role_id));
  };

  const value = {
    user,
    signin,
    signup,
    signout,
    hasRole,
    hasPermission,
    hasAnyRole,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Role-based permissions
const getPermissionsByRole = (role) => {
  const permissions = {
    admin: [
      "view_dashboard",
      "manage_users",
      "manage_courses",
      "manage_assignments",
      "manage_quizzes",
      "view_reports",
      "manage_settings",
    ],
    instructor: [
      "view_dashboard",
      "manage_courses",
      "manage_assignments",
      "manage_quizzes",
      "view_students",
      "grade_assignments",
      "view_reports",
    ],
    student: [
      "view_dashboard",
      "view_courses",
      "submit_assignments",
      "take_quizzes",
      "view_grades",
    ],
  };

  return permissions[role] || [];
};
