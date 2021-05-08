interface FileAssignment extends File {
  path: string;
}

export type Assignment = {
  id: number;
  title: string;
  descripcion: string;
  isIndividual: boolean;
  isCompleted: boolean;
  dueDate: Date;
  courseId: number;
  files: FileAssignment[];
}
