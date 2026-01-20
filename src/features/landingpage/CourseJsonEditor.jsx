import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchDisplayCourseDetails,
  saveDisplayCourseJson,
} from "./displayCourseApi";
import { Button } from "@/components/ui/button";

const defaultCourseJson = {
  t: "",
  st: "",
  d: "",
  hl: [""],
  cur: [[1, "", [""]]],
  sch: [""],
  cert: "",
  meta: ["", "", "", ""],
  proj: [""],
  image: "",
  price: [""],
};

function CourseJsonEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseJson, setCourseJson] = useState(defaultCourseJson);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const details = await fetchDisplayCourseDetails(id);
        setCourseJson(details.course_json || defaultCourseJson);
      } catch {
        setCourseJson(defaultCourseJson);
        setError("No data found. You can add new details.");
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleChange = (field, value) =>
    setCourseJson((p) => ({ ...p, [field]: value }));

  const handleArrayChange = (field, idx, value) =>
    setCourseJson((p) => {
      const arr = [...(p[field] || [])];
      arr[idx] = value;
      return { ...p, [field]: arr };
    });

  const handleCurriculumChange = (idx, sub, value) =>
    setCourseJson((p) => {
      const cur = [...(p.cur || [])];
      if (!cur[idx]) cur[idx] = [idx + 1, "", [""]];
      if (sub === "title") cur[idx][1] = value;
      if (sub === "topics") cur[idx][2] = value.split("\n");
      return { ...p, cur };
    });

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await saveDisplayCourseJson(id, courseJson);
      setSuccess(true);
    } catch (err) {
      setError("Failed to save: " + err.message);
    }
    setSaving(false);
  };

  // Image upload handler
  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    setError("");
    try {
      const res = await fetch(`https://app.skillspardha.com/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image");
      const { url } = await res.json();
      handleChange("image", url);
    } catch (err) {
      setError("Image upload failed: " + err.message);
    }
    setUploading(false);
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-4">
          Edit Course Details
        </h2>

        {/* Title */}
        <FormField label="Title">
          <Input
            value={courseJson.t}
            onChange={(e) => handleChange("t", e.target.value)}
          />
        </FormField>

        {/* Subtitle */}
        <FormField label="Subtitle">
          <Input
            value={courseJson.st}
            onChange={(e) => handleChange("st", e.target.value)}
          />
        </FormField>

        {/* Description */}
        <FormField label="Description">
          <Textarea
            rows={3}
            value={courseJson.d}
            onChange={(e) => handleChange("d", e.target.value)}
          />
        </FormField>

        {/* Highlights */}
        <Section title="Highlights">
          {courseJson.hl.map((h, i) => (
            <Row key={i}>
              <Input
                value={h}
                onChange={(e) => handleArrayChange("hl", i, e.target.value)}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleChange(
                    "hl",
                    courseJson.hl.filter((_, idx) => idx !== i),
                  )
                }
              >
                Remove
              </Button>
            </Row>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleChange("hl", [...courseJson.hl, ""])}
          >
            + Add Highlight
          </Button>
        </Section>

        {/* Curriculum */}
        <Section title="Curriculum">
          {courseJson.cur.map((c, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <FormField label={`Module ${i + 1} Title`}>
                <Input
                  value={c[1]}
                  onChange={(e) =>
                    handleCurriculumChange(i, "title", e.target.value)
                  }
                />
              </FormField>

              <FormField label="Topics (one per line)">
                <Textarea
                  rows={3}
                  value={c[2].join("\n")}
                  onChange={(e) =>
                    handleCurriculumChange(i, "topics", e.target.value)
                  }
                />
              </FormField>

              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  handleChange(
                    "cur",
                    courseJson.cur.filter((_, idx) => idx !== i),
                  )
                }
              >
                Remove Module
              </Button>
            </div>
          ))}

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              handleChange("cur", [
                ...courseJson.cur,
                [courseJson.cur.length + 1, "", [""]],
              ])
            }
          >
            + Add Module
          </Button>
        </Section>

        {/* Projects */}
        <Section title="Projects">
          {courseJson.proj.map((p, i) => (
            <Row key={i}>
              <Input
                value={p}
                onChange={(e) => handleArrayChange("proj", i, e.target.value)}
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  handleChange(
                    "proj",
                    courseJson.proj.filter((_, idx) => idx !== i),
                  )
                }
              >
                Remove
              </Button>
            </Row>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleChange("proj", [...courseJson.proj, ""])}
          >
            + Add Project
          </Button>
        </Section>

        {/* Image Upload */}
        <FormField label="Course Image">
          {!courseJson.image && (
            <div>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) await uploadImage(file);
                }}
              />
              {uploading && (
                <span className="ml-2 text-sm text-gray-500">Uploading...</span>
              )}
            </div>
          )}
          {courseJson.image && (
            <div className="flex flex-col items-start gap-2">
              <img
                src={
                  courseJson.image.startsWith("http")
                    ? courseJson.image
                    : `https://app.skillspardha.com${courseJson.image}`
                }
                alt="Course"
                className="mt-2 max-h-40 rounded border"
              />
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleChange("image", "")}
              >
                Remove Image
              </Button>
            </div>
          )}
        </FormField>

        {/* Price */}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>

        {success && (
          <div className="text-green-600 text-sm">Saved successfully!</div>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
}

export default CourseJsonEditor;

/* ---------- Small Reusable UI Helpers ---------- */

const FormField = ({ label, children }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold">{title}</h3>
    {children}
  </div>
);

const Row = ({ children }) => <div className="flex gap-2">{children}</div>;

const Input = (props) => (
  <input
    {...props}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
  />
);
