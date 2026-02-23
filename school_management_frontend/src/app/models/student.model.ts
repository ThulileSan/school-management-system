export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  course: number;
  subjects: number[];
}

export interface StudentDetail {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  course: { id: number; name: string; description: string };
  subjects: { id: number; name: string; description: string }[];
}
