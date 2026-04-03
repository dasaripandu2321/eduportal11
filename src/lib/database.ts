// Firebase removed — database operations are now stubs.
// Replace with your preferred backend (e.g. Prisma, REST API) as needed.

import type {
  AppUser,
  Course,
  Module,
  Lesson,
  Question,
  StudentProgress,
} from '@/contexts/auth-context';

export const getUserById = async (_userId: string): Promise<AppUser | null> => null;

export const updateUserType = async (
  _userId: string,
  _userType: 'student' | 'teacher' | 'admin'
): Promise<void> => {};

export const createCourse = async (
  _courseData: Omit<Course, 'id' | 'createdAt'>
): Promise<string> => Math.random().toString(36).slice(2);

export const getCoursesByTeacher = async (_teacherId: string): Promise<Course[]> => [];

export const getAllCourses = async (): Promise<Course[]> => [];
