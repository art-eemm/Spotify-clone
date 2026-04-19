"use client"

import { Play, Music, Heart } from "lucide-react"
import { useNavigationStore, type Playlist } from "@/lib/store"

interface PlaylistCardProps {
  playlist: Playlist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const setCurrentPlaylistId = useNavigationStore(
    (state) => state.setCurrentPlaylistId
  )

  return (
    <div
      onClick={() => setCurrentPlaylistId(playlist.id)}
      className="group relative cursor-pointer rounded-lg bg-card p-4 transition-all duration-300 hover:bg-secondary/80"
    >
      <div className="relative mb-4 aspect-square">
        {playlist.songs.length > 0 ? (
          <div className="grid h-full w-full grid-cols-2 gap-0.5 overflow-hidden rounded-md shadow-lg">
            {playlist.songs.slice(0, 4).map((song, i) => (
              <img
                key={song.id}
                src={song.portada}
                alt={song.titulo}
                className="h-full w-full object-cover"
              />
            ))}
            {playlist.songs.length < 4 &&
              Array.from({ length: 4 - playlist.songs.length }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-full w-full items-center justify-center bg-muted"
                >
                  <Music className="h-6 w-6 text-muted-foreground" />
                </div>
              ))}
          </div>
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center rounded-md shadow-lg ${
              playlist.id === "liked"
                ? "bg-linear-to-br from-indigo-500 to-purple-600"
                : "bg-muted"
            }`}
          >
            {playlist.id === "liked" ? (
              <Heart className="h-16 w-16 text-white" />
            ) : (
              <Music className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
        )}
        <button className="absolute right-2 bottom-2 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-primary opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105">
          <Play className="ml-0.5 h-5 w-5 fill-current text-primary-foreground" />
        </button>
      </div>
      <h3 className="truncate font-semibold text-foreground">
        {playlist.name}
      </h3>
      <p className="mt-1 truncate text-sm text-muted-foreground">
        {playlist.songs.length} canciones
      </p>
    </div>
  )
}
