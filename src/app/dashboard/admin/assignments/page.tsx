"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

type Assignment = {
  id: string
  user_id: string
  lesson_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user_name: string
  lesson_title: string
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')

  const fetchAssignments = useCallback(async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        user_name:profiles(email),
        lesson_title:lessons(title)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar atividades:', error)
      return
    }

    setAssignments(data || [])
  }, [status])

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  const handleStatusChange = async (assignmentId: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('assignments')
      .update({ status: newStatus })
      .eq('id', assignmentId)

    if (error) {
      console.error('Erro ao atualizar status:', error)
      return
    }

    fetchAssignments()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Atividades</h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${
              status === 'pending' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
            onClick={() => setStatus('pending')}
          >
            Pendentes
          </button>
          <button
            className={`px-4 py-2 rounded ${
              status === 'approved' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
            onClick={() => setStatus('approved')}
          >
            Aprovadas
          </button>
          <button
            className={`px-4 py-2 rounded ${
              status === 'rejected' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
            onClick={() => setStatus('rejected')}
          >
            Rejeitadas
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <CardTitle>
                {assignment.user_name || "Usuário"} -{" "}
                {assignment.lesson_title || "Aula"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Data: {new Date(assignment.created_at).toLocaleDateString()}
                  </p>
                </div>
                {status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded"
                      onClick={() => handleStatusChange(assignment.id, 'approved')}
                    >
                      Aprovar
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => handleStatusChange(assignment.id, 'rejected')}
                    >
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 