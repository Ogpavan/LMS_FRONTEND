import React from "react";

const dummyQuizzes = [
  {
    id: 1,
    title: "React Fundamentals Quiz",
    description: "Test your knowledge of React basics.",
    date: "2025-12-03",
    status: "Available",
    attemptUrl: "#",
  },
  {
    id: 2,
    title: "JavaScript Daily Quest",
    description: "A quick challenge on ES6 features.",
    date: "2025-12-03",
    status: "Completed",
    attemptUrl: "#",
  },
  {
    id: 3,
    title: "CSS Flexbox Quest",
    description: "Daily quest: Flexbox layout challenge.",
    date: "2025-12-02",
    status: "Available",
    attemptUrl: "#",
  },
];

function Quizzes() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quizzes</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyQuizzes.map((quiz) => (
              <tr key={quiz.id} className="border-t">
                <td className="py-2 px-4 font-semibold">{quiz.title}</td>
                <td className="py-2 px-4">{quiz.description}</td>
                <td className="py-2 px-4">{quiz.date}</td>
                <td
                  className={`py-2 px-4 ${
                    quiz.status === "Available"
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  {quiz.status}
                </td>
                <td className="py-2 px-4">
                  {quiz.status === "Available" ? (
                    <a
                      href={quiz.attemptUrl}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Attempt
                    </a>
                  ) : (
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Quizzes;
