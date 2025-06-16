"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Assignment } from "@/types"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [status, setStatus] = useState<string>("all")

  useEffect(() => {
    fetchAssignments()
  }, [status])

  const fetchAssignments = async () => {
    let query = supabase
      .from("assignments")
      .select("*, profiles(name), lessons(title)")
      .order("created_at", { ascending: false })

    if (status !== "all") {
      query = query.eq("status", status)
    }

    const { data } = await query

    if (data) {
      setAssignments(data)
    }
  }

  const handleStatusChange = async (assignmentId: string, newStatus: string) => {
    const { error } = await supabase
      .from("assignments")
      .update({ status: newStatus })
      .eq("id", assignmentId)

    if (!error) {
      fetchAssignments()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Atividades</h2>
        <p className="text-muted-foreground">
          Gerencie as atividades enviadas pelos alunos.
        </p>
      </div>

      <div className="flex justify-end">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="rejected">Rejeitados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <CardTitle>
                {assignment.profiles?.name || "Usuário"} -{" "}
                {assignment.lessons?.title || "Aula"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>{assignment.content}</p>
                <div className="flex justify-end">
                  <Select
                    value={assignment.status}
                    onValueChange={(value) =>
                      handleStatusChange(assignment.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
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