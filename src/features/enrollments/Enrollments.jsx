import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function Enrollments() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          "https://app.skillspardha.com/api/enrollments/paid",
        );
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data.students || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleToggleApprove = async (userId, isApproved) => {
    setTogglingId(userId);
    try {
      const endpoint = isApproved
        ? `https://app.skillspardha.com/api/auth/users/${userId}/unapprove`
        : `https://app.skillspardha.com/api/auth/users/${userId}/approve`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to toggle approval");
      setStudents((prev) =>
        prev.map((s) =>
          s.user_id === userId ? { ...s, is_approved: !isApproved } : s,
        ),
      );
    } catch (err) {
      alert("Error toggling approval: " + err.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleShowDetails = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Student Enrollments
        </h1>
      </div>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6}>Error: {error}</TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No students found.</TableCell>
              </TableRow>
            ) : (
              students.map((student, idx) => (
                <TableRow key={student.user_id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{student.full_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={student.is_approved ? "success" : "outline"}
                      className={
                        student.is_approved
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }
                      disabled={togglingId === student.user_id}
                      onClick={() =>
                        handleToggleApprove(
                          student.user_id,
                          student.is_approved,
                        )
                      }
                    >
                      {togglingId === student.user_id
                        ? "Processing..."
                        : student.is_approved
                          ? "Approved"
                          : "Pending"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShowDetails(student)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Modal for course details */}
      {modalOpen && selectedStudent && (
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
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              minWidth: "320px",
              maxWidth: "90vw",
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">
              {selectedStudent.full_name}'s Courses
            </h2>
            {selectedStudent.courses && selectedStudent.courses.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #eee", padding: "6px" }}>
                      Title
                    </th>
                    <th style={{ border: "1px solid #eee", padding: "6px" }}>
                      Payment
                    </th>
                    <th style={{ border: "1px solid #eee", padding: "6px" }}>
                      Mode
                    </th>
                    <th style={{ border: "1px solid #eee", padding: "6px" }}>
                      Enrolled At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.courses.map((course) => (
                    <tr key={course.enrollment_id}>
                      <td style={{ border: "1px solid #eee", padding: "6px" }}>
                        {course.course_title}
                      </td>
                      <td style={{ border: "1px solid #eee", padding: "6px" }}>
                        {course.payment_status}
                      </td>
                      <td style={{ border: "1px solid #eee", padding: "6px" }}>
                        {course.payment_mode}
                      </td>
                      <td style={{ border: "1px solid #eee", padding: "6px" }}>
                        {new Date(course.enrolled_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No courses found.</div>
            )}
            <div style={{ textAlign: "right", marginTop: "1rem" }}>
              <Button size="sm" variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enrollments;
