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
import {
  CustomModal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from "@/components/ui/CustomModal";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusStudent, setStatusStudent] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState(null);

  // Add student modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/students`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.students || [];
        setStudents(arr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Open edit modal and set form values
  const handleEdit = (student) => {
    setEditStudent(student);
    setEditForm({
      full_name: student.full_name || "",
      email: student.email || "",
      phone: student.phone || "",
    });
    setEditModalOpen(true);
  };

  // Handle form input change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes (implement API call as needed)
  const handleEditSave = async () => {
    try {
      // Only include password if not blank
      const payload = { ...editForm };
      if (!payload.password) {
        delete payload.password;
      }
      await fetch(
        `${import.meta.env.VITE_API_URL}/students/${editStudent.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      setStudents((prev) =>
        prev.map((s) =>
          s.user_id === editStudent.user_id ? { ...s, ...editForm } : s,
        ),
      );
      setEditModalOpen(false);
      setEditStudent(null);
    } catch {
      alert("Failed to update student.");
    }
  };

  // Open delete modal
  const handleDelete = (student) => {
    setDeleteStudent(student);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/students/${deleteStudent.user_id}`,
        { method: "DELETE" },
      );
      setStudents((prev) =>
        prev.filter((s) => s.user_id !== deleteStudent.user_id),
      );
      setDeleteModalOpen(false);
      setDeleteStudent(null);
    } catch {
      alert("Failed to delete student.");
    }
  };

  const handleToggleStatus = (student) => {
    setStatusStudent(student);
    setStatusModalOpen(true);
  };

  const handleStatusConfirm = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/students/${
          statusStudent.user_id
        }/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !statusStudent.is_active }),
        },
      );
      setStudents((prev) =>
        prev.map((s) =>
          s.user_id === statusStudent.user_id
            ? { ...s, is_active: !s.is_active }
            : s,
        ),
      );
      setStatusModalOpen(false);
      setStatusStudent(null);
    } catch {
      alert("Failed to update status.");
    }
  };

  // Add student handlers
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...addForm,
          password: addForm.password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setStudents((prev) => [...prev, data.user]);
        setAddModalOpen(false);
        setAddForm({ full_name: "", email: "", phone: "", password: "" });
      } else {
        alert(data.error || "Failed to add student.");
      }
    } catch {
      alert("Failed to add student.");
    }
    setAddLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
        <Button onClick={() => setAddModalOpen(true)}>Add Student</Button>
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
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>Loading...</TableCell>
              </TableRow>
            ) : !Array.isArray(students) || students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>No students found.</TableCell>
              </TableRow>
            ) : (
              students.map((s, idx) => (
                <TableRow key={s.user_id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{s.full_name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={s.is_active ? "success" : "outline"}
                      className={
                        s.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }
                      onClick={() => handleToggleStatus(s)}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {s.created_at
                      ? new Date(s.created_at).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(s)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add Student Modal */}
      <CustomModal open={addModalOpen} onOpenChange={setAddModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Student</ModalTitle>
            <ModalDescription>
              Enter details to create a new student.
            </ModalDescription>
          </ModalHeader>
          <form
            onSubmit={handleAddStudent}
            className="flex flex-col gap-4"
            autoComplete="off"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="full_name"
                value={addForm.full_name}
                onChange={handleAddFormChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={addForm.email}
                onChange={handleAddFormChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={addForm.phone}
                onChange={handleAddFormChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={addForm.password}
                onChange={handleAddFormChange}
                className="w-full border rounded px-3 py-2"
                required
                autoComplete="new-password"
              />
            </div>
            <ModalFooter>
              <Button type="submit" disabled={addLoading}>
                {addLoading ? "Adding..." : "Add"}
              </Button>
              <ModalClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </ModalClose>
            </ModalFooter>
          </form>
        </ModalContent>
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal open={editModalOpen} onOpenChange={setEditModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit Student</ModalTitle>
            <ModalDescription>
              Update the student's details below.
            </ModalDescription>
          </ModalHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSave();
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="full_name"
                value={editForm.full_name}
                onChange={handleEditFormChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditFormChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={editForm.phone}
                onChange={handleEditFormChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={editForm.password || ""}
                onChange={handleEditFormChange}
                className="w-full border rounded px-3 py-2"
                autoComplete="new-password"
                placeholder="Leave blank to keep unchanged"
              />
            </div>
            <ModalFooter>
              <Button type="submit">Save</Button>
              <ModalClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </ModalClose>
            </ModalFooter>
          </form>
        </ModalContent>
      </CustomModal>

      {/* Status Modal */}
      <CustomModal open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {statusStudent?.is_active ? "Deactivate" : "Activate"} Student
            </ModalTitle>
            <ModalDescription>
              Are you sure you want to{" "}
              {statusStudent?.is_active ? "deactivate" : "activate"}{" "}
              <b>{statusStudent?.full_name}</b>?
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button onClick={handleStatusConfirm}>
              Yes, {statusStudent?.is_active ? "Deactivate" : "Activate"}
            </Button>
            <ModalClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </CustomModal>

      {/* Delete Modal */}
      <CustomModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Student</ModalTitle>
            <ModalDescription>
              Are you sure you want to delete <b>{deleteStudent?.full_name}</b>?
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button onClick={handleDeleteConfirm} variant="destructive">
              Yes, Delete
            </Button>
            <ModalClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </CustomModal>
    </div>
  );
}

export default Students;
