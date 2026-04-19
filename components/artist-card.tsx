"use client"

import { Play } from "lucide-react"
import type { Artist } from "@/lib/store"

interface ArtistCardProps {
  artist: Artist
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <div className="group relative cursor-pointer rounded-lg bg-card p-4 transition-all duration-300 hover:bg-secondary/80">
      <div className="relative mb-4 aspect-square">
        <img
          src={artist.imagen}
          alt={artist.nombre}
          className="h-full w-full rounded-full object-cover shadow-lg"
        />
        <button className="absolute right-2 bottom-2 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-primary opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105">
          <Play className="ml-0.5 h-5 w-5 fill-current text-primary-foreground" />
        </button>
      </div>
      <h3 className="truncate text-center font-semibold text-foreground">
        {artist.nombre}
      </h3>
      <p className="mt-1 text-center text-sm text-muted-foreground">Artista</p>
    </div>
  )
}
