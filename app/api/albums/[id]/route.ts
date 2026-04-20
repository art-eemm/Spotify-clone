import { NextResponse } from "next/server"
import { supabaseClient } from "@/lib/supabaseClient"

interface RawSong {
  id: string
  titulo: string
  duracion: number
  url_audio: string
  portada: string
  cancion_artista:
    | {
        artistas: {
          nombre: string
        } | null
      }[]
    | null
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { data: albumData, error: albumError } = await supabaseClient
      .from("albums")
      .select("*")
      .eq("id", id)
      .single()

    if (albumError) throw albumError

    const { data: songsData, error: songsError } = await supabaseClient
      .from("canciones")
      .select(
        `
        id,
        titulo,
        duracion,
        url_audio,
        portada,
        cancion_artista (
          artistas (
            nombre
          )
        )
      `
      )
      .eq("album_id", id)

    if (songsError) throw songsError

    const rawSongs = songsData as unknown as RawSong[]

    const formattedSongs = rawSongs.map((song) => {
      const artistaNombre =
        song.cancion_artista?.[0]?.artistas?.nombre || "Artista desconocido"

      return {
        id: song.id,
        titulo: song.titulo,
        duracion: song.duracion,
        url_audio: song.url_audio,
        portada: song.portada,
        artista: artistaNombre,
      }
    })

    return NextResponse.json({
      album: albumData,
      songs: formattedSongs,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: "Ocurrió un error desconocido al obtener el álbum" },
      { status: 500 }
    )
  }
}
