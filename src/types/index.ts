export type User = {
  id: string
  email: string
  role: 'student' | 'admin'
  name: string
  created_at: string
}

export type Course = {
  id: string
  title: string
  description: string
  thumbnail_url: string
  created_at: string
  updated_at: string
}

export type Module = {
  id: string
  course_id: string
  title: string
  description: string
  order: number
  created_at: string
  updated_at: string
}

export type Lesson = {
  id: string
  module_id: string
  title: string
  description: string
  video_url: string
  order: number
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  lesson_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
}

export type Assignment = {
  id: string
  lesson_id: string
  user_id: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
} 