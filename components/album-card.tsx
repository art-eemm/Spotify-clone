"use client"

import { Play } from "lucide-react"
import type { Album } from "@/lib/store"
import { useNavigationStore } from "@/lib/store"

interface AlbumCardProps {
  album: Album
}

export function AlbumCard({ album }: AlbumCardProps) {
  const setCurrentAlbumId = useNavigationStore(
    (state) => state.setCurrentAlbumId
  )

  return (
    <div
      onClick={() => setCurrentAlbumId(album.id)}
      className="group relative cursor-pointer rounded-lg bg-card p-4 hover:bg-secondary/80"
    >
      <div className="relative mb-4 aspect-square">
        <img
          src={album.portada}
          alt={album.titulo}
          className="h-full w-full rounded-md object-cover shadow-lg"
        />
        {/* <button className="absolute right-2 bottom-2 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-primary opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105">
          <Play className="ml-0.5 h-5 w-5 fill-current text-primary-foreground" />
        </button> */}
      </div>
      <h3 className="truncate font-semibold text-foreground">{album.titulo}</h3>
      <p className="mt-1 truncate text-sm text-muted-foreground">
        {album.artista}
      </p>
    </div>
  )
}
