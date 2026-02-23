export interface Subject {
  id: number;
  name: string;
  description: string;
  course: number;
  lecturer: number;
  students: number[];
}

export interface SubjectDetail {
  id: number;
  name: string;
  description: string;
  course: { id: number; name: string };
  lecturer: { id: number; first_name: string; last_name: string };
  students: { id: number; first_name: string; last_name: string }[];
}
