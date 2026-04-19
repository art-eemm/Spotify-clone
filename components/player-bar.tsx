"use-client"

import { useRef, useEffect, useState } from "react"
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
  Maximize2,
  ListMusic,
  ChevronUp,
} from "lucide-react"
import { usePlayerStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ExpandedPlayer } from "./expanded-player"

export function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    shuffle,
    repeat,
    togglePlay,
    setVolume,
    setProgress,
    setDuration,
    nextSong,
    prevSong,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore()

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying && currentSong) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.currentTime = 0
      if (isPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }
  }, [currentSong?.id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      if (repeat === "one") {
        audio.currentTime = 0
        audio.play()
      } else {
        nextSong()
      }
    }

    audio.addEventListener("ended", handleEnded)
    return () => audio.removeEventListener("ended", handleEnded)
  }, [repeat, nextSong])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [setProgress, setDuration])

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentSong) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime =
      percent * (audioRef.current.duration || currentSong.duracion)
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

  const duration = currentSong?.duracion || 0
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0

  if (!currentSong) {
    return null
  }

  return (
    <>
      <audio ref={audioRef} src={currentSong?.url_audio} preload="metadata" />

      <ExpandedPlayer
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        audioRef={audioRef}
      />

      {/* Mini Player Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-between border-t border-border bg-card/95 px-2 backdrop-blur-lg sm:px-4 md:h-20">
        {/* Current song Info */}
        <button
          onClick={() => setIsExpanded(true)}
          className="group -m-1 flex w-[35%] min-w-0 items-center gap-2 rounded-md p-1 text-left transition-colors hover:bg-secondary/50 sm:w-[30%] sm:gap-3"
        >
          <div className="relative shrink-0">
            <img
              src={currentSong?.portada}
              alt={currentSong?.titulo}
              className="h-10 w-10 rounded object-cover sm:h-12 sm:w-12 md:h-14 md:w-14"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
              <ChevronUp className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="xs:block hidden min-w-0">
            <h4 className="truncate text-xs font-medium text-foreground sm:text-sm">
              {currentSong?.titulo}
            </h4>
            <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
              {currentSong?.artista}
            </p>
          </div>
        </button>

        {/* Player controls */}
        <div className="flex w-[30%] max-w-[720px] flex-col items-center gap-1 sm:w-[40%] md:gap-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleShuffle}
              className={cn(
                "hidden transition-colors sm:block",
                shuffle
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              onClick={prevSong}
              className="text-muted-foreground transition-colors hover:text-foreground active:scale-95"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground transition-transform hover:scale-105 active:scale-95 sm:h-9 sm:w-9"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current text-background" />
              ) : (
                <Play className="ml-0.5 h-4 w-4 fill-current text-background" />
              )}
            </button>
            <button
              onClick={nextSong}
              className="text-muted-foreground transition-colors hover:text-foreground active:scale-95"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
            <button
              onClick={toggleRepeat}
              className={cn(
                "hidden transition-colors sm:block",
                repeat !== "off"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {repeat === "one" ? (
                <Repeat1 className="h-4 w-4" />
              ) : (
                <Repeat className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Progress bar not on phone */}
          <div className="hidden w-full items-center gap-2 md:flex">
            <span className="w-10 text-right text-xs text-muted-foreground">
              {formatTime(progress)}
            </span>
            <div
              onClick={handleProgressClick}
              className="group h-1 flex-1 cursor-pointer rounded-full bg-muted"
            >
              <div
                className="relative h-full rounded-full bg-foreground transition-colors group-hover:bg-primary"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 rounded-full bg-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
            <span className="w-10 text-xs text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Extra controls */}
        <div className="flex w-[35%] items-center justify-end gap-2 sm:w-[30%] sm:gap-3">
          <button className="hidden text-muted-foreground transition-colors hover:text-foreground md:block">
            <ListMusic className="h-4 w-4" />
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            <button
              onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <div
              onClick={handleVolumeClick}
              className="group h-1 w-24 cursor-pointer rounded-full bg-muted"
            >
              <div
                className="relative h-full rounded-full bg-foreground transition-colors group-hover:bg-primary"
                style={{ width: `${volume * 100}%` }}
              >
                <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 rounded-full bg-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="p-1 text-muted-foreground transition-colors hover:text-foreground active:scale-95"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}
