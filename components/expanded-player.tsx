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
      percent * (audioRef.current.duration || currentSong.duration)
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
      (audioRef.current.duration || currentSong.duration)
    audioRef.current.currentTime = newTime
    setProgress(newTime)
  }

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    setVolume(Math.max(0, Math.min(1, percent)))
  }

  const formatTime = (seconds: number) => {
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

  const duration = currentSong?.duration || 0
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0

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
          </div>
        </div>
      </div>
    </div>
  )
}
