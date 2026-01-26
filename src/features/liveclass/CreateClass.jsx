import React, { useState, useEffect } from "react";
import {
  CustomModal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalClose,
  ModalDescription,
} from "@/components/ui/CustomModal";
// Removed Calendar import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

// Helper to get user from localStorage
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function CreateClass() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    course_id: "",
    // Remove chapter_id
  });

  const [message, setMessage] = useState("");
  const [createdClass, setCreatedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [ownClasses, setOwnClasses] = useState([]);
  const [suspendModal, setSuspendModal] = useState({
    open: false,
    classId: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    classId: null,
  });
  // Delete class handler
  const handleDelete = async (classId) => {
    const res = await fetch(
      `https://app.skillspardha.com/api/liveclasses/${classId}/cancel`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (res.ok) {
      setOwnClasses((prev) => prev.filter((c) => c.id !== classId));
    }
    setDeleteModal({ open: false, classId: null });
  };
  const navigate = useNavigate();

  // Fetch courses only (no chapters)
  useEffect(() => {
    fetch(`https://app.skillspardha.com/api/liveclasses/courses-with-chapters`)
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      });
  }, []);

  // Fetch own live classes (instructor)
  const fetchOwnClasses = () => {
    const user = getUser();
    if (!user?.user_id) return;
    fetch(
      `https://app.skillspardha.com/api/liveclasses?teacher_id=${user.user_id}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.liveClasses) setOwnClasses(data.liveClasses);
      });
  };

  useEffect(() => {
    fetchOwnClasses();
  }, []);

  // Remove chapters state and related logic
  // Remove useEffect for chapters

  // Calendar and Google Calendar integration removed

  /* ---------------- Helpers ---------------- */
  // Get today's date in yyyy-mm-dd
  const todayStr = React.useMemo(() => {
    const d = new Date();
    const m = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent selecting a past date
    if (name === "date" && value < todayStr) return;
    // Prevent endTime < startTime (on same day)
    if (name === "endTime" && form.date === todayStr && value < form.startTime)
      return;
    setForm({ ...form, [name]: value });
  };

  // Date select handler removed

  // Conflict check removed (no Google Calendar)
  const conflict = false;

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (conflict) return;
    // Validate date is not in the past
    if (form.date < todayStr) {
      setMessage("Date cannot be in the past.");
      return;
    }
    // Validate end time is not less than start time (on same day)
    if (form.endTime && form.startTime && form.endTime < form.startTime) {
      setMessage("End time cannot be before start time.");
      return;
    }
    setLoading(true);

    // Get user from localStorage
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {}

    const res = await fetch(`https://app.skillspardha.com/api/liveclasses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ...form,
        instructor: user?.full_name || "",
        teacher_id: user?.user_id || "",
        start_time: new Date(`${form.date}T${form.startTime}`).toISOString(),
        end_time: new Date(`${form.date}T${form.endTime}`).toISOString(),
      }),
    });

    setLoading(false);

    if (res.status === 401) {
      // Unauthorized, redirect to Google login page (backend route)
      window.location.href = `https://app.skillspardha.com/api/google/login`;
      return;
    }

    const data = await res.json();
    if (data.success) {
      setMessage("Live class scheduled successfully");
      setCreatedClass(data.liveClass || null);
      setForm({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        course_id: "",
      });
      fetchOwnClasses();
    } else {
      setMessage("Failed to create class");
      setCreatedClass(null);
    }
  };

  /* ---------------- UI ---------------- */
  // Suspend class handler
  const handleSuspend = async (classId) => {
    const res = await fetch(
      `https://app.skillspardha.com/api/liveclasses/${classId}/suspend`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    if (res.ok) {
      setOwnClasses((prev) =>
        prev.map((c) =>
          c.id === classId
            ? { ...c, is_suspended: true, status: "suspended" }
            : c,
        ),
      );
    }
    setSuspendModal({ open: false, classId: null });
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Form */}
        <div className="md:w-1/2 w-full">
          <Card className="py-4">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Class</CardTitle>
              <p className="text-sm text-muted-foreground">
                Create and schedule a live class
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ...existing code... */}
                <div>
                  <label className="block text-xs mb-1">Title</label>
                  <Input
                    name="title"
                    placeholder="Class title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Description</label>
                  <Textarea
                    name="description"
                    placeholder="Short description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 ">
                  <div>
                    <label className="block text-xs mb-1">Date</label>
                    <Input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      min={todayStr}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Start Time</label>
                    <Input
                      type="time"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">End Time</label>
                    <Input
                      type="time"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      min={form.startTime || undefined}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1">Course</label>
                  <select
                    name="course_id"
                    value={form.course_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-2 py-2"
                    required
                  >
                    <option value="">Select course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Removed chapter dropdown */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Live Class"}
                </Button>
                {message && (
                  <p className="text-center text-sm text-muted-foreground">
                    {message}
                  </p>
                )}

                {/* Show created class details if available */}
              </form>
            </CardContent>
          </Card>
        </div>
        {/* Right: Scheduled classes list */}
        <div className="md:w-1/2 w-full overflow-y-auto max-h-[80vh]">
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="text-lg ">Scheduled Live Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {ownClasses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No upcoming classes.
                </p>
              ) : (
                <div className="space-y-4">
                  {ownClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="border rounded p-3 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{cls.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {cls.course_title} &bull; {cls.chapter_title}
                        </div>
                        <div className="text-xs">
                          {cls.start_time
                            ? new Date(cls.start_time).toLocaleString()
                            : "-"}{" "}
                          -{" "}
                          {cls.end_time
                            ? new Date(cls.end_time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </div>
                        <div className="text-xs">
                          Status:{" "}
                          <span
                            className={
                              cls.is_suspended || cls.status === "suspended"
                                ? "text-red-600"
                                : "text-green-700"
                            }
                          >
                            {cls.is_suspended || cls.status === "suspended"
                              ? "Suspended"
                              : "Active"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        {cls.meet_link &&
                          !(cls.is_suspended || cls.status === "suspended") && (
                            <Button
                              asChild
                              variant="outline"
                              className="text-xs px-3 py-1 border-blue-500 text-blue-600 hover:bg-blue-50"
                            >
                              <a
                                href={cls.meet_link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Join
                              </a>
                            </Button>
                          )}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="text-xs px-3 py-1 border-red-500 text-red-600 hover:bg-red-50"
                            disabled={
                              cls.is_suspended || cls.status === "suspended"
                            }
                            onClick={() =>
                              setSuspendModal({ open: true, classId: cls.id })
                            }
                          >
                            Suspend
                          </Button>
                          <Button
                            variant="outline"
                            className="text-xs px-3 py-1 border-gray-500 text-gray-600 hover:bg-gray-50"
                            onClick={() =>
                              setDeleteModal({ open: true, classId: cls.id })
                            }
                          >
                            Delete
                          </Button>
                        </div>
                        {/* Delete confirmation modal */}
                        <CustomModal
                          open={deleteModal.open}
                          onOpenChange={(open) =>
                            setDeleteModal((prev) => ({ ...prev, open }))
                          }
                        >
                          <ModalContent>
                            <ModalHeader>
                              <ModalTitle>Delete Live Class</ModalTitle>
                              <ModalDescription>
                                Are you sure you want to delete this class? This
                                will cancel the Google Meet and remove the class
                                permanently.
                              </ModalDescription>
                            </ModalHeader>
                            <ModalFooter>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setDeleteModal({ open: false, classId: null })
                                }
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() =>
                                  handleDelete(deleteModal.classId)
                                }
                              >
                                Yes, Delete
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </CustomModal>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Suspend confirmation modal */}
      <CustomModal
        open={suspendModal.open}
        onOpenChange={(open) => setSuspendModal((prev) => ({ ...prev, open }))}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Confirm Suspension</ModalTitle>
            <ModalDescription>
              Are you sure you want to suspend this class? This action cannot be
              undone.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setSuspendModal({ open: false, classId: null })}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => handleSuspend(suspendModal.classId)}
            >
              Yes, Suspend
            </Button>
          </ModalFooter>
        </ModalContent>
      </CustomModal>
    </div>
  );
}
