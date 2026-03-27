import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Student, backendInterface } from "../backend.d";

interface Props {
  student: Student;
  actor: backendInterface | null | undefined;
  highlight?: boolean;
  onViewDetails: () => void;
  onAttendanceMarked: () => void;
}

function daysLeftClass(left: number) {
  if (left <= 1)
    return "bg-destructive/15 text-destructive border-destructive/30";
  if (left <= 5) return "bg-warning/15 text-warning border-warning/30";
  return "bg-success/15 text-success border-success/30";
}

export default function StudentCard({
  student,
  actor,
  highlight,
  onViewDetails,
  onAttendanceMarked,
}: Props) {
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const alreadyMarked = student.attendanceLog.includes(today);
  const daysLeft = Number(student.totalDays) - Number(student.attendedDays);
  const isLowDays = daysLeft <= 2;

  const handleAttendance = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alreadyMarked || loading || !actor) return;
    setLoading(true);
    try {
      await actor.markAttendance(student.id);
      toast.success(`✅ ${student.name} marked present!`);
      onAttendanceMarked();
    } catch {
      toast.error("Failed to mark attendance. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      className={`bg-card rounded-2xl shadow-xs border-2 transition-all duration-200 hover:shadow-card ${
        highlight
          ? "border-primary shadow-card"
          : isLowDays
            ? "border-destructive/40"
            : "border-border"
      }`}
      data-ocid="course.card"
    >
      <div className="p-4">
        <button
          type="button"
          className="w-full text-left mb-3 cursor-pointer"
          onClick={onViewDetails}
        >
          <div className="flex items-center gap-2 mb-1">
            {isLowDays && (
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
            )}
            <h3 className="font-semibold text-base text-foreground truncate hover:text-primary transition-colors">
              {student.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="secondary" className="text-xs">
              {student.course}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {new Date(student.enrollmentDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </button>

        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div className="bg-muted/60 rounded-xl py-2">
            <p className="text-lg font-bold text-foreground">
              {String(student.attendedDays)}
            </p>
            <p className="text-xs text-muted-foreground">Attended</p>
          </div>
          <div className={`rounded-xl py-2 border ${daysLeftClass(daysLeft)}`}>
            <p className="text-lg font-bold">{daysLeft}</p>
            <p className="text-xs">Days Left</p>
          </div>
          <div className="bg-muted/60 rounded-xl py-2">
            <p className="text-lg font-bold text-foreground">
              ₹{student.feePaid.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Fee Paid</p>
          </div>
        </div>

        <Button
          className={`w-full rounded-xl text-sm font-semibold ${
            alreadyMarked
              ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
              : "bg-success/90 hover:bg-success text-success-foreground"
          }`}
          disabled={alreadyMarked || loading || !actor}
          onClick={handleAttendance}
          data-ocid="course.button"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          )}
          {alreadyMarked ? "Already Marked Today ✓" : "Present Mamm"}
        </Button>
      </div>
    </article>
  );
}
