import { NextResponse } from "next/server"
import { supabaseClient } from "@/lib/supabaseClient"
import { getUserFromToken, isAdmin } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

//* OBTENER CANCIONES
export async function GET() {
  const { data, error } = await supabaseClient.from("canciones").select(`
            id,
            titulo,
            duracion,
            url_audio,
            portada,
            albums (
            titulo
            ),
            cancion_artista (
            artistas (
                nombre
            )
            ),
            cancion_genero (
            generos (
                nombre
            )
            )
        `)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

//* CREAR CANCION
export async function POST(request: Request) {
  try {
    //* 1. VALIDACION DE USUARIO
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const admin = await isAdmin(user.id)
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    //* 2. OBTENER DATOS (Ahora recibimos JSON, no FormData)
    const body = await request.json()

    const {
      titulo,
      duracion,
      genero_id,
      artista_id,
      album_id,
      url_audio,
      portada,
    } = body

    //* 3. VALIDACION DE DATOS BÁSICA
    if (!titulo || !duracion || !url_audio || !genero_id || !artista_id) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para registrar la canción" },
        { status: 400 }
      )
    }

    //* 4. GUARDAMOS EN BASE DE DATOS LA CANCION
    const { data: songData, error: songError } = await supabaseAdmin
      .from("canciones")
      .insert([
        {
          titulo: titulo,
          album_id: album_id || null,
          duracion: Number(duracion),
          url_audio: url_audio,
          portada: portada || null,
        },
      ])
      .select()
      .single()

    if (songError) {
      return NextResponse.json({ error: songError.message }, { status: 500 })
    }

    const songId = songData.id

    //* 5. GUARDAMOS EN TABLA CANCION_GENERO
    const { error: errorData } = await supabaseAdmin
      .from("cancion_genero")
      .insert([
        {
          cancion_id: songId,
          genero_id: genero_id,
        },
      ])

    if (errorData) {
      return NextResponse.json(
        { error: "Error al vincular género: " + errorData.message },
        { status: 500 }
      )
    }

    //* 6. GUARDAMOS EN TABLA CANCION_ARTISTA
    const { error: artistaError } = await supabaseAdmin
      .from("cancion_artista")
      .insert([
        {
          cancion_id: songId,
          artista_id: artista_id,
        },
      ])

    if (artistaError) {
      return NextResponse.json(
        { error: "Error al vincular artista: " + artistaError.message },
        { status: 500 }
      )
    }

    //* 7. RESPUESTA EXITOSA
    return NextResponse.json(
      { message: "Canción creada exitosamente", song: songData },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error en API:", error)
    return NextResponse.json(
      { error: "Error interno del servidor al crear la canción" },
      { status: 500 }
    )
  }
}
