import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Se não estiver autenticado, redireciona para o login
    if (!session) {
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Verifica se é uma rota administrativa
    if (req.nextUrl.pathname.startsWith("/dashboard/admin")) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (error) {
        console.error("Erro ao verificar perfil:", error)
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }

      // Se não for admin, redireciona para o dashboard
      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    return res
  } catch (error) {
    console.error("Erro no middleware:", error)
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
} 