import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Loader2,
  Phone,
  Save,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Student, backendInterface } from "../backend.d";

interface Props {
  student: Student;
  actor: backendInterface | null | undefined;
  onClose: () => void;
}

function maskPhone(phone: string) {
  if (phone.length <= 4) return phone;
  return "*".repeat(phone.length - 4) + phone.slice(-4);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StudentDetailModal({ student, actor, onClose }: Props) {
  const [notes, setNotes] = useState(student.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const alreadyMarked = student.attendanceLog.includes(today);
  const daysLeft = Number(student.totalDays) - Number(student.attendedDays);

  const handleSaveNotes = async () => {
    if (!actor) return;
    setSavingNotes(true);
    try {
      await actor.updateStudentNotes(student.id, notes);
      toast.success("Notes saved!");
    } catch {
      toast.error("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleAttendance = async () => {
    if (alreadyMarked || markingAttendance || !actor) return;
    setMarkingAttendance(true);
    try {
      await actor.markAttendance(student.id);
      toast.success(`✅ ${student.name} marked present!`);
      onClose();
    } catch {
      toast.error("Failed to mark attendance.");
    } finally {
      setMarkingAttendance(false);
    }
  };

  const recentLog = [...student.attendanceLog].reverse();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="max-w-md rounded-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="course.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {student.name}
          </DialogTitle>
          <Badge variant="secondary" className="w-fit">
            {student.course}
          </Badge>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{maskPhone(student.parentPhone)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(student.enrollmentDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>Fee: ₹{student.feePaid.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/60 rounded-xl py-3">
            <p className="text-2xl font-bold">{String(student.attendedDays)}</p>
            <p className="text-xs text-muted-foreground">Attended</p>
          </div>
          <div
            className={`rounded-xl py-3 border ${
              daysLeft <= 1
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : daysLeft <= 5
                  ? "bg-warning/10 border-warning/30 text-warning"
                  : "bg-success/10 border-success/30 text-success"
            }`}
          >
            <p className="text-2xl font-bold">{daysLeft}</p>
            <p className="text-xs">Days Left</p>
          </div>
          <div className="bg-muted/60 rounded-xl py-3">
            <p className="text-2xl font-bold">{String(student.totalDays)}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        <Button
          className={`w-full rounded-xl py-5 text-base font-bold ${
            alreadyMarked
              ? "bg-muted text-muted-foreground hover:bg-muted"
              : "bg-success/90 hover:bg-success text-success-foreground"
          }`}
          disabled={alreadyMarked || markingAttendance || !actor}
          onClick={handleAttendance}
          data-ocid="course.button"
        >
          {markingAttendance ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <CheckCircle2 className="w-5 h-5 mr-2" />
          )}
          {alreadyMarked ? "Already Marked Today ✓" : "Present Mamm"}
        </Button>

        <div>
          <h4 className="font-semibold mb-2 text-sm">📅 Attendance History</h4>
          {recentLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No attendance recorded yet.
            </p>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {recentLog.map((d) => (
                <div
                  key={d}
                  className="text-sm flex items-center gap-2 text-muted-foreground"
                >
                  <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                  {formatDate(d)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="detail-notes">📝 Notes</Label>
          <Textarea
            id="detail-notes"
            placeholder="Add notes about this student..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            data-ocid="course.textarea"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveNotes}
            disabled={savingNotes || !actor}
            data-ocid="course.save_button"
          >
            {savingNotes ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Save className="w-3 h-3 mr-1" />
            )}
            Save Notes
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={onClose}
          data-ocid="course.close_button"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
