"use client"

import { useEffect, useState } from "react"
import { Play, Download } from "lucide-react"
import { SongCard } from "../song-card"
import { AlbumCard } from "../album-card"
import { Album, Song, Artist, usePlayerStore } from "@/lib/store"
import { Capacitor } from "@capacitor/core"

export function HomeView() {
  const [songs, setSongs] = useState<Song[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isNative = Capacitor.isNativePlatform()

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [songsRes, albumsRes, artistsRes] = await Promise.all([
          fetch("/api/songs"),
          fetch("/api/albums"),
          fetch("/api/artists"),
        ])

        if (songsRes.ok) {
          const data = await songsRes.json()
          const mappedSongs = data.map((s: any) => ({
            ...s,
            artista:
              s.cancion_artista?.[0]?.artistas?.nombre || "Artista desconocido",
          }))
          setSongs(mappedSongs)
        }
        if (albumsRes.ok) {
          const res = await albumsRes.json()
          setAlbums(res.data || res)
        }
        if (artistsRes.ok) {
          const res = await artistsRes.json()
          setArtists(res.data || res)
        }
      } catch (error) {
        console.error("Error cargando datos reales:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  const { playAllFromIndex } = usePlayerStore()

  const handlePlaySection = (startIndex: number) => {
    playAllFromIndex(songs, startIndex)
  }

  if (isLoading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Cargando música...
      </div>
    )

  return (
    <div className="px-4 pb-8 md:px-8">
      {!isNative && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-primary/20 bg-linear-to-r from-primary/20 to-primary/5 p-4 sm:mb-8">
          <div className="mr-4">
            <h3 className="text-sm font-bold text-foreground sm:text-base">
              Lleva la música contigo
            </h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Descarga nuestra app para una mejor experiencia.
            </p>
          </div>
          <a
            href="/Soundwave.apk"
            download={"Soundwave.apk"}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Instalar App</span>
            <span className="sm:hidden">Instalar</span>
          </a>
        </div>
      )}
      {/* Play grid */}
      <section className="mb-6 sm:mb-8">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {songs.slice(0, 6).map((song, index) => (
            <button
              key={song.id}
              onClick={() => handlePlaySection(index)}
              className="group flex items-center gap-2 overflow-hidden rounded-md bg-secondary/50 transition-colors hover:bg-secondary active:scale-[0.98] sm:gap-3"
            >
              <img
                src={song.portada} // ANTES: song.cover (No existe en DB)
                alt={song.titulo} // ANTES: song.name (No existe en DB)
                className="h-12 w-12 object-cover sm:h-14 sm:w-14"
              />
              <span className="flex-1 truncate pr-2 text-left text-xs font-medium text-foreground sm:text-sm">
                {song.titulo}
              </span>
              <div className="mr-2 hidden h-8 w-8 items-center justify-center rounded-full bg-primary group-hover:flex">
                <Play className="ml-0.5 h-4 w-4 fill-current text-primary-foreground" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recently played */}
      <section className="mb-6 sm:mb-8">
        <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
          Escuchaste Recientemente
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {songs.slice(0, 6).map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Top Artists */}
      {/* <section className="mb-6 sm:mb-8">
        <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
          Artistas Destacados
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {artists.slice(0, 6).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section> */}

      {/* Albums */}
      <section className="mb-6 sm:mb-8">
        <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
          Albums Populares
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {albums.slice(0, 6).map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>
    </div>
  )
}
