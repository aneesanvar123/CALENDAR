import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatKey(y, m, d) {
  return `${y}-${m}-${d}`;
}

export default function PlannerApp() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [plans, setPlans] = useState({});
  const [text, setText] = useState("");

  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const [exams, setExams] = useState([]);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const handleSave = () => {
    if (!selectedDate) return;
    const key = formatKey(currentYear, currentMonth, selectedDate);
    setPlans({ ...plans, [key]: text });
    setText("");
  };

  const handleRangeSave = () => {
    if (!rangeStart || !rangeEnd || !text) return;

    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);

    let newPlans = { ...plans };

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = formatKey(d.getFullYear(), d.getMonth(), d.getDate());
      newPlans[key] = text;
    }

    setPlans(newPlans);
    setText("");
    setRangeStart("");
    setRangeEnd("");
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    const key = formatKey(currentYear, currentMonth, day);
    setText(plans[key] || "");
  };

  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null);
  };

  const addExam = () => {
    if (!examName || !examDate) return;
    setExams([...exams, { name: examName, date: examDate }]);
    setExamName("");
    setExamDate("");
  };

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div whileHover={{ scale: 1.01 }}>
          <Card className="p-5 rounded-2xl shadow-md bg-white/80 backdrop-blur">
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" onClick={() => changeMonth(-1)}>←</Button>
              <h2 className="text-xl font-semibold tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <Button variant="ghost" onClick={() => changeMonth(1)}>→</Button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-sm text-gray-500">
              {weekDays.map((day) => (
                <div key={day} className="text-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const key = formatKey(currentYear, currentMonth, day);
                const hasPlan = plans[key];

                const isToday =
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();

                return (
                  <Button
                    key={i}
                    variant={selectedDate === day ? "default" : "ghost"}
                    onClick={() => handleDateClick(day)}
                    className={`rounded-xl h-10 transition-all
                      ${isToday ? "ring-2 ring-slate-800" : ""}
                      ${hasPlan ? "bg-slate-200" : "hover:bg-slate-100"}`}
                  >
                    {day}
                  </Button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Daily Plan */}
        <motion.div whileHover={{ scale: 1.01 }}>
          <Card className="p-5 rounded-2xl shadow-md bg-white/80 backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">
              {selectedDate
                ? `Plans for ${selectedDate} ${monthNames[currentMonth]}`
                : "Select a Date"}
            </h2>

            <Textarea
              placeholder="Write your timetable or tasks here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mb-4 rounded-xl"
            />

            <Button className="w-full mb-4 rounded-xl" onClick={handleSave}>
              Save Day Plan
            </Button>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Multi-day Task</h3>
              <Input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} className="rounded-xl" />
              <Input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} className="mt-2 rounded-xl" />
              <Button onClick={handleRangeSave} className="mt-3 w-full rounded-xl">
                Apply to Range
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Exam List */}
        <motion.div whileHover={{ scale: 1.01 }}>
          <Card className="p-5 rounded-2xl shadow-md bg-white/80 backdrop-blur">
            <h2 className="text-xl font-semibold mb-4">Exams</h2>

            <div className="mb-4 space-y-2">
              <Input
                placeholder="Exam name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="rounded-xl"
              />
              <Input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="rounded-xl"
              />
              <Button onClick={addExam} className="w-full rounded-xl">Add Exam</Button>
            </div>

            <div className="space-y-2">
              {exams.map((exam, index) => (
                <div key={index} className="p-3 rounded-xl bg-slate-100">
                  <div className="font-medium">{exam.name}</div>
                  <div className="text-sm text-gray-600">{exam.date}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
