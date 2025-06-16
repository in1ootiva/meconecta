"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import type { Assignment } from "@/types"

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<(Assignment & { profiles: { name: string }, lessons: { title: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from("assignments")
        .select("*, profiles(name), lessons(title)")
        .order("created_at", { ascending: false })

      if (error) throw error

      setAssignments(data || [])
    } catch (error) {
      console.error("Erro ao buscar atividades:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (assignmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("assignments")
        .update({ status })
        .eq("id", assignmentId)

      if (error) throw error

      fetchAssignments()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gerenciar Atividades</h1>
      <div className="grid grid-cols-1 gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <CardTitle>{assignment.lessons.title}</CardTitle>
              <CardDescription>
                Atividade enviada por {assignment.profiles.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">{assignment.content}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Status atual: {assignment.status}
                  </span>
                  <Select
                    defaultValue={assignment.status}
                    onValueChange={(value) =>
                      handleUpdateStatus(assignment.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 