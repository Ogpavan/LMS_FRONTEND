import React, { useState } from "react";

function Settings() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@student.edu",
    password: "",
    notifications: true,
    theme: "light",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-xl">
        <form className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              value={profile.password}
              onChange={(e) =>
                setProfile({ ...profile, password: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
              placeholder="Change password"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={profile.notifications}
              onChange={(e) =>
                setProfile({ ...profile, notifications: e.target.checked })
              }
              id="notifications"
            />
            <label htmlFor="notifications" className="font-semibold">
              Email Notifications
            </label>
          </div>
          <div>
            <label className="block font-semibold mb-1">Theme</label>
            <select
              value={profile.theme}
              onChange={(e) =>
                setProfile({ ...profile, theme: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
