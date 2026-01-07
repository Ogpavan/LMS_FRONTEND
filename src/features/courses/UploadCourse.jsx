/* --- SAME IMPORTS --- */
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Upload, FileVideo, Image as ImageIcon } from "lucide-react";

/* Your initial state */
const initialChapter = {
  title: "",
  content: "",
  duration_minutes: "",
  sort_order: "",
  video_file: null,
};

const levels = ["Beginner", "Intermediate", "Advanced"];
const languages = ["English", "Hindi"];

export default function UploadCourse() {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    thumbnail_file: null,
    thumbnail_preview: null,
    level: "Beginner",
    language: "",
    is_free: false,
    price: "",
    chapters: [{ ...initialChapter }],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* Your existing handlers unchanged */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((c) => ({ ...c, [name]: value }));
  };

  const handleIsFree = (checked) => {
    setCourse((c) => ({ ...c, is_free: checked }));
    if (checked) setCourse((c) => ({ ...c, price: "0" }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCourse((c) => ({ ...c, thumbnail_file: file }));
    const url = URL.createObjectURL(file);
    setCourse((c) => ({ ...c, thumbnail_preview: url }));
  };

  const handleChapterChange = (index, e) => {
    const { name, value } = e.target;
    const chapters = [...course.chapters];
    chapters[index][name] = value;
    setCourse((c) => ({ ...c, chapters }));
  };

  const handleChapterVideo = (index, e) => {
    const file = e.target.files[0];
    const chapters = [...course.chapters];
    chapters[index].video_file = file;
    setCourse((c) => ({ ...c, chapters }));
  };

  const addChapter = () => {
    setCourse((c) => ({
      ...c,
      chapters: [...c.chapters, { ...initialChapter }],
    }));
  };

  const removeChapter = (index) => {
    setCourse((c) => ({
      ...c,
      chapters: c.chapters.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      form.append("thumbnail", course.thumbnail_file);

      const courseData = {
        title: course.title,
        description: course.description,
        level: course.level,
        language: course.language,
        is_free: course.is_free,
        price: course.is_free ? 0 : Number(course.price),
        chapters: course.chapters.map((c, i) => ({
          title: c.title,
          content: c.content,
          duration_minutes: Number(c.duration_minutes),
          sort_order: Number(i + 1),
        })),
      };

      form.append("course", JSON.stringify(courseData));

      course.chapters.forEach((ch, i) => {
        if (ch.video_file) form.append(`chapter_video_${i}`, ch.video_file);
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        setSuccess(`Course uploaded successfully! ID: ${data.course_id}`);

        setCourse({
          title: "",
          description: "",
          thumbnail_file: null,
          thumbnail_preview: null,
          level: "Beginner",
          language: "",
          is_free: false,
          price: "",
          chapters: [{ ...initialChapter }],
        });
      }
    } catch {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="  bg-slate-50">
      <div className="max-w-6xl mx-auto px-5 pb-10">
        {/* Page Header */}
        <div className="  flex items-center justify-between">
          <div>
            <h1 className=" tracking-tight">Create New Course</h1>
            <p className="text-slate-600 ">
              Fill in the details below to create and publish your course.
            </p>
          </div>
          {/* Top right buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="border-slate-300 text-slate-700"
              disabled={loading}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              form="upload-course-form"
              className="bg-slate-900 text-white hover:bg-slate-800"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Publish Course
                </span>
              )}
            </Button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          id="upload-course-form"
        >
          {/* ==== Basic Info Section ==== */}
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardContent className="p-6 space-y-2">
              <h2 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-200">
                Basic Information
              </h2>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Course Title
                </label>
                <Input
                  name="title"
                  value={course.title}
                  onChange={handleChange}
                  placeholder="e.g., Complete Web Development Bootcamp"
                  className="border-slate-300"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  className="min-h-[130px] border-slate-300 resize-none"
                  placeholder="Describe what students will learn in this course..."
                  required
                />
              </div>

              {/* Level & Language */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Level
                  </label>
                  <select
                    name="level"
                    value={course.level}
                    onChange={handleChange}
                    className="  w-full border border-slate-300 rounded px-3 py-1 text-sm  "
                  >
                    {levels.map((lvl) => (
                      <option key={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Language
                  </label>
                  <select
                    name="language"
                    value={course.language}
                    onChange={handleChange}
                    className="  w-full border border-slate-300 rounded px-3 py-1 text-sm  "
                    required
                  >
                    <option value="">Select language</option>
                    {languages.map((lang) => (
                      <option key={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ==== Pricing Section ==== */}
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-200">
                Pricing
              </h2>
              <div className="flex items-center gap-6">
                {/* Is Free Checkbox and label */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={course.is_free}
                    onCheckedChange={handleIsFree}
                    id="is-free-checkbox"
                  />
                  <label
                    htmlFor="is-free-checkbox"
                    className="text-sm text-slate-700 cursor-pointer"
                  >
                    This course is free
                  </label>
                </div>
                {/* Price input (only if not free) */}
                {!course.is_free && (
                  <div className="flex items-center gap-2">
                    <label
                      className="text-sm font-medium text-slate-700"
                      htmlFor="price-input"
                    >
                      Price (₹)
                    </label>
                    <Input
                      id="price-input"
                      name="price"
                      type="number"
                      min="0"
                      value={course.price}
                      onChange={handleChange}
                      className="border-slate-300 w-32"
                      required
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ==== Thumbnail Section ==== */}
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 pb-3 border-b border-slate-200">
                Course Thumbnail
              </h2>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">
                  Upload Image
                </label>

                {!course.thumbnail_preview ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
                    <ImageIcon className="w-10 h-10 text-slate-400" />
                    <p className="text-sm mt-3 text-slate-700">
                      Click to upload thumbnail
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative inline-block">
                    <img
                      src={course.thumbnail_preview}
                      className="h-48 w-80 object-cover rounded-lg border border-slate-300"
                    />
                    <button
                      onClick={() =>
                        setCourse((c) => ({
                          ...c,
                          thumbnail_file: null,
                          thumbnail_preview: null,
                        }))
                      }
                      className="absolute -top-2 -right-2 bg-white border border-slate-300 rounded-full p-1 shadow"
                    >
                      <X className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ==== Chapters ==== */}
          <Card className="border-slate-200 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  Course Chapters
                </h2>
                <span className="text-sm text-slate-500">
                  {course.chapters.length} chapter(s)
                </span>
              </div>

              <div className="space-y-5">
                {course.chapters.map((ch, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded  px-4 py-2 shadow-sm"
                  >
                    {/* chapter header */}
                    <div className="flex justify-between mb-4">
                      <h3 className="font-medium text-slate-900">
                        Chapter {idx + 1}
                      </h3>

                      {course.chapters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChapter(idx)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Fields */}
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">
                          Title
                        </label>
                        <Input
                          name="title"
                          value={ch.title}
                          onChange={(e) => handleChapterChange(idx, e)}
                          className="border-slate-300"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">
                          Content Description
                        </label>
                        <Textarea
                          name="content"
                          value={ch.content}
                          onChange={(e) => handleChapterChange(idx, e)}
                          className="border-slate-300 min-h-[100px] resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">
                          Video File
                        </label>

                        <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                          <div className="flex items-center gap-2">
                            <FileVideo className="w-5 h-5 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {ch.video_file
                                ? ch.video_file.name
                                : "Upload chapter video"}
                            </span>
                          </div>

                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleChapterVideo(idx, e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Duration + Sort order */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">
                            Duration (minutes)
                          </label>
                          <Input
                            name="duration_minutes"
                            type="number"
                            value={ch.duration_minutes}
                            onChange={(e) => handleChapterChange(idx, e)}
                            className="border-slate-300"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">
                            Sort Order
                          </label>
                          <Input
                            name="sort_order"
                            type="number"
                            value={ch.sort_order}
                            onChange={(e) => handleChapterChange(idx, e)}
                            className="border-slate-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addChapter}
                  className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-700 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Chapter
                </button>
              </div>
            </CardContent>
          </Card>

          {/* ==== Messages ==== */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
