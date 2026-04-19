import { NextResponse } from "next/server"
import { supabaseClient } from "@/lib/supabaseClient"
import { getUserFromToken, isAdmin } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

//* OBTENER TODOS LOS ALBUMES DE LOS ARTISTAS
export async function GET() {
  const { data, error } = await supabaseClient.from("albums").select("*")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

//* CREAR LOS ALBUMES
export async function POST(request: Request) {
  //* VALIDACION DE USUARIO
  const user = await getUserFromToken(request)
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const admin = await isAdmin(user.id)
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const formData = await request.formData()
  //* OBTENER DATOS DEL ALBUM
  const titulo = formData.get("titulo") as string
  const artista_id = formData.get("artista") as string
  const fecha_lanzamiento = formData.get("fecha_lanzamiento") as string
  const portada = formData.get("portada") as File | null

  //* VALIDACION DE DATOS
  if (!titulo || !artista_id) {
    return NextResponse.json({ error: "Hay datos requeridos" }, { status: 400 })
  }

  //* SUBIR PORTADA SI EXISTE
  let portadaUrl: string | null = null

  if (portada && portada.size > 0) {
    const arrayBuffer = await portada.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const cleanImageName = sanitizeFileName(portada.name)
    const imagePath = `portadas/${Date.now()}_${cleanImageName}`

    const { error: uploadImageError } = await supabaseAdmin.storage
      .from("portadas")
      .upload(imagePath, buffer, {
        contentType: portada.type,
      })

    if (uploadImageError) {
      return NextResponse.json(
        { error: uploadImageError.message },
        { status: 500 }
      )
    }

    const { data: publicImageUrl } = supabaseAdmin.storage
      .from("portadas")
      .getPublicUrl(imagePath)

    portadaUrl = publicImageUrl.publicUrl
  }

  //* INSERTAR ALBUM EN LA BASE DE DATOS
  const { data, error } = await supabaseAdmin
    .from("albums")
    .insert([
      {
        titulo,
        artista_id,
        fecha_lanzamiento,
        portada: portadaUrl,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

//* ACTUALIZAR ALBUM

//* ELIMINAR ALBUM

//* FUNCION PARA SANITIZAR NOMBRES DE ARCHIVOS
function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD") // quita acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_") // espacios → _
    .replace(/[^a-zA-Z0-9._-]/g, "") // solo caracteres seguros
}
