import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import Signin from "../features/auth/Signin.jsx";
import Signup from "../features/auth/Signup.jsx";
import Dashboard from "../features/dashboard/Dashboard.jsx";
import Courses from "../features/courses/Courses.jsx";
import Assignments from "../features/assignments/Assignments.jsx";
import Quizzes from "../features/quizzes/Quizzes.jsx";
import Students from "../features/students/Students.jsx";
import Instructors from "../features/instructors/Instructors.jsx";
import Settings from "../features/settings/Settings.jsx";
import CourseView from "@/features/courses/CourseView.jsx";
import Liveclass from "@/features/liveclass/Liveclass.jsx";
import UploadCourse from "../features/courses/UploadCourse.jsx";
import CreateClass from "@/features/liveclass/CreateClass.jsx";
import Enrollments from "@/features/enrollments/Enrollments.jsx";
import DisplayCourses from "@/features/landingpage/DisplayCourses.jsx";
import CourseJsonEditor from "@/features/landingpage/CourseJsonEditor.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "signin",
            element: <Signin />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "courses",
            element: (
              <ProtectedRoute allowedRoles={["admin", "instructor", "student"]}>
                <Courses />
              </ProtectedRoute>
            ),
          },
          {
            path: "displaycourses",
            element: (
              <ProtectedRoute allowedRoles={["admin", "instructor", "student"]}>
                <DisplayCourses />
              </ProtectedRoute>
            ),
          },
          {
            path: "course/:courseId",
            element: (
              <ProtectedRoute allowedRoles={["admin", "instructor", "student"]}>
                <CourseView />
              </ProtectedRoute>
            ),
          },
          {
            path: "assignments",
            element: (
              <ProtectedRoute allowedRoles={["admin", "instructor", "student"]}>
                <Assignments />
              </ProtectedRoute>
            ),
          },
          {
            path: "liveclass",
            element: (
              <ProtectedRoute allowedRoles={["admin", "instructor", "student"]}>
                <Liveclass />
              </ProtectedRoute>
            ),
          },
          {
            path: "quizzes",
            element: (
              <ProtectedRoute allowedRoles={["admin", "instructor", "student"]}>
                <Quizzes />
              </ProtectedRoute>
            ),
          },
          {
            path: "students",
            element: (
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <Students />
              </ProtectedRoute>
            ),
          },
          {
            path: "instructors",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <Instructors />
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            ),
          },
          {
            path: "courses/upload",
            element: (
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <UploadCourse />
              </ProtectedRoute>
            ),
          },
          {
            path: "CreateClass",
            element: (
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <CreateClass />
              </ProtectedRoute>
            ),
          },
          {
            path: "Enrollments",
            element: (
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <Enrollments />
              </ProtectedRoute>
            ),
          },
          {
            path: "courses/:id/json",
            element: <CourseJsonEditor />,
          },
        ],
      },
    ],
  },
]);
