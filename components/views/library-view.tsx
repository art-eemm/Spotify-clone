"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { PlaylistCard } from "../playlist-card"
import { usePlaylistStore } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export function LibraryView() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const { playlists, createPlaylist } = usePlaylistStore()

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim())
      setNewPlaylistName("")
      setIsCreateDialogOpen(false)
    }
  }

  return (
    <>
      <div className="px-4 pb-8 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Biblioteca</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Playlist
          </Button>
        </div>

        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Crea tu primer playlist
            </h2>

            <p className="mb-6 max-w-md text-center text-muted-foreground">
              {"It's"} easy, {"we'll"} help you.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Crear Playlist
            </Button>
          </div>
        ) : (
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground">
              Playlists
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Playlist Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-c7 border-border">
          <DialogHeader>
            <DialogTitle>Crear Playlist</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nombre de la playlist"
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
