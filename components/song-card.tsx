"use client"

import { Play, Pause, Plus, Check } from "lucide-react"
import { usePlayerStore, usePlaylistStore, type Song } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface SongCardProps {
  song: Song
}

export function SongCard({ song }: SongCardProps) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore()
  const { playlists, addSongToPlaylist } = usePlaylistStore()

  const isCurrentSong = currentSong?.id === song.id
  const isCurrentlyPlaying = isCurrentSong && isPlaying

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay()
    } else {
      playSong(song)
    }
  }

  return (
    <div className="group relative cursor-pointer rounded-lg bg-card p-3 transition-all duration-300 hover:bg-secondary/80 active:scale-[0.98] sm:p-4">
      <div className="relative mb-3 aspect-square sm:mb-4">
        <img
          src={song.cover}
          alt={song.name}
          className="h-full w-full rounded-md object-cover shadow-lg"
        />
        <button
          onClick={handlePlay}
          className={cn(
            "absolute right-2 bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 sm:h-12 sm:w-12",
            isCurrentlyPlaying
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          )}
        >
          {isCurrentlyPlaying ? (
            <Pause className="h-5 w-5 fill-current text-primary-foreground" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-current text-primary-foreground" />
          )}
        </button>

        {/* Add to playlist */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="h-4 w-4 text-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-border bg-card">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Agregar a playlist
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="border-border bg-card">
                {playlists.map((playlist) => {
                  const isInPlaylist = playlist.songs.some(
                    (s) => s.id === song.id
                  )
                  return (
                    <DropdownMenuItem
                      key={playlist.id}
                      onClick={() => addSongToPlaylist(playlist.id, song)}
                      className="flex items-center justify-between"
                    >
                      {playlist.name}
                      {isInPlaylist && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
        {song.name}
      </h3>
      <p className="mt-0.5 truncate text-xs text-muted-foreground sm:mt-1 sm:text-sm">
        {song.artist}
      </p>
    </div>
  )
}
