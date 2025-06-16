"use client"

import { useEffect, useState, useCallback } from "react"
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
import type { Course, Module } from "@/types"

export default function AdminModulesPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    order: 0,
  })

  const fetchData = useCallback(async () => {
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
        .order("order", { ascending: true })

      if (modulesError) throw modulesError
      setModules(modulesData || [])
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreateModule = async () => {
    try {
      const { error } = await supabase.from("modules").insert([
        {
          ...newModule,
          course_id: params.id,
        },
      ])

      if (error) throw error

      setIsDialogOpen(false)
      setNewModule({ title: "", description: "", order: 0 })
      fetchData()
    } catch (error) {
      console.error("Erro ao criar módulo:", error)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Tem certeza que deseja excluir este módulo?")) return

    try {
      const { error } = await supabase
        .from("modules")
        .delete()
        .eq("id", moduleId)

      if (error) throw error

      fetchData()
    } catch (error) {
      console.error("Erro ao excluir módulo:", error)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!course) {
    return <div>Curso não encontrado</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Módulos</h1>
          <p className="text-gray-600">{course.title}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Criar Novo Módulo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Módulo</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo módulo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title">Título</label>
                <Input
                  id="title"
                  value={newModule.title}
                  onChange={(e) =>
                    setNewModule({ ...newModule, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Descrição</label>
                <Textarea
                  id="description"
                  value={newModule.description}
                  onChange={(e) =>
                    setNewModule({ ...newModule, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="order">Ordem</label>
                <Input
                  id="order"
                  type="number"
                  value={newModule.order}
                  onChange={(e) =>
                    setNewModule({
                      ...newModule,
                      order: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateModule}>Criar Módulo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/dashboard/admin/courses/${params.id}/modules/${module.id}/lessons`
                    )
                  }
                >
                  Gerenciar Aulas
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteModule(module.id)}
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