import React from "react";
import { Button } from "@/components/ui/button";

function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-semibold">Student Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access your courses, track your learning activities, and continue
          building your skills.
        </p>
      </div>

      {/* How the platform works */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-center">
          How This Platform Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: "📚",
              title: "Enroll in Courses",
              desc: "Choose courses that match your learning goals.",
            },
            {
              icon: "▶️",
              title: "Learn at Your Pace",
              desc: "Watch lessons and attend live classes.",
            },
            {
              icon: "📝",
              title: "Complete Activities",
              desc: "Submit assignments and take quizzes.",
            },
            {
              icon: "🏆",
              title: "Earn Certificates",
              desc: "Receive certificates after course completion.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border bg-background p-6 text-center space-y-2"
            >
              <div className="text-3xl">{item.icon}</div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Action */}
      <div className="rounded-xl border bg-muted/40 p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold">Start Your Learning Journey</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Browse available courses and enroll to begin learning today.
        </p>
        <Button size="lg">Browse Courses</Button>
      </div>

      {/* Quote */}
      <div className="text-center text-sm text-muted-foreground italic">
        “Learning never exhausts the mind.”
      </div>

      {/* Support */}
      <div className="rounded-xl   p-6 text-center space-y-1">
        <p className="font-medium">Need Assistance?</p>
        <p className="text-sm text-muted-foreground">
          Contact your instructor or reach out to support for help.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
