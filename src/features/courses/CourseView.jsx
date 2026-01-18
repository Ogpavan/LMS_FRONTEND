import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const dummyComments = [
  {
    id: 1,
    user: "Alice",
    comment: "Great explanation! The React basics are now much clearer.",
    date: "2025-12-03",
  },
  {
    id: 2,
    user: "Bob",
    comment: "Loved the chapter on JSX. Very easy to follow.",
    date: "2025-12-03",
  },
  {
    id: 3,
    user: "Charlie",
    comment: "Can you add more examples for hooks?",
    date: "2025-12-02",
  },
];

function CourseView() {
  const { courseId } = useParams();
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(dummyComments);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCourse(data.course);
          setChapters(data.chapters);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <div className="p-6">Course not found</div>;

  const currentChapter = chapters[selectedChapter];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      setComments([
        {
          id: comments.length + 1,
          user: "You",
          comment: commentText,
          date: new Date().toISOString().slice(0, 10),
        },
        ...comments,
      ]);
      setCommentText("");
    }
  };

  return (
    <div className="flex flex-col  md:flex-row-reverse gap-6">
      {/* Chapters Sidebar - Sticky on left like YouTube playlist */}
      <div className="w-full md:w-80 md:sticky md:top-4 h-[220px] md:h-auto md:max-h-[600px] border-l border-border overflow-y-auto bg-white dark:bg-gray-900 rounded-lg md:rounded-none self-start">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold mb-3">Course Content</h3>
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`cursor-pointer transition-colors rounded-md flex items-center ${
                  selectedChapter === index
                    ? "border border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-muted"
                } ${chapter.locked ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => !chapter.locked && setSelectedChapter(index)}
                title={chapter.locked ? "Locked chapter" : ""}
              >
                <div className="px-3 pt-2 flex items-center justify-between w-full">
                  <div>
                    <h4 className="text-sm font-medium leading-tight flex items-center gap-1">
                      {chapter.title}
                      {chapter.locked && (
                        <span
                          className="ml-1 text-xs text-gray-500"
                          aria-label="Locked"
                        >
                          🔒
                        </span>
                      )}
                    </h4>
                    <p className="text-xs opacity-75">{chapter.duration}</p>
                  </div>
                  <div className="ml-2 text-xs opacity-50">{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Player & Description/Comments */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl aspect-video rounded-lg bg-black flex items-center justify-center relative">
          {currentChapter?.content ? (
            <video
              controls
              className="w-full h-full rounded-lg"
              src={`${import.meta.env.VITE_BASE_URL}/uploads/videos/${
                currentChapter.content
              }`}
              poster={`${import.meta.env.VITE_BASE_URL}/uploads/thumbnails/${
                course.thumbnail_url
              }`}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4">
              <h3 className="text-lg md:text-xl mb-2 font-semibold text-center">
                {currentChapter?.title}
              </h3>
              <p className="text-gray-400 text-center">
                Video Player Placeholder
              </p>
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                {currentChapter?.duration}
              </span>
            </div>
          )}
        </div>
        {/* Description & Comments Section */}
        <div className="w-full max-w-3xl mt-4 bg-white dark:bg-gray-900 rounded-lg   p-2">
          {/* Long Description */}
          <h2 className="text-lg font-bold mb-1">{currentChapter?.title}</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {course.description}
          </p>
          <hr className="my-3" />
          <h4 className="font-semibold mb-2">Chapter Description</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Duration: {currentChapter?.duration}
          </p>
          {/* Comments */}
        </div>
      </div>
    </div>
  );
}

export default CourseView;
