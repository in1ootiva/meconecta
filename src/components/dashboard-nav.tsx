"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export function DashboardNav() {
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
        
        setIsAdmin(profile?.role === "admin")
      }
    }

    checkAdmin()
  }, [])

  return (
    <nav className="flex items-center space-x-4">
      <Link href="/dashboard/courses">
        <Button
          variant={pathname.startsWith("/dashboard/courses") ? "default" : "ghost"}
        >
          Cursos
        </Button>
      </Link>
      {isAdmin && (
        <>
          <Link href="/dashboard/admin/courses">
            <Button
              variant={pathname.startsWith("/dashboard/admin/courses") ? "default" : "ghost"}
            >
              Gerenciar Cursos
            </Button>
          </Link>
          <Link href="/dashboard/admin/assignments">
            <Button
              variant={pathname.startsWith("/dashboard/admin/assignments") ? "default" : "ghost"}
            >
              Atividades
            </Button>
          </Link>
        </>
      )}
    </nav>
  )
} 