"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Lesson } from "@/types"

export default function LessonsPage() {
  const params = useParams()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    video_url: "",
    order: 0,
  })

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", params.moduleId)
      .order("order", { ascending: true })

    if (data) {
      setLessons(data)
    }
  }, [params.moduleId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreateLesson = async () => {
    const { error } = await supabase.from("lessons").insert({
      ...newLesson,
      module_id: params.moduleId,
    })

    if (!error) {
      setNewLesson({
        title: "",
        description: "",
        video_url: "",
        order: 0,
      })
      fetchData()
    }
  }

  const handleDeleteLesson = async (id: string) => {
    const { error } = await supabase.from("lessons").delete().eq("id", id)

    if (!error) {
      fetchData()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Aulas</h2>
        <p className="text-muted-foreground">
          Gerencie as aulas deste módulo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Aula</CardTitle>
          <CardDescription>
            Adicione uma nova aula ao módulo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Título"
                value={newLesson.title}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, title: e.target.value })
                }
              />
            </div>
            <div>
              <Textarea
                placeholder="Descrição"
                value={newLesson.description}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, description: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                placeholder="URL do Vídeo"
                value={newLesson.video_url}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, video_url: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Ordem"
                value={newLesson.order}
                onChange={(e) =>
                  setNewLesson({
                    ...newLesson,
                    order: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <Button onClick={handleCreateLesson}>Criar Aula</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
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