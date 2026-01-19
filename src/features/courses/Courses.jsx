import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user object from localStorage and parse it
    const userStr = localStorage.getItem("user");
    if (!userStr) return; // user not logged in

    const user = JSON.parse(userStr);
    const userId = user.user_id;
    const roleId = user.role_id;

    let url = `https://app.skillspardha.com/api/courses`;
    // If not admin, filter by user_id
    if (roleId !== 1 && userId) {
      url += `?user_id=${userId}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCourses(data.courses);
      })
      .catch((err) => console.error("Failed to fetch courses:", err));
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/dashboard/course/${courseId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl font-bold pb-4 text-gray-900 dark:text-white">
        Browse Courses
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {courses.map((course) => (
          <Card
            key={course.course_id || course.id}
            className="w-full max-w-xs mx-auto h-58 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col"
            onClick={() => handleCourseClick(course.course_id || course.id)}
          >
            {/* Thumbnail */}
            <div className="relative w-full h-28 bg-gray-100 dark:bg-gray-800 rounded-t-xl overflow-hidden shrink-0">
              <img
                src={
                  course.image_url ||
                  `${import.meta.env.VITE_BASE_URL}/uploads/thumbnails/${course.thumbnail_url}`
                }
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-2 py-0.5 rounded">
                {course.duration}min
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between grow px-4 py-3">
              <div>
                <CardHeader className="p-0 pb-1">
                  <CardTitle className="text-[15px] font-semibold leading-tight text-gray-900 dark:text-white">
                    <div
                      className="line-clamp-1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.title}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="min-h-5">
                    <p
                      className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.description || "No description available"}
                    </p>
                  </div>
                </CardContent>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[11px] text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  {course.level || "N/A"}
                </span>
                <span className="text-[11px] text-gray-600 dark:text-gray-300">
                  {course.language || "N/A"}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Courses;
