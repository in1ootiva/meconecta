"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Course } from "@/types"

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      setCourses(data)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meus Cursos</h2>
        <p className="text-muted-foreground">
          Acesse seus cursos e continue aprendendo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {course.thumbnail_url && (
                <div className="relative aspect-video mb-4">
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <Button
                onClick={() =>
                  window.location.href = `/dashboard/courses/${course.id}`
                }
              >
                Acessar Curso
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 