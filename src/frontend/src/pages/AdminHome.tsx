import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpen,
  LogOut,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import type { Student } from "../backend.d";
import { useActor } from "../hooks/useActor";

const COURSES = [
  {
    name: "Autography",
    emoji: "📝",
    color: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
  },
  {
    name: "Phonics",
    emoji: "🔤",
    color: "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200",
  },
  {
    name: "Grammar",
    emoji: "📚",
    color:
      "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
  },
  {
    name: "Calligraphy",
    emoji: "✒️",
    color:
      "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200",
  },
  {
    name: "Vedic Maths",
    emoji: "🔢",
    color:
      "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
  },
  {
    name: "Mix Subjects",
    emoji: "🎨",
    color: "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200",
  },
];

interface Props {
  onSelectCourse: (course: string) => void;
  onSearchSelect: (student: Student) => void;
  onLogout: () => void;
}

export default function AdminHome({
  onSelectCourse,
  onSearchSelect,
  onLogout,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { actor, isFetching } = useActor();

  const today = new Date().toISOString().split("T")[0];

  const { data: allStudents = [] } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !isFetching && !!actor,
  });

  const { data: searchResults = [] } = useQuery<Student[]>({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchStudents(searchQuery);
    },
    enabled: !isFetching && !!actor && searchQuery.trim().length > 1,
  });

  const todayCount = allStudents.filter((s) =>
    s.attendanceLog.includes(today),
  ).length;
  const lowDaysCount = allStudents.filter(
    (s) => Number(s.totalDays) - Number(s.attendedDays) <= 2,
  ).length;

  const getStudentCountByCourse = useCallback(
    (course: string) => allStudents.filter((s) => s.course === course).length,
    [allStudents],
  );

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setShowDropdown(val.trim().length > 1);
  };

  const handleResultClick = (student: Student) => {
    setShowDropdown(false);
    setSearchQuery("");
    onSearchSelect(student);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-xs sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-primary" />
            <div>
              <h1 className="font-display text-xl font-bold text-primary leading-none">
                DISHA'S Classes
              </h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            data-ocid="admin.button"
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          <div className="bg-primary/10 rounded-xl p-3 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold text-primary">
                {allStudents.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </div>
          <div className="bg-success/10 rounded-xl p-3 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-success shrink-0" />
            <div>
              <p className="text-2xl font-bold text-success">{todayCount}</p>
              <p className="text-xs text-muted-foreground">Present Today</p>
            </div>
          </div>
          {lowDaysCount > 0 && (
            <div className="bg-destructive/10 rounded-xl p-3 flex items-center gap-3 col-span-2 sm:col-span-1">
              <AlertTriangle className="w-8 h-8 text-destructive shrink-0" />
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {lowDaysCount}
                </p>
                <p className="text-xs text-muted-foreground">Low Days Alert</p>
              </div>
            </div>
          )}
        </motion.div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search student name..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() =>
              searchQuery.trim().length > 1 && setShowDropdown(true)
            }
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            data-ocid="admin.search_input"
          />
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-card z-50 overflow-hidden">
              {searchResults.map((s) => (
                <button
                  type="button"
                  key={String(s.id)}
                  className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between transition-colors"
                  onClick={() => handleResultClick(s)}
                >
                  <span className="font-medium text-sm">{s.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {s.course}
                  </Badge>
                </button>
              ))}
            </div>
          )}
          {showDropdown &&
            searchResults.length === 0 &&
            searchQuery.trim().length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-card z-50 p-4">
                <p className="text-sm text-muted-foreground text-center">
                  No students found
                </p>
              </div>
            )}
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-foreground mb-3">
            📖 My Courses
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COURSES.map((course, i) => {
              const count = getStudentCountByCourse(course.name);
              return (
                <motion.button
                  type="button"
                  key={course.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  onClick={() => onSelectCourse(course.name)}
                  className={`rounded-2xl border-2 p-4 text-left transition-all duration-200 ${course.color} shadow-xs hover:shadow-card`}
                  data-ocid="admin.button"
                >
                  <span className="text-3xl block mb-2">{course.emoji}</span>
                  <p className="font-semibold text-sm leading-tight">
                    {course.name}
                  </p>
                  <Badge className="mt-2 text-xs" variant="secondary">
                    {count} student{count !== 1 ? "s" : ""}
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </div>

        <footer className="text-center py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            caffeine.ai
          </a>
        </footer>
      </main>
    </div>
  );
}
