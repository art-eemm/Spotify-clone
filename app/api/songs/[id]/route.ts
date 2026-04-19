import { NextResponse } from "next/server"
import { getUserFromToken, isAdmin } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { NextRequest } from "next/server"

//* ACTUALIZACION DE CANCION
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    //* VALIDACION DE INFORMACION
    const titulo = formData.get("titulo") as string
    const album_id = formData.get("album_id") as string | null
    const duracionRaw = Number(formData.get("duracion"))
    const audioFile = formData.get("audio") as File | null
    const portadaFile = formData.get("portada") as File | null

    const id_genero = formData.get("genero") as string
    const id_artista = formData.get("artista") as string

    if (!titulo || !duracionRaw) {
      return NextResponse.json(
        { error: "Algunos datos son requeridos" },
        { status: 400 }
      )
    }

    //* OBTENEMOS LA CANCION EXISTENTE
    const { data: existingSong, error: fetchError } = await supabaseAdmin
      .from("canciones")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError || !existingSong) {
      return NextResponse.json(
        { error: "Canción no encontrada" },
        { status: 404 }
      )
    }

    let url_audio = existingSong.url_audio
    let portadaUrl = existingSong.portada

    //*REEMPLAZAMOS ARCHIVO DE AUDIO SI SE ENVIA NUEVO
    if (audioFile && audioFile.size > 0) {
      const arrayBuffer = await audioFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const cleanName = sanitizeFileName(audioFile.name)
      const filePath = `canciones/${Date.now()}_${cleanName}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from("songs")
        .upload(filePath, buffer, {
          contentType: audioFile.type,
        })

      if (uploadError) {
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        )
      }

      const { data: publicUrl } = supabaseAdmin.storage
        .from("songs")
        .getPublicUrl(filePath)

      url_audio = publicUrl.publicUrl
    }

    //* REEMPLAZAMOS PORTADA SI SE ENVIA NUEVA
    if (portadaFile && portadaFile.size > 0) {
      const arrayBuffer = await portadaFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const cleanImageName = sanitizeFileName(portadaFile.name)
      const imagePath = `portadas/${Date.now()}_${cleanImageName}`

      const { error: uploadImageError } = await supabaseAdmin.storage
        .from("portadas")
        .upload(imagePath, buffer, {
          contentType: portadaFile.type,
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

    //* ACTUALIZAMOS INFORMACION DE LA CANCION
    const { data, error } = await supabaseAdmin
      .from("canciones")
      .update({
        titulo: titulo,
        duracion: duracionRaw,
        album_id: album_id || null,
        url_audio: url_audio,
        portada: portadaUrl,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    //* ACTUALIZAMOS GENERO Y ARTISTA SI SE ENVIA NUEVO
    if (id_genero) {
      await supabaseAdmin.from("cancion_genero").delete().eq("cancion_id", id)

      await supabaseAdmin.from("cancion_genero").insert({
        cancion_id: id,
        genero_id: id_genero,
      })
    }

    if (id_artista) {
      await supabaseAdmin.from("cancion_artista").delete().eq("cancion_id", id)

      await supabaseAdmin.from("cancion_artista").insert({
        cancion_id: id,
        artista_id: id_artista,
      })
    }

    return NextResponse.json({
      message: "Canción actualizada correctamente",
      song: data,
    })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

//* ELIMINACION DE CANCION
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    //* VALIDACION DE USUARIO
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const admin = await isAdmin(user.id)
    if (!admin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    //* CAMBIAMOS EL ESTATUS DE LA CANCION A 0
    const { error } = await supabaseAdmin
      .from("canciones")
      .update({ estatus: 0 })
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { message: "Canción eliminada exitosamente" },
      { status: 200 }
    )
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

//* FUNCION PARA SANITIZAR NOMBRES DE ARCHIVOS
function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD") // quita acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_") // espacios → _
    .replace(/[^a-zA-Z0-9._-]/g, "") // solo caracteres seguros
}
