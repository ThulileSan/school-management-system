export interface Course {
  id: number;
  name: string;
  description: string;
}

export interface CourseDetail extends Course {
  students: { id: number; first_name: string; last_name: string; email: string }[];
  subjects: { id: number; name: string; description: string }[];
}
