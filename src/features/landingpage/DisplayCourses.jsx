import React, { useEffect, useState } from "react";
import { fetchCategories } from "./api";
import {
  fetchDisplayCourses,
  fetchDisplayCourseDetails,
} from "./displayCourseApi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

function DisplayCourses() {
  // Modal state for adding a course
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [addCourseLoading, setAddCourseLoading] = useState(false);
  const [addCourseError, setAddCourseError] = useState("");
  const [addCourseForm, setAddCourseForm] = useState({
    title: "",
    description: "",
    duration: "",
    level: "Beginner",
    image_url: "",
    category_id: "",
    price: "",
  });
  const [addCourseImageFile, setAddCourseImageFile] = useState(null);
  // Modal state for viewing course
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewCourse, setViewCourse] = useState(null);
  const [viewCourseDetails, setViewCourseDetails] = useState(null);
  const [viewCourseDetailsLoading, setViewCourseDetailsLoading] =
    useState(false);
  const [viewCourseDetailsError, setViewCourseDetailsError] = useState("");
  // Modal state for editing course
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCourseForm, setEditCourseForm] = useState(null);
  const [editCourseLoading, setEditCourseLoading] = useState(false);
  const [editCourseError, setEditCourseError] = useState("");
  // State for delete confirmation
  const [deleteCourseId, setDeleteCourseId] = useState(null);
  const [deleteCourseLoading, setDeleteCourseLoading] = useState(false);
  const [deleteCourseError, setDeleteCourseError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getCategories() {
      setLoading(true);
      setError("");
      const data = await fetchCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setError("Failed to load categories");
      }
      setLoading(false);
    }
    getCategories();
  }, []);

  useEffect(() => {
    async function getCourses() {
      setCoursesLoading(true);
      setCoursesError("");
      const data = await fetchDisplayCourses();
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCoursesError("Failed to load courses");
      }
      setCoursesLoading(false);
    }
    getCourses();
  }, []);

  // Edit course handler
  async function handleEditCourse(e) {
    e.preventDefault();
    setEditCourseLoading(true);
    setEditCourseError("");
    try {
      let imageUrl = editCourseForm.image_url;
      // If a new image file is selected, upload it (optional, not implemented here)
      // You can add image upload logic if needed
      const { updateDisplayCourse } = await import("./displayCourseApi");
      const updated = await updateDisplayCourse(editCourseForm.id, {
        ...editCourseForm,
        image_url: imageUrl,
      });
      setCourses((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );
      setEditModalOpen(false);
      setEditCourseForm(null);
    } catch (err) {
      setEditCourseError(err.message || "Failed to update course");
    }
    setEditCourseLoading(false);
  }

  // Delete course handler
  async function handleDeleteCourse() {
    if (!deleteCourseId) return;
    setDeleteCourseLoading(true);
    setDeleteCourseError("");
    try {
      const { deleteDisplayCourse } = await import("./displayCourseApi");
      await deleteDisplayCourse(deleteCourseId);
      setCourses((prev) => prev.filter((c) => c.id !== deleteCourseId));
      setDeleteCourseId(null);
    } catch (err) {
      setDeleteCourseError(err.message || "Failed to delete course");
    }
    setDeleteCourseLoading(false);
  }

  // Add category handler
  async function handleAddCategory(e) {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    setAddSuccess("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add category");
      }
      const added = await res.json();
      setCategories((prev) => [added, ...prev]);
      setAddSuccess("Category added!");
      setNewCategory({ name: "", slug: "" });
      setShowAddPopup(false);
    } catch (err) {
      setAddError(err.message);
    }
    setAddLoading(false);
  }

  // Add course handler
  async function handleAddCourse(e) {
    e.preventDefault();
    setAddCourseLoading(true);
    setAddCourseError("");
    try {
      let imageUrl = addCourseForm.image_url;
      if (addCourseImageFile) {
        // Upload image to server
        const formData = new FormData();
        formData.append("image", addCourseImageFile);
        const uploadRes = await fetch(
          `${import.meta.env.VITE_API_URL}/upload`,
          {
            method: "POST",
            body: formData,
          },
        );
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData.error || "Image upload failed");
        }
        imageUrl = uploadData.url;
      }
      // Add a default course_code if not provided
      const course_code =
        addCourseForm.course_code && addCourseForm.course_code.trim() !== ""
          ? addCourseForm.course_code
          : `course-${Date.now()}`;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/display-courses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...addCourseForm,
            image_url: imageUrl,
            course_code,
            price: addCourseForm.price || 0,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add course");
      }
      setCourses((prev) => [data, ...prev]);
      setAddCourseModalOpen(false);
      setAddCourseForm({
        title: "",
        description: "",
        duration: "",
        level: "Beginner",
        image_url: "",
        category_id: "",
        course_code: "",
        price: "",
      });
      setAddCourseImageFile(null);
    } catch (err) {
      setAddCourseError(err.message);
    }
    setAddCourseLoading(false);
  }

  // Handler to open view modal and fetch details
  function handleViewCourse(course) {
    navigate(`/dashboard/courses/${course.id}/json`);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">DisplayCourses</h2>
        <Button size="sm" onClick={() => setAddCourseModalOpen(true)}>
          Add Course
        </Button>
      </div>
      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="flex items-center gap-2 mb-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setShowAddPopup(true)}
            size="sm"
            variant="outline"
          >
            Add
          </Button>
        </div>
      )}

      {/* Add Category Popup */}
      {showAddPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 300,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <h3>Add Category</h3>
            <form onSubmit={handleAddCategory}>
              <div style={{ marginBottom: 12 }}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory((c) => ({ ...c, name: e.target.value }))
                    }
                    required
                    style={{ marginLeft: 8 }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>
                  Slug:
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) =>
                      setNewCategory((c) => ({ ...c, slug: e.target.value }))
                    }
                    required
                    style={{ marginLeft: 8 }}
                  />
                </label>
              </div>
              {addError && <p style={{ color: "red" }}>{addError}</p>}
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={addLoading}>
                  {addLoading ? "Adding..." : "Add"}
                </button>
                <button type="button" onClick={() => setShowAddPopup(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {addSuccess && <p style={{ color: "green" }}>{addSuccess}</p>}

      {/* Add Course Modal */}
      {addCourseModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 550,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              position: "relative",
              maxWidth: 420,
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              Add New Course
            </h3>
            <form onSubmit={handleAddCourse} className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={addCourseForm.title}
                  onChange={(e) =>
                    setAddCourseForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={addCourseForm.description}
                  onChange={(e) =>
                    setAddCourseForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={addCourseForm.duration}
                  onChange={(e) =>
                    setAddCourseForm((f) => ({
                      ...f,
                      duration: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <select
                  value={addCourseForm.level}
                  onChange={(e) =>
                    setAddCourseForm((f) => ({ ...f, level: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={addCourseForm.price}
                  onChange={(e) =>
                    setAddCourseForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAddCourseImageFile(e.target.files[0])}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={addCourseForm.category_id}
                  onChange={(e) =>
                    setAddCourseForm((f) => ({
                      ...f,
                      category_id: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {addCourseError && (
                <div className="text-red-600 text-sm">{addCourseError}</div>
              )}
              <div className="flex gap-2 justify-center mt-2">
                <Button type="submit" disabled={addCourseLoading}>
                  {addCourseLoading ? "Adding..." : "Add Course"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddCourseModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <h3 className="mt-8 mb-4 text-xl font-semibold text-gray-900">
        All Courses
      </h3>
      <div className="bg-white rounded shadow p-0 overflow-x-auto">
        {coursesLoading ? (
          <div className="p-4">Loading courses...</div>
        ) : coursesError ? (
          <div className="p-4 text-red-600">{coursesError}</div>
        ) : !Array.isArray(courses) || courses.length === 0 ? (
          <div className="p-4">No courses found.</div>
        ) : (
          <table className="min-w-[800px] w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">S.No</th>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Duration</th>

                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr key={course.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">
                    {course.image_url ? (
                      <img
                        src={
                          course.image_url.startsWith("http")
                            ? course.image_url
                            : `${import.meta.env.VITE_BASE_URL}${course.image_url}`
                        }
                        alt="course"
                        className="w-16 h-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium">{course.title}</td>
                  <td
                    className="px-4 py-2 max-w-[250px] truncate"
                    title={course.description}
                  >
                    {course.description}
                  </td>
                  <td className="px-4 py-2">{course.duration}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewCourse(course)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditCourseForm(course);
                        setEditModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteCourseId(course.id)}
                    >
                      Delete
                    </Button>
                  </td>
                  {/* Edit Course Modal */}
                  {editModalOpen && editCourseForm && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.09)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          padding: 24,
                          borderRadius: 8,
                          minWidth: 550,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          position: "relative",
                          maxWidth: 420,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 20,
                            fontWeight: 600,
                            marginBottom: 8,
                          }}
                        >
                          Edit Course
                        </h3>
                        <form
                          onSubmit={handleEditCourse}
                          className="flex flex-col gap-3"
                        >
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={editCourseForm.title}
                              onChange={(e) =>
                                setEditCourseForm((f) => ({
                                  ...f,
                                  title: e.target.value,
                                }))
                              }
                              className="w-full border rounded px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Description
                            </label>
                            <textarea
                              value={editCourseForm.description}
                              onChange={(e) =>
                                setEditCourseForm((f) => ({
                                  ...f,
                                  description: e.target.value,
                                }))
                              }
                              className="w-full border rounded px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={editCourseForm.duration}
                              onChange={(e) =>
                                setEditCourseForm((f) => ({
                                  ...f,
                                  duration: e.target.value,
                                }))
                              }
                              className="w-full border rounded px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Level
                            </label>
                            <select
                              value={editCourseForm.level}
                              onChange={(e) =>
                                setEditCourseForm((f) => ({
                                  ...f,
                                  level: e.target.value,
                                }))
                              }
                              className="w-full border rounded px-3 py-2"
                              required
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Price (INR)
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={editCourseForm.price}
                              onChange={(e) =>
                                setEditCourseForm((f) => ({
                                  ...f,
                                  price: e.target.value,
                                }))
                              }
                              className="w-full border rounded px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Image URL
                            </label>
                            <input
                              type="text"
                              value={editCourseForm.image_url}
                              onChange={(e) =>
                                setEditCourseForm((f) => ({
                                  ...f,
                                  image_url: e.target.value,
                                }))
                              }
                              className="w-full border rounded px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Category
                            </label>
                            <select
                              value={editCourseForm.category_id}
                              onChange={(e) =>
                                setEditCourseForm((f) => ({
                                  ...f,
                                  category_id: e.target.value,
                                }))
                              }
                              className="w-full border rounded px-3 py-2"
                              required
                            >
                              <option value="" disabled>
                                Select Category
                              </option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {editCourseError && (
                            <div className="text-red-600 text-sm">
                              {editCourseError}
                            </div>
                          )}
                          <div className="flex gap-2 justify-center mt-2">
                            <Button type="submit" disabled={editCourseLoading}>
                              {editCourseLoading ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setEditModalOpen(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  {/* Delete Confirmation Modal */}
                  {deleteCourseId && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.09)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          padding: 24,
                          borderRadius: 8,
                          minWidth: 300,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          position: "relative",
                          maxWidth: 400,
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            marginBottom: 8,
                          }}
                        >
                          Confirm Delete
                        </h3>
                        <div style={{ marginBottom: 16 }}>
                          Are you sure you want to delete this course?
                        </div>
                        {deleteCourseError && (
                          <div className="text-red-600 text-sm mb-2">
                            {deleteCourseError}
                          </div>
                        )}
                        <div className="flex gap-2 justify-center mt-2">
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteCourse}
                            disabled={deleteCourseLoading}
                          >
                            {deleteCourseLoading ? "Deleting..." : "Delete"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteCourseId(null)}
                            disabled={deleteCourseLoading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Simple Modal for Viewing Course */}

                  {viewModalOpen && viewCourse?.id === course.id && (
                    <div
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        background: "rgba(0,0,0,0.09)",
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          padding: 24,
                          borderRadius: 8,
                          minWidth: 300,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          position: "relative",
                          maxWidth: 600,
                          maxHeight: "90vh",
                          overflowY: "auto",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: 20,
                            fontWeight: 600,
                            marginBottom: 8,
                          }}
                        >
                          Course Details
                        </h3>
                        <div style={{ color: "#555", marginBottom: 16 }}>
                          View the course details below.
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <span style={{ fontWeight: 500 }}>Course ID:</span>{" "}
                          {viewCourse?.id}
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <span style={{ fontWeight: 500 }}>Title:</span>{" "}
                          {viewCourse?.title}
                        </div>
                        {/* Display course details */}
                        {viewCourseDetailsLoading ? (
                          <div>Loading details...</div>
                        ) : viewCourseDetailsError ? (
                          <div style={{ color: "red" }}>
                            {viewCourseDetailsError}
                          </div>
                        ) : viewCourseDetails &&
                          viewCourseDetails.course_json ? (
                          <div style={{ marginBottom: 12 }}>
                            <div>
                              <strong>{viewCourseDetails.course_json.t}</strong>
                            </div>
                            <div style={{ margin: "8px 0" }}>
                              <em>{viewCourseDetails.course_json.st}</em>
                            </div>
                            <div style={{ margin: "8px 0" }}>
                              <img
                                src={viewCourseDetails.course_json.image}
                                alt="Course"
                                style={{
                                  width: "100%",
                                  maxWidth: 320,
                                  borderRadius: 8,
                                }}
                              />
                            </div>
                            <div style={{ margin: "8px 0" }}>
                              <strong>Description:</strong>
                              <div>{viewCourseDetails.course_json.d}</div>
                            </div>
                            <div style={{ margin: "8px 0" }}>
                              <strong>Highlights:</strong>
                              <ul style={{ paddingLeft: 18 }}>
                                {viewCourseDetails.course_json.hl.map(
                                  (h, i) => (
                                    <li key={i}>{h}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                            <div style={{ margin: "8px 0" }}>
                              <strong>Curriculum:</strong>
                              <ol style={{ paddingLeft: 18 }}>
                                {viewCourseDetails.course_json.cur.map(
                                  ([num, title, topics]) => (
                                    <li key={num}>
                                      <strong>{title}</strong>
                                      <ul>
                                        {topics.map((topic, idx) => (
                                          <li key={idx}>{topic}</li>
                                        ))}
                                      </ul>
                                    </li>
                                  ),
                                )}
                              </ol>
                            </div>
                            <div style={{ margin: "8px 0" }}>
                              <strong>Schedule:</strong>
                              <ul>
                                {viewCourseDetails.course_json.sch.map(
                                  (s, i) => (
                                    <li key={i}>{s}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                            <div style={{ margin: "8px 0" }}>
                              <strong>Projects:</strong>
                              <ul>
                                {viewCourseDetails.course_json.proj.map(
                                  (p, i) => (
                                    <li key={i}>{p}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                            <div style={{ margin: "8px 0" }}>
                              <strong>Certificate:</strong>{" "}
                              {viewCourseDetails.course_json.cert}
                            </div>
                            <div style={{ margin: "8px 0" }}>
                              <strong>Price:</strong>{" "}
                              {Array.isArray(
                                viewCourseDetails.course_json.price,
                              )
                                ? viewCourseDetails.course_json.price.join(
                                    " / ",
                                  )
                                : viewCourseDetails.course_json.price}
                            </div>
                          </div>
                        ) : null}
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setViewModalOpen(false)}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DisplayCourses;
