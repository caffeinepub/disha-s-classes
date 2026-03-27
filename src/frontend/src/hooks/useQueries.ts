import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Student, backendInterface } from "../backend.d";
import { useActor } from "./useActor";

export function useAllStudents() {
  const { actor, isFetching } = useActor();
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !isFetching && !!actor,
  });
}

export function useStudentsByCourse(course: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Student[]>({
    queryKey: ["students", "course", course],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentsByCourse(course);
    },
    enabled: !isFetching && !!actor && !!course,
  });
}

export function useAddStudent(actor: backendInterface | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (student: Student) => {
      if (!actor) throw new Error("Not connected");
      return actor.addStudent(student);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useMarkAttendance(actor: backendInterface | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (studentId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markAttendance(studentId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateNotes(actor: backendInterface | null | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, notes }: { id: bigint; notes: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateStudentNotes(id, notes);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
