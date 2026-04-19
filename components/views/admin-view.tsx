"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Interfaces temporales para tipar los datos
interface ItemProps {
  id: string
  nombre: string
  titulo?: string
}

export function AdminView() {
  const token = useAuthStore((state) => state.token)

  // Estados para los datos del formulario principal
  const [titulo, setTitulo] = useState("")
  const [duracion, setDuracion] = useState("")
  const [generoId, setGeneroId] = useState("")
  const [artistaId, setArtistaId] = useState("")
  const [albumId, setAlbumId] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [portadaFile, setPortadaFile] = useState<File | null>(null)

  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Estados para las listas desplegables
  const [artistas, setArtistas] = useState<ItemProps[]>([])
  const [generos, setGeneros] = useState<ItemProps[]>([])
  const [albums, setAlbums] = useState<ItemProps[]>([])

  // Estados para los modales de creación
  const [isArtistDialogOpen, setIsArtistDialogOpen] = useState(false)
  const [isGenreDialogOpen, setIsGenreDialogOpen] = useState(false)
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false)
  const [newArtistName, setNewArtistName] = useState("")
  const [newGenreName, setNewGenreName] = useState("")
  const [newAlbumTitle, setNewAlbumTitle] = useState("")
  const [newAlbumCover, setNewAlbumCover] = useState<File | null>(null)
  const [newAlbumArtistId, setNewAlbumArtistId] = useState("")
  const [newAlbumDate, setNewAlbumDate] = useState("")

  // Cargar Artistas y Géneros al montar el componente
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [artistasRes, generosRes, albumsRes] = await Promise.all([
        fetch("/api/artists"),
        fetch("/api/genre"),
        fetch("/api/albums"),
      ])

      if (artistasRes.ok) {
        const data = await artistasRes.json()
        setArtistas(data.data || data) // Depende de cómo estructuraste la respuesta de tu API
      }
      if (generosRes.ok) {
        const data = await generosRes.json()
        setGeneros(data.data || data)
      }
      if (albumsRes.ok) {
        const data = await albumsRes.json()
        setAlbums(data.data || data) // <-- GUARDAMOS LOS ÁLBUMES
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
    }
  }

  // Manejar creación de nuevo Artista
  const handleCreateArtist = async () => {
    if (!newArtistName.trim()) return

    try {
      const res = await fetch("/api/artists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: newArtistName }),
      })
      if (res.ok) {
        setNewArtistName("")
        setIsArtistDialogOpen(false)
        await fetchData() // Recargar la lista para que aparezca el nuevo
      }
    } catch (e) {
      console.error("Error al crear artista", e)
    }
  }

  // Manejar creación de nuevo Género
  const handleCreateGenre = async () => {
    if (!newGenreName.trim()) return

    try {
      const res = await fetch("/api/genre", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: newGenreName }),
      })
      if (res.ok) {
        setNewGenreName("")
        setIsGenreDialogOpen(false)
        await fetchData() // Recargar la lista
      }
    } catch (e) {
      console.error("Error al crear género", e)
    }
  }

  const handleCreateAlbum = async () => {
    if (!newAlbumTitle.trim() || !newAlbumArtistId || !newAlbumCover) {
      alert(
        "Por favor, completa el título, selecciona un artista y sube una portada."
      )
      return
    }

    try {
      const formData = new FormData()
      formData.append("titulo", newAlbumTitle)
      formData.append("artista", newAlbumArtistId)
      formData.append("portada", newAlbumCover)
      formData.append("fecha_lanzamiento", newAlbumDate)

      const res = await fetch("/api/albums", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (newAlbumDate) {
        formData.append("fecha_lanzamiento", newAlbumDate)
      }

      if (res.ok) {
        setNewAlbumTitle("")
        setNewAlbumArtistId("")
        setNewAlbumCover(null)
        setNewAlbumDate("")
        setIsAlbumDialogOpen(false)
        await fetchData() // Refrescamos la lista para que aparezca el nuevo álbum
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Error al crear el álbum")
      }
    } catch (e) {
      console.error("Error al crear álbum", e)
    }
  }

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!audioFile) {
      setMessage("El archivo de audio es obligatorio.")
      return
    }

    setIsLoading(true)
    setMessage("Subiendo canción y procesando archivos...")

    try {
      const formData = new FormData()
      formData.append("titulo", titulo)
      formData.append("duracion", duracion)
      formData.append("genero", generoId)
      formData.append("artista", artistaId)
      formData.append("audio", audioFile)

      if (albumId) formData.append("album_id", albumId)
      if (portadaFile) formData.append("portada", portadaFile)

      const response = await fetch("/api/songs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // <-- AQUÍ ESTÁ EL CAMBIO IMPORTANTE
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("¡Canción agregada con éxito!")
        setTitulo("")
        setDuracion("")
        setGeneroId("")
        setArtistaId("")
        setAlbumId("")
        setAudioFile(null)
        setPortadaFile(null)
        ;(document.getElementById("audio") as HTMLInputElement).value = ""
        ;(document.getElementById("portada") as HTMLInputElement).value = ""
      } else {
        setMessage(data.error || "Error al agregar la canción.")
      }
    } catch (err) {
      setMessage("Error de conexión al subir la canción.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">
        Panel de Administración
      </h1>

      <div className="max-w-2xl rounded-xl bg-card p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Subir Nueva Canción</h2>

        <form onSubmit={handleAddSong}>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="titulo">Título de la canción *</FieldLabel>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Blinding Lights"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="duracion">
                  Duración (segundos) *
                </FieldLabel>
                <Input
                  id="duracion"
                  type="number"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  placeholder="Ej. 200"
                  required
                />
              </Field>

              {/* Selector de Artista */}
              <Field>
                <FieldLabel htmlFor="artistaId">Artista *</FieldLabel>
                <div className="flex items-center gap-2">
                  <select
                    id="artistaId"
                    value={artistaId}
                    onChange={(e) => setArtistaId(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <option value="">Selecciona un artista...</option>
                    {artistas?.map((artista) => (
                      <option key={artista.id} value={artista.id}>
                        {artista.nombre}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsArtistDialogOpen(true)}
                    title="Añadir nuevo artista"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </Field>

              {/* Selector de Género */}
              <Field>
                <FieldLabel htmlFor="generoId">Género *</FieldLabel>
                <div className="flex items-center gap-2">
                  <select
                    id="generoId"
                    value={generoId}
                    onChange={(e) => setGeneroId(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <option value="">Selecciona un género...</option>
                    {generos?.map((genero) => (
                      <option key={genero.id} value={genero.id}>
                        {genero.nombre}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsGenreDialogOpen(true)}
                    title="Añadir nuevo género"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </Field>
            </div>

            {/* --- Columna 2 --- */}
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="albumId">Álbum (Opcional)</FieldLabel>
                <div className="flex items-center gap-2">
                  <select
                    id="albumId"
                    value={albumId}
                    onChange={(e) => setAlbumId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <option value="">Sencillo (Sin álbum)</option>
                    {albums?.map((album) => (
                      <option key={album.id} value={album.id}>
                        {album.titulo}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsAlbumDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="audio">
                  Archivo de Audio (MP3, WAV) *
                </FieldLabel>
                <Input
                  id="audio"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  required
                  className="cursor-pointer"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="portada">
                  Portada de la Canción (Opcional)
                </FieldLabel>
                <Input
                  id="portada"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPortadaFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
              </Field>
            </div>
          </FieldGroup>

          <Button type="submit" className="mt-8 w-full" disabled={isLoading}>
            {isLoading ? "Subiendo..." : "Guardar Canción"}
          </Button>

          {message && (
            <p
              className={`mt-4 text-sm font-medium ${message.includes("éxito") ? "text-green-500" : "text-primary"}`}
            >
              {message}
            </p>
          )}
        </form>
      </div>

      {/* MODAL: Crear Artista */}
      <Dialog open={isArtistDialogOpen} onOpenChange={setIsArtistDialogOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Artista</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nombre del artista"
              value={newArtistName}
              onChange={(e) => setNewArtistName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateArtist()}
              className="border-border bg-secondary"
            />
          </div>
          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={() => setIsArtistDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateArtist}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Crear Álbum */}
      <Dialog open={isAlbumDialogOpen} onOpenChange={setIsAlbumDialogOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Álbum</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Título */}
            <Field>
              <FieldLabel htmlFor="newAlbumTitle">
                Título del álbum *
              </FieldLabel>
              <Input
                id="newAlbumTitle"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                className="border-border bg-secondary"
              />
            </Field>

            {/* Selección de Artista (Solo selección, como pediste) */}
            <Field>
              <FieldLabel htmlFor="newAlbumArtistId">
                Artista del Álbum *
              </FieldLabel>
              <select
                id="newAlbumArtistId"
                value={newAlbumArtistId}
                onChange={(e) => setNewAlbumArtistId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <option value="">Selecciona el artista...</option>
                {artistas?.map((artista) => (
                  <option key={artista.id} value={artista.id}>
                    {artista.nombre}
                  </option>
                ))}
              </select>
            </Field>

            {/* FECHA DE LANZAMIENTO (Nuevo campo) */}
            <Field>
              <FieldLabel htmlFor="newAlbumDate">
                Fecha de Lanzamiento
              </FieldLabel>
              <Input
                id="newAlbumDate"
                type="date"
                value={newAlbumDate}
                onChange={(e) => setNewAlbumDate(e.target.value)}
                className="border-border bg-secondary"
              />
            </Field>

            {/* Portada */}
            <Field>
              <FieldLabel htmlFor="newAlbumCover">
                Portada del álbum *
              </FieldLabel>
              <Input
                id="newAlbumCover"
                type="file"
                accept="image/*"
                onChange={(e) => setNewAlbumCover(e.target.files?.[0] || null)}
                className="cursor-pointer border-border bg-secondary"
              />
            </Field>
          </div>
          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={() => setIsAlbumDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateAlbum}>Guardar Álbum</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: Crear Género */}
      <Dialog open={isGenreDialogOpen} onOpenChange={setIsGenreDialogOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Género</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nombre del género"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateGenre()}
              className="border-border bg-secondary"
            />
          </div>
          <DialogFooter>
            <Button
              variant={"outline"}
              onClick={() => setIsGenreDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateGenre}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
