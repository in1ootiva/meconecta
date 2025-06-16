"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import type { Course } from "@/types"
import Link from "next/link"

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        setCourses(data || [])
      } catch (error) {
        console.error("Erro ao buscar cursos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Cursos Disponíveis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link key={course.id} href={`/dashboard/courses/${course.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {course.thumbnail_url && (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 