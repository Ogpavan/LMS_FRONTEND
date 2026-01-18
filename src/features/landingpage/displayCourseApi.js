// Update a display course
export async function updateDisplayCourse(id, data) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/display-courses/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) throw new Error("Failed to update course");
    return await response.json();
  } catch (err) {
    console.error("Error updating display course:", err);
    throw err;
  }
}

// Delete a display course
export async function deleteDisplayCourse(id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/display-courses/${id}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) throw new Error("Failed to delete course");
    return await response.json();
  } catch (err) {
    console.error("Error deleting display course:", err);
    throw err;
  }
}
// Utility to fetch all display courses
export async function fetchDisplayCourses() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/display-courses`,
    );
    if (!response.ok) throw new Error("Failed to fetch courses");
    return await response.json();
  } catch (err) {
    console.error("Error fetching display courses:", err);
    return [];
  }
}

// Get display course details by course ID
export async function fetchDisplayCourseDetails(courseId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/display-courses/${courseId}/details`,
    );
    if (!response.ok) throw new Error("Failed to fetch course details");
    return await response.json();
  } catch (err) {
    console.error("Error fetching display course details:", err);
    throw err;
  }
}

// Save display course JSON
export async function saveDisplayCourseJson(id, courseJson) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/display-courses/${id}/details`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_json: courseJson }),
    },
  );
  if (!res.ok) throw new Error("Failed to save course JSON");
  return res.json();
}
