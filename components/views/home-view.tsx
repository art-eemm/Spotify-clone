"use client"

import { Play } from "lucide-react"
import { SongCard } from "../song-card"
import { mockArtists, mockSongs, usePlayerStore } from "@/lib/store"

export function HomeView() {
  const { playAllFromIndex } = usePlayerStore()

  const handlePlaySection = (startIndex: number) => {
    playAllFromIndex(mockSongs, startIndex)
  }

  return (
    <div className="px-4 pb-8 md:px-8">
      {/* Play grid */}
      <section className="mb-6 sm:mb-8">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {mockSongs.slice(0, 6).map((song, index) => (
            <button
              key={song.id}
              onClick={() => handlePlaySection(index)}
              className="group flex items-center gap-2 overflow-hidden rounded-md bg-secondary/50 transition-colors hover:bg-secondary active:scale-[0.98] sm:gap-3"
            >
              <img
                src={song.cover}
                alt={song.name}
                className="h-12 w-12 object-cover sm:h-14 sm:w-14"
              />
              <span className="flex-1 truncate pr-2 text-xs font-medium text-foreground sm:text-sm">
                {song.name}
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
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Esuchaste Recientemente
          </h2>
          <button className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground sm:text-sm">
            Ver todo
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {mockSongs.slice(0, 6).map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Top Artists */}
      <section className="mb-6 sm:mb-8">
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Artistas Destacados
          </h2>
          <button className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground sm:text-sm">
            Ver todo
          </button>
        </div>
        {/* <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {mockArtists.slice(0, 6).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div> */}
      </section>
    </div>
  )
}
