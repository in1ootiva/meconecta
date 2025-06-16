"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import type { Course, Module, Lesson } from "@/types"

export default function AdminLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    video_url: "",
    order: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Buscar curso
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", params.id)
        .single()

      if (courseError) throw courseError
      setCourse(courseData)

      // Buscar módulo
      const { data: moduleData, error: moduleError } = await supabase
        .from("modules")
        .select("*")
        .eq("id", params.moduleId)
        .single()

      if (moduleError) throw moduleError
      setModule(moduleData)

      // Buscar aulas
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("module_id", params.moduleId)
        .order("order")

      if (lessonsError) throw lessonsError
      setLessons(lessonsData || [])
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLesson = async () => {
    try {
      const { error } = await supabase.from("lessons").insert([
        {
          ...newLesson,
          module_id: params.moduleId,
        },
      ])

      if (error) throw error

      setIsDialogOpen(false)
      setNewLesson({ title: "", description: "", video_url: "", order: 0 })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar aula:", error)
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) return

    try {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", lessonId)

      if (error) throw error

      fetchData()
    } catch (error) {
      console.error("Erro ao excluir aula:", error)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!course || !module) {
    return <div>Curso ou módulo não encontrado</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Aulas</h1>
          <p className="text-gray-600">
            {course.title} - {module.title}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Criar Nova Aula</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Aula</DialogTitle>
              <DialogDescription>
                Preencha os dados da nova aula
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Título</label>
                <Input
                  id="title"
                  value={newLesson.title}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Descrição</label>
                <Textarea
                  id="description"
                  value={newLesson.description}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="video">URL do Vídeo</label>
                <Input
                  id="video"
                  value={newLesson.video_url}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, video_url: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="order">Ordem</label>
                <Input
                  id="order"
                  type="number"
                  value={newLesson.order}
                  onChange={(e) =>
                    setNewLesson({
                      ...newLesson,
                      order: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateLesson}>Criar Aula</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {lesson.video_url && (
                <div className="aspect-video bg-black mb-4">
                  <video
                    src={lesson.video_url}
                    controls
                    className="w-full h-full"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteLesson(lesson.id)}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 