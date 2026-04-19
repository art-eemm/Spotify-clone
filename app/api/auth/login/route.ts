import { NextResponse } from "next/server"
import { supabaseClient } from "@/lib/supabaseClient"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    //* VALIDACION DE INFORMACION
    if (!email || !password) {
      return NextResponse.json(
        { error: "Los campos son obligatorios" },
        { status: 400 }
      )
    }

    //* LOGIN DEL USUARIO
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      )
    }

    const user = data.user
    const token = data.session?.access_token
    const { data: profile, error: profileError } = await supabaseClient
      .from("perfiles")
      .select("nombre, role")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: "Error al obtener el perfil del usuario" },
        { status: 500 }
      )
    }
    //* MENSAJE DE EXITO
    return NextResponse.json(
      {
        message: "Usuario logueado correctamente",
        user: user.email,
        nombre: profile.nombre,
        role: profile.role,
        token: token,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
