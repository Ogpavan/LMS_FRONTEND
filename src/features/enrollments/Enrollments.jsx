import React, { useState, useEffect } from "react";
import {
  CustomModal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalClose,
} from "@/components/ui/CustomModal";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function EnrollStudentsPage() {
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingEnroll, setPendingEnroll] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  // const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Fetch courses
    fetch(`${import.meta.env.VITE_API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          setCourses(
            data.courses.map((c) => ({
              id: c.course_id || c.id,
              label: c.title,
              info: `Language: ${c.language} · Level: ${c.level} · ${
                c.is_free ? "Free" : "Paid"
              } Course`,
            })),
          );
        }
      });
    // Fetch students
    fetch(`${import.meta.env.VITE_API_URL}/students`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(
          data.map((s) => ({
            id: s.user_id,
            label: s.full_name,
            email: s.email,
          })),
        );
      });
  }, []);

  useEffect(() => {
    if (courses.length && !selectedCourse) setSelectedCourse(courses[0]);
  }, [courses]);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-xl font-semibold leading-tight">Enroll Students</h1>
        <p className="text-xs text-muted-foreground">
          Add students to this course
        </p>
      </div>

      {/* Course & Student Dropdowns in a single row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
        <div className="w-full sm:w-1/2">
          <Select
            value={selectedCourse?.id?.toString() || ""}
            onValueChange={(val) => {
              const found = courses.find((c) => c.id.toString() === val);
              if (found) setSelectedCourse(found);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a course..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search student by name or email..."
            className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Course Info */}
      {selectedCourse && (
        <div className="w-full border rounded-lg p-2 bg-background mb-2">
          <h2 className="font-medium text-base leading-tight">
            {selectedCourse.label}
          </h2>
          <div className="text-xs text-muted-foreground mt-1">
            {selectedCourse.info}
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-2 py-2 font-medium">Student</th>
              <th className="text-left px-2 py-2 font-medium">Email</th>
              <th className="text-right px-2 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr className="border-t" key={student.id}>
                <td className="px-2 py-2 font-medium">{student.label}</td>
                <td className="px-2 py-2">{student.email}</td>
                <td className="px-2 py-2 text-right flex gap-2 justify-end">
                  <button
                    className="text-xs px-3 py-1 rounded-md bg-black text-white hover:bg-black/90"
                    onClick={() => {
                      setPendingEnroll(student);
                      setModalOpen(true);
                    }}
                  >
                    Enroll
                  </button>
                  <button
                    className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                    onClick={async () => {
                      // Call cancel enrollment API
                      setEnrollLoading(true);
                      setEnrollSuccess(null);
                      try {
                        // You need to know the enrollment_id for this student in this course
                        // For demo, assume API: /api/enrollments/cancel?student_id=...&course_id=...
                        // But with new backend, use: /api/enrollments/:id/cancel
                        // You may need to fetch the enrollment_id from backend if not available in students[]
                        // Here, we just show a placeholder
                        const enrollmentId = student.enrollment_id; // This must be available in your data
                        if (!enrollmentId) {
                          setEnrollSuccess("No enrollment found to cancel");
                          setEnrollLoading(false);
                          return;
                        }
                        const res = await fetch(
                          `${import.meta.env.VITE_API_URL}/enrollments/${enrollmentId}/cancel`,
                          { method: "POST" },
                        );
                        if (res.ok) {
                          setEnrollSuccess(
                            "Enrollment cancelled successfully!",
                          );
                        } else {
                          const data = await res.json();
                          setEnrollSuccess(
                            data.error || "Failed to cancel enrollment",
                          );
                        }
                      } catch (err) {
                        setEnrollSuccess("Failed to cancel enrollment");
                      }
                      setEnrollLoading(false);
                    }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground mt-2">
        Total enrolled students:{" "}
        <span className="font-medium">{students.length}</span>
      </div>

      {/* Enroll Confirmation Modal */}
      <CustomModal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Confirm Enrollment</ModalTitle>
          </ModalHeader>
          <div className="text-center text-base">
            {pendingEnroll && selectedCourse && (
              <>
                Are you sure you want to enroll <b>{pendingEnroll.label}</b> (
                <span className="text-xs">{pendingEnroll.email}</span>)<br />
                in <b>{selectedCourse.label}</b>?
              </>
            )}
          </div>
          <ModalFooter>
            <button
              type="button"
              className="bg-black text-white rounded-full px-6 py-2 font-semibold shadow-md hover:bg-black/90"
              onClick={() => {
                setModalOpen(false);
                setPendingEnroll(null);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-blue-600 text-white rounded-full px-6 py-2 font-semibold shadow-md hover:bg-blue-700 disabled:opacity-60"
              disabled={enrollLoading}
              onClick={async () => {
                if (!pendingEnroll || !selectedCourse) return;
                setEnrollLoading(true);
                setEnrollSuccess(null);
                try {
                  const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/enrollments`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        student_id: pendingEnroll.id,
                        course_id: selectedCourse.id,
                        enrollment_type: "admin",
                      }),
                    },
                  );
                  if (res.ok) {
                    setEnrollSuccess("Student enrolled successfully!");
                  } else {
                    const data = await res.json();
                    setEnrollSuccess(data.error || "Failed to enroll student");
                  }
                } catch (err) {
                  setEnrollSuccess("Failed to enroll student");
                }
                setEnrollLoading(false);
                setModalOpen(false);
                setPendingEnroll(null);
              }}
            >
              {enrollLoading ? "Enrolling..." : "Confirm & Enroll"}
            </button>
          </ModalFooter>
        </ModalContent>
      </CustomModal>
      {/* Success/Error Message */}
      {enrollSuccess && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-lg shadow-lg text-white z-50 ${
            enrollSuccess.includes("success") ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {enrollSuccess}
        </div>
      )}
    </div>
  );
}
