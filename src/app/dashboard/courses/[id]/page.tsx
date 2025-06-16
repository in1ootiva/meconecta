"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
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
import type { Module } from "@/types"

export default function CoursePage() {
  const params = useParams()
  const [course, setCourse] = useState<{
    id: string
    title: string
    description: string
    thumbnail_url: string
  } | null>(null)
  const [modules, setModules] = useState<Module[]>([])

  const fetchData = useCallback(async () => {
    // Buscar dados do curso
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", params.id)
      .single()

    if (courseError) {
      console.error("Erro ao buscar curso:", courseError)
      return
    }

    setCourse(courseData)

    // Buscar módulos
    const { data: modulesData, error: modulesError } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", params.id)
      .order("order", { ascending: true })

    if (modulesError) {
      console.error("Erro ao buscar módulos:", modulesError)
      return
    }

    setModules(modulesData || [])
  }, [params.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (!course) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{course.title}</h2>
        <p className="text-muted-foreground">{course.description}</p>
      </div>

      {course.thumbnail_url && (
        <div className="relative aspect-video">
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() =>
                  window.location.href = `/dashboard/courses/${course.id}/modules/${module.id}/lessons`
                }
              >
                Ver Aulas
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 