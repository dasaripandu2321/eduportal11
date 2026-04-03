export interface Course {
  id: string; title: string; description: string;
  createdAt: string; imageUrl?: string; teacherId: string;
}
export interface Module {
  id: string; title: string; description: string;
  orderIndex: number; createdAt: string; courseId: string;
}
export interface Lesson {
  id: string; title: string; content: string;
  orderIndex: number; createdAt: string; moduleId: string; externalLink?: string;
}
export interface Question {
  id: string; queryText: string; aiResponse: string;
  createdAt: string; studentId: string; lessonId: string;
}
export interface StudentProgress {
  id: string; isCompleted: boolean;
  createdAt: string; updatedAt: string; studentId: string; lessonId: string;
}
