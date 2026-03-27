import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Loader2, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Student } from "../backend.d";
import { useActor } from "../hooks/useActor";

interface Props {
  onAdminLogin: () => void;
  onParentLogin: (student: Student) => void;
}

export default function LoginPage({ onAdminLogin, onParentLogin }: Props) {
  const { actor } = useActor();
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState("");

  const handleAdminLogin = () => {
    if (adminUser === "disha" && adminPass === "disha123") {
      setAdminError("");
      toast.success("Welcome back, Disha! 🌟");
      onAdminLogin();
    } else {
      setAdminError("Invalid username or password.");
    }
  };

  const handleParentLogin = async () => {
    if (!parentName.trim() || !parentPhone.trim()) {
      setParentError("Please enter both name and phone number.");
      return;
    }
    if (!actor) {
      setParentError("Still connecting. Please wait a moment.");
      return;
    }
    setParentLoading(true);
    setParentError("");
    try {
      const student = await actor.getStudentByNameAndPhone(
        parentName.trim(),
        parentPhone.trim(),
      );
      if (student) {
        toast.success(`Welcome! Viewing ${student.name}'s progress 📚`);
        onParentLogin(student);
      } else {
        setParentError(
          "Student not found. Please check the name and phone number.",
        );
      }
    } catch {
      setParentError("Something went wrong. Please try again.");
    } finally {
      setParentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/15 mb-4"
          >
            <BookOpen className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="font-display text-4xl font-bold text-primary leading-tight">
            DISHA'S
          </h1>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Classes
          </h2>
          <p className="text-muted-foreground mt-1">Home Tuitions</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6">
          <Tabs defaultValue="admin">
            <TabsList className="w-full mb-6">
              <TabsTrigger
                value="admin"
                className="flex-1"
                data-ocid="login.tab"
              >
                👩‍🏫 Admin Login
              </TabsTrigger>
              <TabsTrigger
                value="parent"
                className="flex-1"
                data-ocid="login.tab"
              >
                👨‍👩‍👧 Parent Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-user">Username</Label>
                <Input
                  id="admin-user"
                  placeholder="Enter username"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  data-ocid="login.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-pass">Password</Label>
                <Input
                  id="admin-pass"
                  type="password"
                  placeholder="Enter password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                  data-ocid="login.input"
                />
              </div>
              {adminError && (
                <p
                  className="text-destructive text-sm"
                  data-ocid="login.error_state"
                >
                  {adminError}
                </p>
              )}
              <Button
                className="w-full"
                onClick={handleAdminLogin}
                data-ocid="login.submit_button"
              >
                <Star className="w-4 h-4 mr-2" /> Login as Admin
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Hint: <code>disha</code> / <code>disha123</code>
              </p>
            </TabsContent>

            <TabsContent value="parent" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="parent-name">Child's Name</Label>
                <Input
                  id="parent-name"
                  placeholder="Enter child's full name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  data-ocid="login.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent-phone">Parent's Phone Number</Label>
                <Input
                  id="parent-phone"
                  placeholder="Enter phone number"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleParentLogin()}
                  data-ocid="login.input"
                />
              </div>
              {parentError && (
                <p
                  className="text-destructive text-sm"
                  data-ocid="login.error_state"
                >
                  {parentError}
                </p>
              )}
              <Button
                className="w-full"
                onClick={handleParentLogin}
                disabled={parentLoading}
                data-ocid="login.submit_button"
              >
                {parentLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                View My Child's Progress
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
