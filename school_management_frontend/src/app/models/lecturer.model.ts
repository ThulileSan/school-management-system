export interface Lecturer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface LecturerDetail extends Lecturer {
  subjects: { id: number; name: string; course: { id: number; name: string } }[];
  courses: { id: number; name: string }[];
}
