"use client"

import { useEffect, useMemo, useState } from "react"
import { SongCard } from "../song-card"
import { ArtistCard } from "../artist-card"
import { AlbumCard } from "../album-card"
import { useNavigationStore, Song } from "@/lib/store"
import { Search } from "lucide-react"

export function SearchView() {
  const searchQuery = useNavigationStore((state) => state.searchQuery)

  const [dbSongs, setDbSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("/api/songs")
        const data = await response.json()

        const formattedSongs: Song[] = data.map((song: any) => ({
          id: song.id,
          titulo: song.titulo,
          duracion: song.duracion,
          url_audio: song.url_audio,
          portada: song.portada,
          artista:
            song.cancion_artista?.[0]?.artistas?.nombre ||
            "Artista desconocido",
          album_id: song.albums?.titulo || undefined,
        }))

        setDbSongs(formattedSongs)
      } catch (error) {
        console.error("Error al cargar canciones de BD:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSongs()
  }, [])

  const filteredResults = useMemo(() => {
    if (showAll && !searchQuery.trim()) {
      return { songs: dbSongs, artists: [], albums: [] }
    }

    if (!searchQuery.trim()) {
      return { songs: [], artists: [], albums: [] }
    }

    const query = searchQuery.toLowerCase()

    return {
      songs: dbSongs.filter(
        (song) =>
          song.titulo.toLowerCase().includes(query) ||
          song.artista.toLowerCase().includes(query) ||
          (song.album_id && song.album_id.toLowerCase().includes(query))
      ),
    }
  }, [searchQuery, dbSongs, showAll])

  const hasResults = filteredResults.songs.length > 0

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Cargando canciones...</p>
      </div>
    )
  }

  if (!searchQuery.trim() && !showAll) {
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

          <button
            onClick={() => setShowAll(true)}
            className="mt-6 rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95"
          >
            Ver todas las canciones
          </button>
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
                className={`bg-linear-to-br ${genre.color} flex h-32 cursor-pointer items-end rounded-lg p-4 transition-transform hover:scale-105`}
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
          {showAll && (
            <button
              onClick={() => setShowAll(false)}
              className="mt-6 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Volver a explorar
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-8 md:px-8">
      {showAll && !searchQuery.trim() && (
        <div className="mb-6 flex items-center justify-between pt-6">
          <h2 className="text-2xl font-bold text-foreground">
            Todas las canciones
          </h2>
          <button
            onClick={() => setShowAll(false)}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Volver a explorar
          </button>
        </div>
      )}

      {/* Results */}
      {filteredResults.songs.length > 0 && (
        <section className="mt-4 mb-8">
          {searchQuery.trim() && (
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Resultados
            </h2>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredResults.songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}

      {/* Artists Results */}
      {/* {filteredResults.artists.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Artistas</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredResults.artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )} */}

      {/* Albums Results */}
      {/* {filteredResults.albums.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-foreground">Albums</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredResults.albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )} */}
    </div>
  )
}
