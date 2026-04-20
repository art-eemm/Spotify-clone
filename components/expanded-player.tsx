"use client"

import { useState } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ChevronDown,
  Heart,
  Share2,
  ListMusic,
  MoreHorizontal,
  Music,
} from "lucide-react"
import { usePlayerStore, usePlaylistStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface ExpandedPlayerProps {
  isOpen: boolean
  onClose: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
}

export function ExpandedPlayer({
  isOpen,
  onClose,
  audioRef,
}: ExpandedPlayerProps) {
  const [isLiked, setIsLiked] = useState(false)
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    shuffle,
    repeat,
    queue,
    togglePlay,
    setVolume,
    setProgress,
    nextSong,
    prevSong,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore()
  const { playlists, addSongToPlaylist } = usePlaylistStore()

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentSong) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime =
      percent * (audioRef.current.duration || currentSong.duracion || 0)
    audioRef.current.currentTime = newTime
    setProgress(newTime)
  }

  const handleProgressTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentSong) return
    const rect = e.currentTarget.getBoundingClientRect()
    const touch = e.touches[0]
    const percent = (touch.clientX - rect.left) / rect.width
    const newTime =
      Math.max(0, Math.min(1, percent)) *
      (audioRef.current.duration || currentSong.duracion || 0)
    audioRef.current.currentTime = newTime
    setProgress(newTime)
  }

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    setVolume(Math.max(0, Math.min(1, percent)))
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00" // <- BLINDAJE CONTRA NaN
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleLike = () => {
    if (currentSong) {
      if (!isLiked) {
        addSongToPlaylist("liked", currentSong)
      }
      setIsLiked(!isLiked)
    }
  }

  const displayDuration = duration > 0 ? duration : currentSong?.duracion || 0
  const progressPercent =
    displayDuration > 0 ? (progress / displayDuration) * 100 : 0

  const currentIndex = currentSong
    ? queue.findIndex((s) => s.id === currentSong.id) + 1
    : 0

  if (!currentSong) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 overflow-hidden bg-linear-to-b from-secondary to-background transition-transform duration-300 ease-out",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="safe-area-inset flex h-full flex-col">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <button
            onClick={onClose}
            className="-ml-2 p-2 text-muted-foreground transition-colors hover:text-foreground active:scale-95"
          >
            <ChevronDown className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>
          <div className="min-w-0 flex-1 px-2 text-center">
            <p className="text-[10px] tracking-wider text-muted-foreground uppercase sm:text-xs">
              Escuchando
            </p>
            {/* <p className="truncate text-xs font-medium text-foreground sm:text-sm">
              {currentSong.album}
            </p> */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="-mr-2 p-2 text-muted-foreground transition-colors hover:text-foreground active:scale-95">
                <MoreHorizontal className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-border bg-card"
            >
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Music className="mr-2 h-4 w-4" />
                  Agregar a playlist
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="border-border bg-card">
                  {playlists.map((playlist) => (
                    <DropdownMenuItem
                      key={playlist.id}
                      onClick={() =>
                        addSongToPlaylist(playlist.id, currentSong)
                      }
                      className="cursor-pointer"
                    >
                      {playlist.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem className="cursor-pointer">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 pb-4 sm:px-8 lg:px-16">
          {/* Art */}
          <div className="group relative mb-6 aspect-square w-full max-w-70 shrink-0 sm:mb-8 sm:max-w-sm md:max-w-md">
            <img
              src={currentSong.portada}
              alt={currentSong.titulo}
              className="h-full w-full rounded-lg object-cover shadow-2xl"
            />
            <div className="absolute inset-0 rounded-lg bg-background/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          {/* Info */}
          <div className="mb-4 w-full max-w-md shrink-0 sm:mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                  {currentSong.titulo}
                </h2>
                <p className="truncate text-base text-muted-foreground sm:text-lg">
                  {currentSong.artista}
                </p>
              </div>
              <button
                onClick={handleLike}
                className={cn(
                  "shrink-0 p-2 transition-colors active:scale-95",
                  isLiked
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Heart
                  className={cn(
                    "h-6 w-6 cursor-pointer sm:h-7 sm:w-7",
                    isLiked && "fill-current"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Prgoress Bar */}
          <div className="mb-4 w-full max-w-md shrink-0 sm:mb-6">
            <div
              onClick={handleProgressClick}
              onTouchMove={handleProgressTouch}
              className="group h-2 w-full cursor-pointer touch-none rounded-full bg-muted sm:h-1.5"
            >
              <div
                className="relative h-full rounded-full bg-foreground transition-colors group-hover:bg-primary"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 rounded-full bg-foreground opacity-100 shadow-lg transition-opacity group-hover:opacity-100 sm:opacity-0" />
              </div>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-xs text-muted-foreground">
                {formatTime(progress)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 flex shrink-0 items-center justify-center gap-6 sm:mb-8 sm:gap-8">
            <button
              onClick={toggleShuffle}
              className={cn(
                "cursor-pointer transition-colors active:scale-95",
                shuffle
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Shuffle className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={prevSong}
              className="text-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <SkipBack className="h-8 w-8 cursor-pointer fill-current sm:h-10 sm:w-10" />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 sm:h-16 sm:w-16"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-current text-background sm:h-7 sm:w-7" />
              ) : (
                <Play className="ml-1 h-6 w-6 fill-current text-background sm:h-7 sm:w-7" />
              )}
            </button>
            <button
              onClick={nextSong}
              className="text-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <SkipForward className="s-8 h-8 cursor-pointer fill-current sm:h-10 sm:w-10" />
            </button>
            <button
              onClick={toggleRepeat}
              className={cn(
                "cursor-pointer transition-colors active:scale-95",
                repeat !== "off"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {repeat === "one" ? (
                <Repeat1 className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Repeat className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>

          {/* Extra controls */}
          <div className="hidden w-full max-w-md shrink-0 items-center justify-between sm:flex">
            <div className="flex flex-1 items-center gap-3">
              <button
                onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <div
                onClick={handleVolumeClick}
                className="group h-1.5 w-24 cursor-pointer rounded-full bg-muted"
              >
                <div
                  className="relative h-full rounded-full bg-foreground transition-colors group-hover:bg-primary"
                  style={{ width: `${volume * 100}%` }}
                >
                  <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 rounded-full bg-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground">
                <ListMusic className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Queue */}
          {queue.length > 1 && (
            <p className="mt-4 shrink-0 text-xs text-muted-foreground sm:mt-6">
              {currentIndex} de {queue.length} en la cola
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
