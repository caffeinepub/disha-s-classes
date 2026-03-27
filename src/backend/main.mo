import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Student = {
    id : Nat;
    name : Text;
    course : Text;
    totalDays : Nat;
    attendedDays : Nat;
    feePaid : Float;
    enrollmentDate : Text;
    parentPhone : Text;
    notes : Text;
    attendanceLog : [Text];
  };

  public type UserProfile = {
    name : Text;
  };

  module Student {
    public func compare(student1 : Student, student2 : Student) : Order.Order {
      Nat.compare(student1.id, student2.id);
    };
  };

  let courses = [
    "Autography",
    "Phonics",
    "Grammar",
    "Calligraphy",
    "Vedic Maths",
    "Mix Subjects",
  ];

  var latestId = 0;
  let students = Map.empty<Nat, Student>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public shared func addStudent(student : Student) : async () {
    let studentId = latestId;
    latestId += 1;
    let newStudent : Student = {
      student with
      id = studentId;
      attendedDays = 0;
      attendanceLog = [];
    };
    students.add(studentId, newStudent);
  };

  public shared func markAttendance(studentId : Nat) : async () {
    let updatedStudent = switch (students.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) {
        let today = Text.fromArray(Time.now().toText().trimEnd(#char '.').toArray().sliceToArray(0, 10));
        if (student.attendanceLog.find(func(date) { date == today }) != null) {
          Runtime.trap("Attendance already marked for today");
        };
        {
          student with
          attendedDays = student.attendedDays + 1;
          attendanceLog = student.attendanceLog.concat([today]);
        };
      };
    };
    students.add(studentId, updatedStudent);
  };

  public query func getAllStudents() : async [Student] {
    students.values().toArray().sort();
  };

  public query func getStudentsByCourse(course : Text) : async [Student] {
    students.values().toArray().filter(
      func(student) { student.course == course }
    ).sort();
  };

  public query func searchStudents(searchQuery : Text) : async [Student] {
    students.values().toArray().filter(
      func(student) { student.name.contains(#text searchQuery) }
    ).sort();
  };

  public query func getStudentByNameAndPhone(name : Text, parentPhone : Text) : async ?Student {
    students.values().toArray().find(
      func(student) {
        Text.equal(student.name, name) and Text.equal(student.parentPhone, parentPhone)
      }
    );
  };

  public shared func updateStudentNotes(studentId : Nat, notes : Text) : async () {
    let updatedStudent = switch (students.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { { student with notes } };
    };
    students.add(studentId, updatedStudent);
  };

  public query func getCourses() : async [Text] {
    courses;
  };

  public query func getStudentById(studentId : Nat) : async Student {
    switch (students.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { student };
    };
  };
};
