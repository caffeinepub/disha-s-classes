import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, IndianRupee, Plus, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Student } from "../backend.d";
import AddStudentModal from "../components/AddStudentModal";
import StudentCard from "../components/StudentCard";
import StudentDetailModal from "../components/StudentDetailModal";
import { useActor } from "../hooks/useActor";

const COURSE_CONFIG: Record<string, { emoji: string }> = {
  Autography: { emoji: "📝" },
  Phonics: { emoji: "🔤" },
  Grammar: { emoji: "📚" },
  Calligraphy: { emoji: "✒️" },
  "Vedic Maths": { emoji: "🔢" },
  "Mix Subjects": { emoji: "🎨" },
};

interface Props {
  course: string;
  highlightStudentId: bigint | null;
  onBack: () => void;
}

export default function CoursePage({
  course,
  highlightStudentId,
  onBack,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();

  const { data: students = [], isLoading } = useQuery<Student[]>({
    queryKey: ["students", "course", course],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentsByCourse(course);
    },
    enabled: !isFetching && !!actor,
  });

  const filtered = students
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aLeft = Number(a.totalDays) - Number(a.attendedDays);
      const bLeft = Number(b.totalDays) - Number(b.attendedDays);
      return aLeft - bLeft;
    });

  const totalFees = students.reduce((sum, s) => sum + s.feePaid, 0);
  const cfg = COURSE_CONFIG[course] || { emoji: "📖" };

  const refreshStudents = () => {
    qc.invalidateQueries({ queryKey: ["students", "course", course] });
    qc.invalidateQueries({ queryKey: ["students"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-xs sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              data-ocid="course.button"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <span className="text-2xl">{cfg.emoji}</span>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-foreground leading-none">
                {course}
              </h1>
              <p className="text-xs text-muted-foreground">
                {students.length} student{students.length !== 1 ? "s" : ""}{" "}
                enrolled
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAdd(true)}
              data-ocid="course.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <IndianRupee className="w-4 h-4" />
            <span>
              Fees Collected:{" "}
              <strong className="text-foreground">
                ₹{totalFees.toLocaleString()}
              </strong>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="course.search_input"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3" data-ocid="course.loading_state">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
            data-ocid="course.empty_state"
          >
            <span className="text-5xl block mb-3">{cfg.emoji}</span>
            <p className="font-semibold text-foreground">No students yet</p>
            <p className="text-muted-foreground text-sm mt-1">
              Click "Add" to enroll the first student!
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {filtered.map((student, idx) => (
                <motion.div
                  key={String(student.id)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  data-ocid={`course.item.${idx + 1}`}
                >
                  <StudentCard
                    student={student}
                    actor={actor}
                    highlight={highlightStudentId === student.id}
                    onViewDetails={() => setSelectedStudent(student)}
                    onAttendanceMarked={refreshStudents}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          actor={actor}
          onClose={() => {
            setSelectedStudent(null);
            refreshStudents();
          }}
        />
      )}

      <AddStudentModal
        open={showAdd}
        defaultCourse={course}
        actor={actor}
        onClose={() => setShowAdd(false)}
        onAdded={() => {
          setShowAdd(false);
          refreshStudents();
        }}
      />
    </div>
  );
}
