import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  LogOut,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import type { Student } from "../backend.d";

interface Props {
  student: Student;
  onLogout: () => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ParentView({ student, onLogout }: Props) {
  const daysLeft = Number(student.totalDays) - Number(student.attendedDays);
  const recentLog = [...student.attendanceLog].reverse().slice(0, 5);
  const attendancePercent =
    Number(student.totalDays) > 0
      ? Math.round(
          (Number(student.attendedDays) / Number(student.totalDays)) * 100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-xs">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-display text-lg font-bold text-primary leading-none">
                DISHA'S Classes
              </h1>
              <Badge variant="secondary" className="text-xs mt-0.5">
                Parent View
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            data-ocid="parent.button"
          >
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {student.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {student.name}
              </h2>
              <Badge className="mt-1">{student.course}</Badge>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Attendance Progress</span>
              <span>{attendancePercent}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${attendancePercent}%` }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-success/10 border border-success/20 rounded-2xl p-3 text-center"
          >
            <Trophy className="w-6 h-6 text-success mx-auto mb-1" />
            <p className="text-2xl font-bold text-success">
              {String(student.attendedDays)}
            </p>
            <p className="text-xs text-muted-foreground">Attended</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className={`rounded-2xl p-3 text-center border ${
              daysLeft <= 2
                ? "bg-destructive/10 border-destructive/20"
                : daysLeft <= 5
                  ? "bg-warning/10 border-warning/20"
                  : "bg-primary/10 border-primary/20"
            }`}
          >
            <CalendarDays
              className={`w-6 h-6 mx-auto mb-1 ${
                daysLeft <= 2
                  ? "text-destructive"
                  : daysLeft <= 5
                    ? "text-warning"
                    : "text-primary"
              }`}
            />
            <p
              className={`text-2xl font-bold ${
                daysLeft <= 2
                  ? "text-destructive"
                  : daysLeft <= 5
                    ? "text-warning"
                    : "text-primary"
              }`}
            >
              {daysLeft}
            </p>
            <p className="text-xs text-muted-foreground">Days Left</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-muted/60 rounded-2xl p-3 text-center"
          >
            <BookOpen className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
            <p className="text-2xl font-bold">{String(student.totalDays)}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </motion.div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">
            📅 Enrolled on:{" "}
            <strong className="text-foreground">
              {formatDate(student.enrollmentDate)}
            </strong>
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4">
          <h3 className="font-semibold mb-3 text-sm">Recent Attendance</h3>
          {recentLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No attendance recorded yet.
            </p>
          ) : (
            <div className="space-y-2">
              {recentLog.map((d) => (
                <div key={d} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>{formatDate(d)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {daysLeft <= 3 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-center">
            <p className="text-destructive text-sm font-medium">
              ⚠️ Only {daysLeft} class{daysLeft !== 1 ? "es" : ""} remaining!
              Please contact Disha Ma'am to renew.
            </p>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground">
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
    </div>
  );
}
