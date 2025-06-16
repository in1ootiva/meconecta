"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import type { Course } from "@/types"

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    thumbnail_url: "",
  })
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

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

  const handleCreateCourse = async () => {
    try {
      const { error } = await supabase.from("courses").insert([newCourse])

      if (error) throw error

      setIsDialogOpen(false)
      setNewCourse({ title: "", description: "", thumbnail_url: "" })
      fetchCourses()
    } catch (error) {
      console.error("Erro ao criar curso:", error)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Tem certeza que deseja excluir este curso?")) return

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId)

      if (error) throw error

      fetchCourses()
    } catch (error) {
      console.error("Erro ao excluir curso:", error)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Cursos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Criar Novo Curso</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Curso</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo curso
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Título</label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Descrição</label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="thumbnail">URL da Thumbnail</label>
                <Input
                  id="thumbnail"
                  value={newCourse.thumbnail_url}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, thumbnail_url: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCourse}>Criar Curso</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {course.thumbnail_url && (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/dashboard/admin/courses/${course.id}/modules`)
                  }
                >
                  Gerenciar Módulos
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteCourse(course.id)}
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