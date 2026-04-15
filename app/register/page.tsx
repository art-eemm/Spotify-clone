"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const register = useAuthStore((state) => state.register)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, completa todos los campos.")
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    const success = register(name, email, password)
    if (success) {
      router.push("/")
    } else {
      setError("El correo electrónico ya está registrado.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
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
            <span className="text-3xl font-bold">Soundwave</span>
          </div>
        </div>

        <div className="rounded-xl bg-card p-8">
          <h1 className="mb-2 text-center text-2xl font-bold text-foreground">
            Crear cuenta
          </h1>
          <p className="mb-6 text-center text-muted-foreground">
            Empieza a escuchar música sin límites
          </p>

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">
                  ¿Cómo deberiamos llamarte?
                </FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre de perfil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-border bg-secondary"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Correo eléctronico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border bg-secondary"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Crea una contraseña</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border bg-secondary"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Repite la contraseña
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="confirmPassword"
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-border bg-secondary"
                />
              </Field>
            </FieldGroup>

            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground hover:cursor-pointer hover:bg-primary/80"
            >
              Registrarse
            </Button>
          </form>

          <div className="mt-8 border-t border-border pt-6 text-center">
            <p className="text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href={"/login"}
                className="text-foreground underline hover:text-primary"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
