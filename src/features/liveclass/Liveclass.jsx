import React, { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faCalendarAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function Liveclass() {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || user?.user_id; // Adjust key as per your user object

    if (!userId) {
      setError("User not found");
      setLoading(false);
      return;
    }

    fetch(
      `https://app.skillspardha.com/api/liveclasses/students/${userId}/live-classes`,
    )
      .then((res) => res.json())
      .then((data) => {
        setLiveClasses(data.liveClasses || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load live classes");
        setLoading(false);
      });
  }, []);

  // ✅ Group classes by date
  const groupedByDate = useMemo(() => {
    return liveClasses.reduce((acc, live) => {
      const dateKey = new Date(live.start_time).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(live);
      return acc;
    }, {});
  }, [liveClasses]);

  // Get available dates as Date objects
  const availableDates = useMemo(() => {
    return Object.keys(groupedByDate).map((dateStr) => new Date(dateStr));
  }, [groupedByDate]);

  // Filtered classes by selected date
  const filteredGrouped = useMemo(() => {
    if (!selectedDate) return groupedByDate;
    const key = selectedDate.toDateString();
    return key in groupedByDate ? { [key]: groupedByDate[key] } : {};
  }, [selectedDate, groupedByDate]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faVideo} className="text-blue-600" />
          Live Classes
        </h2>
        {/* Calendar filter */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setCalendarOpen((v) => !v)}
            >
              <FontAwesomeIcon icon={faCalendarAlt} />
              {selectedDate ? selectedDate.toDateString() : "Filter by Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setCalendarOpen(false);
              }}
              // Only enable available dates
              disabled={(date) =>
                !availableDates.some(
                  (d) => d.toDateString() === date.toDateString(),
                )
              }
              modifiers={{
                available: availableDates,
              }}
            />
            {selectedDate && (
              <div className="flex justify-end p-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedDate(null)}
                >
                  Clear
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {loading ? (
        <div>Loading live classes...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : Object.keys(filteredGrouped).length === 0 ? (
        <div className="text-center text-gray-500">No live classes found.</div>
      ) : (
        <div className="space-y-10">
          {Object.entries(filteredGrouped).map(([date, classes]) => (
            <div key={date}>
              {/* ✅ Date Heading */}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} />
                {date}
              </h3>

              {/* ✅ Classes under date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {classes.map((live) => {
                  const start = new Date(live.start_time);
                  const end = new Date(live.end_time);
                  const timeStr = `${start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`;

                  return (
                    <Card
                      key={live.live_class_id}
                      className="flex flex-col justify-between h-full rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                      style={{ minHeight: 230 }}
                    >
                      <div className="flex-1 flex flex-col">
                        <CardHeader className="pt-4 px-4 pb-2">
                          <CardTitle className="text-lg font-semibold">
                            {live.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4 pt-0 pb-2 flex-1">
                          <div className="flex flex-col gap-1 text-xs text-gray-700 dark:text-gray-300">
                            <span>{timeStr}</span>
                            <span>
                              <FontAwesomeIcon icon={faUser} className="mr-1" />
                              {live.instructor}
                            </span>
                          </div>
                        </CardContent>
                      </div>

                      <CardFooter className="pb-4 pt-0">
                        {live.status === "suspended" ? (
                          <span className="mx-auto w-full max-w-[180px] px-4 py-2 bg-yellow-400 text-gray-800 rounded-full text-sm text-center font-semibold">
                            Suspended
                          </span>
                        ) : live.meet_link ? (
                          <a
                            href={live.meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mx-auto w-full max-w-[180px] px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm text-center"
                          >
                            Join Class
                          </a>
                        ) : (
                          <span className="mx-auto w-full max-w-[180px] px-4 py-2 bg-gray-300 text-gray-600 rounded-full text-sm text-center">
                            No Link
                          </span>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Liveclass;
