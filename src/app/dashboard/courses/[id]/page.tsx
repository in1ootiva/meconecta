"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import type { Course, Module, Lesson } from "@/types"

export default function CoursePage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Buscar curso
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("id", params.id)
          .single()

        if (courseError) throw courseError
        setCourse(courseData)

        // Buscar módulos
        const { data: modulesData, error: modulesError } = await supabase
          .from("modules")
          .select("*")
          .eq("course_id", params.id)
          .order("order")

        if (modulesError) throw modulesError
        setModules(modulesData)

        // Buscar aulas
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", params.id)
          .order("order")

        if (lessonsError) throw lessonsError
        setLessons(lessonsData)
      } catch (error) {
        console.error("Erro ao buscar dados do curso:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [params.id])

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!course) {
    return <div>Curso não encontrado</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {selectedLesson ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedLesson.title}</h2>
            <div className="aspect-video bg-black mb-4">
              <video
                src={selectedLesson.video_url}
                controls
                className="w-full h-full"
              />
            </div>
            <p className="text-gray-600 mb-4">{selectedLesson.description}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
            {course.thumbnail_url && (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-gray-600">{course.description}</p>
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo do Curso</CardTitle>
            <CardDescription>
              {modules.length} módulos • {lessons.length} aulas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="space-y-2">
                  <h3 className="font-semibold">{module.title}</h3>
                  <div className="space-y-1">
                    {lessons
                      .filter((lesson) => lesson.module_id === module.id)
                      .map((lesson) => (
                        <Button
                          key={lesson.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          {lesson.title}
                        </Button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 