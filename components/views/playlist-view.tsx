"use client"

import {
  Play,
  Pause,
  Clock,
  Trash2,
  Heart,
  Music,
  ArrowLeft,
} from "lucide-react"
import {
  useNavigationStore,
  usePlaylistStore,
  usePlayerStore,
} from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PlaylistView() {
  const { currentPlaylistId, setView } = useNavigationStore()
  const { playlists, removeSongFromPlaylist, deletePlaylist } =
    usePlaylistStore()
  const { currentSong, isPlaying, togglePlay, playAllFromIndex } =
    usePlayerStore()

  const playlist = playlists.find((p) => p.id === currentPlaylistId)

  if (!playlist) {
    return (
      <div className="px-4 pb-8 md:px-8">
        <p className="text-muted-foreground">Playlist not found</p>
      </div>
    )
  }

  const handlePlayAll = () => {
    if (playlist.songs.length > 0) {
      playAllFromIndex(playlist.songs, 0)
    }
  }

  const handlePlaySong = (index: number) => {
    const song = playlist.songs[index]
    if (song) {
      if (currentSong?.id === song.id) {
        togglePlay()
      } else {
        playAllFromIndex(playlist.songs, index)
      }
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="px-4 pb-8 md:px-8">
      {/* Back Button */}
      <button
        onClick={() => setView("library")}
        className="mb-6 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Library
      </button>

      {/* Playlist Header */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="h-40 w-40 shrink-0 sm:h-48 sm:w-48">
          {playlist.songs.length > 0 ? (
            <div className="grid h-full w-full grid-cols-2 gap-0.5 overflow-hidden rounded-lg shadow-2xl">
              {playlist.songs.slice(0, 4).map((song) => (
                <img
                  key={song.id}
                  src={song.portada}
                  alt={song.titulo}
                  className="h-full w-full object-cover"
                />
              ))}
              {playlist.songs.length < 4 &&
                Array.from({ length: 4 - playlist.songs.length }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="flex h-full w-full items-center justify-center bg-muted"
                    >
                      <Music className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )
                )}
            </div>
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center rounded-lg shadow-2xl",
                playlist.id === "liked"
                  ? "bg-linear-to-br from-indigo-500 to-purple-600"
                  : "bg-muted"
              )}
            >
              {playlist.id === "liked" ? (
                <Heart className="h-20 w-20 text-white" />
              ) : (
                <Music className="h-20 w-20 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-medium text-foreground uppercase sm:text-sm">
            Playlist
          </p>
          <h1 className="mt-2 mb-2 text-2xl font-bold text-balance text-foreground sm:mb-4 sm:text-4xl md:text-6xl">
            {playlist.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {playlist.songs.length} songs
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8 flex items-center justify-center gap-4 sm:justify-start">
        <button
          onClick={handlePlayAll}
          disabled={playlist.songs.length === 0}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play className="ml-0.5 h-6 w-6 fill-current text-primary-foreground" />
        </button>
        {playlist.id !== "liked" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              deletePlaylist(playlist.id)
              setView("library")
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Playlist
          </Button>
        )}
      </div>

      {/* Songs List */}
      {playlist.songs.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-4 text-muted-foreground">
            This playlist is empty. Add some songs!
          </p>
          <Button onClick={() => setView("search")}>Find Songs</Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-card/50">
          {/* Table Header */}
          <div className="hidden grid-cols-[auto_1fr_1fr_auto_auto] gap-4 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground sm:grid">
            <span className="w-8 text-center">#</span>
            <span>Title</span>
            <span className="hidden md:block">Album</span>
            <span className="hidden sm:block">
              <Clock className="h-4 w-4" />
            </span>
            <span className="w-8" />
          </div>

          {/* Songs */}
          {playlist.songs.map((song, index) => {
            const isCurrentSong = currentSong?.id === song.id
            const isCurrentlyPlaying = isCurrentSong && isPlaying

            return (
              <div
                key={song.id}
                onClick={() => handlePlaySong(index)}
                className={cn(
                  "group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 transition-colors hover:bg-secondary/50 active:bg-secondary/70 sm:grid-cols-[auto_1fr_1fr_auto_auto] sm:gap-4 sm:px-4",
                  isCurrentSong && "bg-secondary/30"
                )}
              >
                <div className="w-8 text-center">
                  <span className="text-muted-foreground group-hover:hidden">
                    {isCurrentlyPlaying ? (
                      <div className="flex items-center justify-center gap-0.5">
                        <span className="h-3 w-1 animate-pulse bg-primary" />
                        <span
                          className="h-4 w-1 animate-pulse bg-primary"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="h-2 w-1 animate-pulse bg-primary"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <button
                    onClick={() => handlePlaySong(index)}
                    className="hidden items-center justify-center group-hover:flex"
                  >
                    {isCurrentlyPlaying ? (
                      <Pause className="h-4 w-4 text-foreground" />
                    ) : (
                      <Play className="h-4 w-4 fill-current text-foreground" />
                    )}
                  </button>
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={song.portada}
                    alt={song.titulo}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "truncate font-medium",
                        isCurrentSong ? "text-primary" : "text-foreground"
                      )}
                    >
                      {song.titulo}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {song.artista}
                    </p>
                  </div>
                </div>

                <span className="hidden truncate text-sm text-muted-foreground md:block">
                  {song.album_id}
                </span>

                <span className="hidden text-sm text-muted-foreground sm:block">
                  {formatDuration(song.duracion)}
                </span>

                <button
                  onClick={() => removeSongFromPlaylist(playlist.id, song.id)}
                  className="flex h-8 w-8 items-center justify-center text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
