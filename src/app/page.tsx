import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Plataforma de Cursos de Programação
        </h1>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button variant="default">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Cadastrar</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
