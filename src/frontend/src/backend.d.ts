import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Student {
    id: bigint;
    name: string;
    feePaid: number;
    parentPhone: string;
    totalDays: bigint;
    attendanceLog: Array<string>;
    attendedDays: bigint;
    notes: string;
    enrollmentDate: string;
    course: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addStudent(student: Student): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllStudents(): Promise<Array<Student>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCourses(): Promise<Array<string>>;
    getStudentById(studentId: bigint): Promise<Student>;
    getStudentByNameAndPhone(name: string, parentPhone: string): Promise<Student | null>;
    getStudentsByCourse(course: string): Promise<Array<Student>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markAttendance(studentId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchStudents(searchQuery: string): Promise<Array<Student>>;
    updateStudentNotes(studentId: bigint, notes: string): Promise<void>;
}
