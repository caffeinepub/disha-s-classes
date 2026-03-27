import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import type { Student } from "./backend.d";
import AdminHome from "./pages/AdminHome";
import CoursePage from "./pages/CoursePage";
import LoginPage from "./pages/LoginPage";
import ParentView from "./pages/ParentView";

export type AppView = "login" | "admin-home" | "course" | "parent";

export interface AppState {
  view: AppView;
  isAdmin: boolean;
  parentStudent: Student | null;
  currentCourse: string | null;
  highlightStudentId: bigint | null;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    view: "login",
    isAdmin: false,
    parentStudent: null,
    currentCourse: null,
    highlightStudentId: null,
  });

  const navigateTo = (view: AppView, extra?: Partial<AppState>) => {
    setState((prev) => ({ ...prev, view, ...extra }));
  };

  const logout = () => {
    setState({
      view: "login",
      isAdmin: false,
      parentStudent: null,
      currentCourse: null,
      highlightStudentId: null,
    });
  };

  return (
    <>
      {state.view === "login" && (
        <LoginPage
          onAdminLogin={() => navigateTo("admin-home", { isAdmin: true })}
          onParentLogin={(student) =>
            navigateTo("parent", { parentStudent: student })
          }
        />
      )}
      {state.view === "admin-home" && (
        <AdminHome
          onSelectCourse={(course) =>
            navigateTo("course", { currentCourse: course })
          }
          onSearchSelect={(student) =>
            navigateTo("course", {
              currentCourse: student.course,
              highlightStudentId: student.id,
            })
          }
          onLogout={logout}
        />
      )}
      {state.view === "course" && state.currentCourse && (
        <CoursePage
          course={state.currentCourse}
          highlightStudentId={state.highlightStudentId}
          onBack={() => navigateTo("admin-home")}
        />
      )}
      {state.view === "parent" && state.parentStudent && (
        <ParentView student={state.parentStudent} onLogout={logout} />
      )}
      <Toaster position="top-center" richColors />
    </>
  );
}
