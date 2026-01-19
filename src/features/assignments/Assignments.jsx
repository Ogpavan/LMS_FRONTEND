import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faCalendarAlt,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

const dummyAssignments = [];

function Assignments() {
  // Categorize assignments
  const pending = dummyAssignments.filter((a) => a.status === "Pending");
  const submitted = dummyAssignments.filter((a) => a.status === "Submitted");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        Assignments
      </h1>

      {/* Pending Assignments */}
      <h2 className="text-lg font-semibold mb-2 mt-4 text-yellow-700">
        Pending Assignments
      </h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Due Date</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Grade</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((assignment) => (
              <tr key={assignment.id} className="border-t">
                <td className="py-2 px-4 font-semibold">{assignment.title}</td>
                <td className="py-2 px-4">{assignment.description}</td>
                <td className="py-2 px-4">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="mr-1 text-blue-500"
                  />
                  {assignment.dueDate}
                </td>
                <td className="py-2 px-4 text-yellow-600">
                  {assignment.status}
                </td>
                <td className="py-2 px-4 text-gray-400">Not graded</td>
                <td className="py-2 px-4">
                  <a
                    href={assignment.submissionUrl}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faUpload} />
                    Submit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submitted Assignments */}
      <h2 className="text-lg font-semibold mb-2 mt-4 text-green-700">
        Submitted Assignments
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Due Date</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Grade</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {submitted.map((assignment) => (
              <tr key={assignment.id} className="border-t">
                <td className="py-2 px-4 font-semibold">{assignment.title}</td>
                <td className="py-2 px-4">{assignment.description}</td>
                <td className="py-2 px-4">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="mr-1 text-blue-500"
                  />
                  {assignment.dueDate}
                </td>
                <td className="py-2 px-4 text-green-600">
                  {assignment.status}
                </td>
                <td className="py-2 px-4 font-bold text-blue-700">
                  {assignment.grade}
                </td>
                <td className="py-2 px-4">
                  <a
                    href={assignment.submissionUrl}
                    className="px-3 py-1 bg-gray-200 text-blue-700 rounded hover:bg-gray-300 text-sm flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faUpload} />
                    View Submission
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assignments;
