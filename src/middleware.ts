import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verifica se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se o usuário estiver autenticado e tentar acessar login/register, redireciona para o dashboard
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Se o usuário não estiver autenticado e tentar acessar páginas protegidas, redireciona para o login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
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
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
} 