"use client"

import { useState } from "react"
import { Home, Search, Library, Plus, Heart, Music, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigationStore, usePlaylistStore, useAuthStore } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export function Sidebar() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const { currentView, setView, setCurrentPlaylistId } = useNavigationStore()
  const { playlists, createPlaylist } = usePlaylistStore()
  const user = useAuthStore((state) => state.user)

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim())
      setNewPlaylistName("")
      setIsCreateDialogOpen(false)
    }
  }

  return (
    <>
      <aside className="hidden h-full w-64 flex-col bg-sidebar text-sidebar-foreground md:flex">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-primary-foreground"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Soundwave</span>
          </div>
        </div>

        <nav className="px-3">
          <ul className="space-y-1">
            <NavItem
              icon={Home}
              label="Inicio"
              active={currentView === "home"}
              onClick={() => setView("home")}
            />
            <NavItem
              icon={Search}
              label="Buscar"
              active={currentView === "search"}
              onClick={() => setView("search")}
            />
            <NavItem
              icon={Library}
              label="Biblioteca"
              active={currentView === "library"}
              onClick={() => setView("library")}
            />
            {user?.role === "admin" && (
              <NavItem
                icon={Shield}
                label="Panel Admin"
                active={currentView === "admin"}
                onClick={() => setView("admin")}
              />
            )}
          </ul>
        </nav>

        {/* Playlist Section */}
        <div className="mt-6 flex-1 overflow-hidden px-3">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Playlists
            </span>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="rounded-full p-1 transition-colors hover:bg-sidebar-accent"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <ul className="max-h-[calc(100vh-320px)] space-y-1 overflow-y-auto">
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <button
                  onClick={() => setCurrentPlaylistId(playlist.id)}
                  className={cn(
                    "transform-colors flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  {playlist.id === "liked" ? (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Music className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="block truncate">{playlist.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {playlist.songs.length}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Playlist Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Crear una Playlist</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
              className="border-border bg-secondary"
            />
          </div>
          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreatePlaylist}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function NavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-4 rounded-md px-3 py-2 font-medium transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-foreground"
            : "text-muted-foreground hover:text-sidebar-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </button>
    </li>
  )
}
