"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor, completa todos los campos.")
      return
    }

    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        router.replace("/")
      } else {
        setError(result.error || "Credenciales inválidas.")
      }
    } catch (err) {
      setError("Ocurrió un error al conectar con el servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 text-primary-foreground"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-foreground">
              Soundwave
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-xl bg-card p-8">
          <h1 className="mb-6 text-center text-2xl font-bold text-foreground">
            Iniciar sesión en Soundwave
          </h1>

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border bg-secondary"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border bg-secondary"
                />
              </Field>
            </FieldGroup>

            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground hover:cursor-pointer hover:bg-primary/80"
            >
              {isLoading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-8 border-t border-border pt-6 text-center">
            <p className="text-muted-foreground">
              {"¿No tienes una cuenta? "}
              <Link
                href={"/register"}
                className="text-foreground underline hover:text-primary"
              >
                Crea una
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
