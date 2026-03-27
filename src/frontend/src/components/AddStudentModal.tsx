import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { backendInterface } from "../backend.d";

const COURSES = [
  "Autography",
  "Phonics",
  "Grammar",
  "Calligraphy",
  "Vedic Maths",
  "Mix Subjects",
];

interface Props {
  open: boolean;
  defaultCourse: string;
  actor: backendInterface | null | undefined;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddStudentModal({
  open,
  defaultCourse,
  actor,
  onClose,
  onAdded,
}: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [course, setCourse] = useState(defaultCourse);
  const [totalDays, setTotalDays] = useState("");
  const [feePaid, setFeePaid] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(today);
  const [parentPhone, setParentPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!course) e.course = "Course is required";
    if (!totalDays || Number(totalDays) < 1)
      e.totalDays = "Enter valid number of days";
    if (feePaid === "" || Number(feePaid) < 0)
      e.feePaid = "Enter valid fee amount";
    if (!parentPhone.trim()) e.parentPhone = "Parent phone is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0 || !actor) return;
    setLoading(true);
    try {
      await actor.addStudent({
        id: BigInt(Date.now()),
        name: name.trim(),
        course,
        totalDays: BigInt(Number(totalDays)),
        attendedDays: 0n,
        feePaid: Number(feePaid),
        parentPhone: parentPhone.trim(),
        enrollmentDate,
        notes: notes.trim(),
        attendanceLog: [],
      });
      toast.success(`🎉 ${name} enrolled in ${course}!`);
      setName("");
      setTotalDays("");
      setFeePaid("");
      setParentPhone("");
      setNotes("");
      setEnrollmentDate(today);
      onAdded();
    } catch {
      toast.error("Failed to enroll student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md rounded-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="course.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" /> Enroll New Student
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="s-name">Student Name *</Label>
            <Input
              id="s-name"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-ocid="course.input"
            />
            {errors.name && (
              <p
                className="text-destructive text-xs"
                data-ocid="course.error_state"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Course *</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger data-ocid="course.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COURSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.course && (
              <p
                className="text-destructive text-xs"
                data-ocid="course.error_state"
              >
                {errors.course}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="s-days">Total Days *</Label>
              <Input
                id="s-days"
                type="number"
                min="1"
                placeholder="e.g. 30"
                value={totalDays}
                onChange={(e) => setTotalDays(e.target.value)}
                data-ocid="course.input"
              />
              {errors.totalDays && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="course.error_state"
                >
                  {errors.totalDays}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-fee">Fee Paid (₹) *</Label>
              <Input
                id="s-fee"
                type="number"
                min="0"
                placeholder="e.g. 2000"
                value={feePaid}
                onChange={(e) => setFeePaid(e.target.value)}
                data-ocid="course.input"
              />
              {errors.feePaid && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="course.error_state"
                >
                  {errors.feePaid}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="s-phone">Parent Phone Number *</Label>
            <Input
              id="s-phone"
              placeholder="10-digit phone number"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              data-ocid="course.input"
            />
            <p className="text-xs text-muted-foreground">
              This becomes the parent login password
            </p>
            {errors.parentPhone && (
              <p
                className="text-destructive text-xs"
                data-ocid="course.error_state"
              >
                {errors.parentPhone}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="s-date">Date of Enrolment</Label>
            <Input
              id="s-date"
              type="date"
              value={enrollmentDate}
              onChange={(e) => setEnrollmentDate(e.target.value)}
              data-ocid="course.input"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="s-notes">Notes (optional)</Label>
            <Textarea
              id="s-notes"
              placeholder="Any notes about this student..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              data-ocid="course.textarea"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-ocid="course.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={loading || !actor}
              data-ocid="course.submit_button"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Enroll Student
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
