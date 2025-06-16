"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import type { Course, Module, Lesson, Comment, Assignment } from "@/types"

export default function LessonPage() {
  const params = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [module, setModule] = useState<Module | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [newAssignment, setNewAssignment] = useState("")

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

      // Buscar aula
      const { data: lessonData, error: lessonError } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", params.lessonId)
        .single()

      if (lessonError) throw lessonError
      setLesson(lessonData)

      // Buscar módulo
      const { data: moduleData, error: moduleError } = await supabase
        .from("modules")
        .select("*")
        .eq("id", lessonData.module_id)
        .single()

      if (moduleError) throw moduleError
      setModule(moduleData)

      // Buscar comentários
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*, profiles(name)")
        .eq("lesson_id", params.lessonId)
        .order("created_at", { ascending: false })

      if (commentsError) throw commentsError
      setComments(commentsData || [])

      // Buscar atividades
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("assignments")
        .select("*, profiles(name)")
        .eq("lesson_id", params.lessonId)
        .order("created_at", { ascending: false })

      if (assignmentsError) throw assignmentsError
      setAssignments(assignmentsData || [])
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { error } = await supabase.from("comments").insert([
        {
          lesson_id: params.lessonId,
          user_id: user.id,
          content: newComment,
        },
      ])

      if (error) throw error

      setNewComment("")
      fetchData()
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error)
    }
  }

  const handleSubmitAssignment = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { error } = await supabase.from("assignments").insert([
        {
          lesson_id: params.lessonId,
          user_id: user.id,
          content: newAssignment,
          status: "pending",
        },
      ])

      if (error) throw error

      setNewAssignment("")
      fetchData()
    } catch (error) {
      console.error("Erro ao enviar atividade:", error)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!course || !module || !lesson) {
    return <div>Curso, módulo ou aula não encontrado</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div>
          <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
          <div className="aspect-video bg-black mb-4">
            <video
              src={lesson.video_url}
              controls
              className="w-full h-full"
            />
          </div>
          <p className="text-gray-600 mb-8">{lesson.description}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comentários</CardTitle>
              <CardDescription>
                Compartilhe suas dúvidas e opiniões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicione um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={handleAddComment}>Comentar</Button>
                </div>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-4">
                      <div className="font-semibold">
                        {(comment as any).profiles.name}
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividades</CardTitle>
              <CardDescription>
                Envie suas atividades para avaliação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Digite sua atividade..."
                    value={newAssignment}
                    onChange={(e) => setNewAssignment(e.target.value)}
                  />
                  <Button onClick={handleSubmitAssignment}>
                    Enviar Atividade
                  </Button>
                </div>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="border-b pb-4">
                      <div className="font-semibold">
                        {(assignment as any).profiles.name}
                      </div>
                      <p className="text-gray-600">{assignment.content}</p>
                      <div className="text-sm text-gray-500">
                        Status: {assignment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Curso</CardTitle>
            <CardDescription>
              {course.title} - {module.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{course.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 