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

function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editInstructor, setEditInstructor] = useState(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusInstructor, setStatusInstructor] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInstructor, setDeleteInstructor] = useState(null);

  // Add instructor modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/instructors/role/2`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data.users) ? data.users : [];
        setInstructors(arr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Open edit modal and set form values
  const handleEdit = (instructor) => {
    setEditInstructor(instructor);
    setEditForm({
      full_name: instructor.full_name || "",
      email: instructor.email || "",
      phone: instructor.phone || "",
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

  // Save changes
  const handleEditSave = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/instructors/${editInstructor.user_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editForm, role_id: 2 }),
        }
      );
      setInstructors((prev) =>
        prev.map((s) =>
          s.user_id === editInstructor.user_id ? { ...s, ...editForm } : s
        )
      );
      setEditModalOpen(false);
      setEditInstructor(null);
    } catch {
      alert("Failed to update instructor.");
    }
  };

  // Open delete modal
  const handleDelete = (instructor) => {
    setDeleteInstructor(instructor);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/instructors/${
          deleteInstructor.user_id
        }`,
        { method: "DELETE" }
      );
      setInstructors((prev) =>
        prev.filter((s) => s.user_id !== deleteInstructor.user_id)
      );
      setDeleteModalOpen(false);
      setDeleteInstructor(null);
    } catch {
      alert("Failed to delete instructor.");
    }
  };

  const handleToggleStatus = (instructor) => {
    setStatusInstructor(instructor);
    setStatusModalOpen(true);
  };

  const handleStatusConfirm = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/instructors/${
          statusInstructor.user_id
        }/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !statusInstructor.is_active }),
        }
      );
      setInstructors((prev) =>
        prev.map((s) =>
          s.user_id === statusInstructor.user_id
            ? { ...s, is_active: !s.is_active }
            : s
        )
      );
      setStatusModalOpen(false);
      setStatusInstructor(null);
    } catch {
      alert("Failed to update status.");
    }
  };

  // Add instructor handlers
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInstructor = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/instructors/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...addForm,
            role_id: 2,
          }),
        }
      );
      const data = await res.json();
      if (res.ok && data.user) {
        setInstructors((prev) => [...prev, data.user]);
        setAddModalOpen(false);
        setAddForm({ full_name: "", email: "", phone: "", password: "" });
      } else {
        alert(data.error || "Failed to add instructor.");
      }
    } catch {
      alert("Failed to add instructor.");
    }
    setAddLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Instructors</h1>
        <Button onClick={() => setAddModalOpen(true)}>Add Instructor</Button>
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
            ) : !Array.isArray(instructors) || instructors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>No instructors found.</TableCell>
              </TableRow>
            ) : (
              instructors.map((s, idx) => (
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

      {/* Add Instructor Modal */}
      <CustomModal open={addModalOpen} onOpenChange={setAddModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Add Instructor</ModalTitle>
            <ModalDescription>
              Enter details to create a new instructor.
            </ModalDescription>
          </ModalHeader>
          <form
            onSubmit={handleAddInstructor}
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
            <ModalTitle>Edit Instructor</ModalTitle>
            <ModalDescription>
              Update the instructor's details below.
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
              {statusInstructor?.is_active ? "Deactivate" : "Activate"}{" "}
              Instructor
            </ModalTitle>
            <ModalDescription>
              Are you sure you want to{" "}
              {statusInstructor?.is_active ? "deactivate" : "activate"}{" "}
              <b>{statusInstructor?.full_name}</b>?
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button onClick={handleStatusConfirm}>
              Yes, {statusInstructor?.is_active ? "Deactivate" : "Activate"}
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
            <ModalTitle>Delete Instructor</ModalTitle>
            <ModalDescription>
              Are you sure you want to delete{" "}
              <b>{deleteInstructor?.full_name}</b>?
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

export default Instructors;
