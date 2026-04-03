'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, GraduationCap, MessageSquare, TrendingUp } from 'lucide-react';
import { getAllCourses, getCoursesByTeacher, getCourseStats } from '@/lib/database';
import type { Course } from '@/contexts/auth-context';

export function Dashboard() {
  const { appUser } = useAuth();
  const [courses, setCourses] =