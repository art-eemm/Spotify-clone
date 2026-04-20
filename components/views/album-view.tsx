"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigationStore, usePlayerStore, Song, Album } from "@/lib/store"
import { Play, Clock, ChevronLeft, Pause } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

export function AlbumView() {
  const { currentAlbumId, setView } = useNavigationStore()
  const { playSong, playAllFromIndex, isPlaying, currentSong, togglePlay } =
    usePlayerStore()

  const [album, setAlbum] = useState<Album | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [currentAlbumId])

  useEffect(() => {
    if (!currentAlbumId) return

    const fetchAlbumData = async () => {
      setIsLoading(true)
      try {
        // Ahora consumimos el nuevo endpoint dinámico que crearemos a continuación
        const response = await fetch(`/api/albums/${currentAlbumId}`)
        const data = await response.json()

        if (data.album) {
          setAlbum(data.album)
          setSongs(data.songs)
        }
      } catch (error) {
        console.error("Error al cargar el álbum:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlbumData()
  }, [currentAlbumId])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <p className="animate-pulse text-sm text-muted-foreground">
          Cargando álbum...
        </p>
      </div>
    )
  }

  if (!album) return null

  const isCurrentAlbumPlaying =
    songs.some((s) => s.id === currentSong?.id) && isPlaying

  return (
    <div
      ref={containerRef}
      className="no-scrollbar flex h-full flex-col overflow-y-auto bg-linear-to-b from-secondary/30 to-background pb-24"
    >
      {/* Botón Volver */}
      <div className="px-4 pt-4 md:hidden">
        <button
          onClick={() => setView("search")}
          className="rounded-full bg-black/20 p-2"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Header Adaptable */}
      <header className="flex flex-col items-center gap-6 px-4 pt-4 pb-6 md:flex-row md:items-end md:px-8 md:pt-12">
        <div className="shrink-0 shadow-2xl">
          <img
            src={album.portada}
            alt={album.titulo}
            className="h-48 w-48 rounded-md object-cover shadow-2xl sm:h-56 sm:w-56 md:h-60 md:w-60"
          />
        </div>
        <div className="flex flex-col gap-1 text-center md:gap-2 md:text-left">
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase md:text-xs md:text-foreground">
            Álbum
          </span>
          <h1 className="text-2xl leading-tight font-black text-foreground sm:text-4xl md:text-6xl lg:text-7xl">
            {album.titulo}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-sm md:justify-start">
            <span className="cursor-pointer font-bold hover:underline">
              {album.artista}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {songs.length} canciones
            </span>
          </div>
        </div>
      </header>

      {/* Controles Principales */}
      <div className="flex items-center gap-4 px-4 py-4 md:px-8">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-primary shadow-lg transition-all hover:scale-105 md:h-14 md:w-14"
          onClick={() => {
            if (isCurrentAlbumPlaying) togglePlay()
            else if (songs.length > 0) playAllFromIndex(songs, 0)
          }}
        >
          {isCurrentAlbumPlaying ? (
            <Pause className="h-6 w-6 fill-current text-primary-foreground" />
          ) : (
            <Play className="ml-1 h-6 w-6 fill-current text-primary-foreground" />
          )}
        </Button>
      </div>

      {/* Tabla de Canciones Responsiva */}
      <div className="px-2 md:px-8">
        <div className="mb-2 grid grid-cols-[32px_1fr_auto] gap-4 border-b border-white/5 px-4 py-2 text-[10px] tracking-widest text-muted-foreground uppercase md:grid-cols-[40px_1fr_auto] md:text-xs">
          <span className="text-center">#</span>
          <span>Título</span>
          <Clock className="mr-2 h-4 w-4" />
        </div>

        <div className="flex flex-col">
          {songs.map((song, index) => (
            <div
              key={song.id}
              onClick={() => playAllFromIndex(songs, index)}
              className="group grid cursor-pointer grid-cols-[32px_1fr_auto] items-center gap-4 rounded-md px-3 py-3 transition-colors hover:bg-white/5 md:grid-cols-[40px_1fr_auto] md:px-4"
            >
              <div className="flex items-center justify-center text-sm">
                {currentSong?.id === song.id && isPlaying ? (
                  <div className="flex h-3 items-end gap-0.5">
                    <div className="w-1 animate-[bounce_1s_infinite] bg-primary" />
                    <div className="w-1 animate-[bounce_1.2s_infinite] bg-primary" />
                    <div className="w-1 animate-[bounce_0.8s_infinite] bg-primary" />
                  </div>
                ) : (
                  <span
                    className={cn(
                      "text-muted-foreground group-hover:text-foreground",
                      currentSong?.id === song.id && "text-primary"
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-col">
                <span
                  className={cn(
                    "truncate text-sm font-medium md:text-base",
                    currentSong?.id === song.id
                      ? "text-primary"
                      : "text-foreground"
                  )}
                >
                  {song.titulo}
                </span>
                <span className="truncate text-xs text-muted-foreground group-hover:text-foreground/70">
                  {song.artista}
                </span>
              </div>

              <span className="mr-2 text-xs text-muted-foreground tabular-nums md:text-sm">
                {Math.floor(song.duracion / 60)}:
                {(song.duracion % 60).toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
