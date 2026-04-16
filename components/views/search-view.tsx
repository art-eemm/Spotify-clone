"use client"

import { useMemo } from "react"
import { SongCard } from "../song-card"
import { ArtistCard } from "../artist-card"
import { AlbumCard } from "../album-card"
import {
  useNavigationStore,
  mockSongs,
  mockArtists,
  mockAlbums,
} from "@/lib/store"
import { Search } from "lucide-react"

export function SearchView() {
  const searchQuery = useNavigationStore((state) => state.searchQuery)

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return { songs: [], artists: [], albums: [] }
    }

    const query = searchQuery.toLowerCase()

    return {
      songs: mockSongs.filter(
        (song) =>
          song.name.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.album.toLowerCase().includes(query)
      ),
      artists: mockArtists.filter((artist) =>
        artist.name.toLowerCase().includes(query)
      ),
      albums: mockAlbums.filter(
        (album) =>
          album.name.toLowerCase().includes(query) ||
          album.artist.toLowerCase().includes(query)
      ),
    }
  }, [searchQuery])

  const hasResults =
    filteredResults.songs.length > 0 ||
    filteredResults.artists.length > 0 ||
    filteredResults.albums.length > 0

  if (!searchQuery.trim()) {
    return (
      <div className="px-4 pb-8 md:px-8">
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted sm:h-16 sm:w-16">
            <Search className="h-7 w-7 text-muted-foreground sm:h-8 sm:w-8" />
          </div>
          <h2 className="mb-2 text-center text-xl font-bold text-foreground sm:text-2xl">
            Busca música
          </h2>
          <p className="max-w-md px-4 text-center text-sm text-muted-foreground sm:text-base">
            Encuntra tus canciones favoritas, artistas y albums
          </p>
        </div>

        {/* Browse */}
        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Buscar todo
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[
              { name: "Pop", color: "from-pink-500 to-rose-500" },
              { name: "Hip-Hop", color: "from-orange-500 to-amber-500" },
              { name: "Rock", color: "from-red-600 to-red-800" },
              { name: "Electronic", color: "from-cyan-500 to-blue-500" },
              { name: "R&B", color: "from-purple-500 to-violet-600" },
              { name: "Jazz", color: "from-amber-600 to-yellow-600" },
              { name: "Classical", color: "from-slate-500 to-slate-700" },
              { name: "Country", color: "from-yellow-600 to-orange-600" },
              { name: "Indie", color: "from-teal-500 to-emerald-500" },
              { name: "Latin", color: "from-green-500 to-lime-500" },
            ].map((genre) => (
              <div
                key={genre.name}
                className={`bg-gradient-to-br ${genre.color} flex h-32 cursor-pointer items-end rounded-lg p-4 transition-transform hover:scale-105`}
              >
                <span className="text-lg font-bold text-white">
                  {genre.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }

  if (!hasResults) {
    return (
      <div className="px-4 pb-8 md:px-8">
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            No se encontraron resultados para &quot;{searchQuery}&quot;
          </h2>
          <p className="max-w-md text-center text-muted-foreground">
            Por favor asegurate de haber escrito bien, o usa otra palabra clave.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-8 md:px-8">
      {/* Results */}
      {filteredResults.songs.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Canciones</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredResults.songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}

      {/* Artists Results */}
      {filteredResults.artists.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Artistas</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredResults.artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* Albums Results */}
      {filteredResults.albums.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Albums</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredResults.albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
