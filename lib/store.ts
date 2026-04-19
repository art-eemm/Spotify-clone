"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export interface Song {
  id: string
  titulo: string
  artista: string
  album_id?: string
  portada: string
  url_audio: string
  duracion: number
}

export interface Artist {
  id: string
  nombre: string
  imagen?: string
}

export interface Album {
  id: string
  titulo: string
  artista?: string
  portada: string
}

export interface Playlist {
  id: string
  name: string
  songs: Song[]
  createdAt: Date
}

interface User {
  id: string
  name: string
  email: string
  role?: string
  avatar?: string
}

interface UserSettings {
  audioQuality: "low" | "normal" | "high"
  crossfade: boolean
  crossfadeDuration: number
  normalizeVolume: boolean
  showLyrics: boolean
  language: string
  explicitContent: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  settings: UserSettings
  login: (
    email: string,
    password: string,
    name?: string,
    role?: string,
    token?: string
  ) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
  updateProfile: (name: string, avatar?: string) => void
  updateSettings: (settings: Partial<UserSettings>) => void
}

interface PlayerState {
  currentSong: Song | null
  isPlaying: boolean
  volume: number
  progress: number
  duration: number
  queue: Song[]
  shuffle: boolean
  repeat: "off" | "all" | "one"
  playSong: (song: Song) => void
  togglePlay: () => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
  setDuration: (duration: number) => void
  nextSong: () => void
  prevSong: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  addToQueue: (song: Song) => void
  setQueue: (songs: Song[]) => void
  playAllFromIndex: (songs: Song[], index: number) => void
  clearQueue: () => void
}

interface PlaylistState {
  playlists: Playlist[]
  createPlaylist: (name: string) => void
  deletePlaylist: (id: string) => void
  addSongToPlaylist: (playlistId: string, song: Song) => void
  removeSongFromPlaylist: (playlistId: string, songId: string) => void
}

interface NavigationState {
  currentView: "home" | "search" | "library" | "playlist" | "settings" | "admin"
  currentPlaylistId: string | null
  searchQuery: string
  setView: (
    view: "home" | "search" | "library" | "playlist" | "settings" | "admin"
  ) => void
  setCurrentPlaylistId: (id: string | null) => void
  setSearchQuery: (query: string) => void
}

// Mock Data
export const mockSongs: Song[] = [
  {
    id: "1",
    titulo: "Blinding Lights",
    artista: "The Weeknd",
    album_id: "1",
    portada:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    url_audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duracion: 200,
  },
]

const defaultSettings: UserSettings = {
  audioQuality: "high",
  crossfade: false,
  crossfadeDuration: 5,
  normalizeVolume: true,
  showLyrics: true,
  language: "en",
  explicitContent: true,
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      settings: defaultSettings,
      login: (
        email: string,
        _password: string,
        name?: string,
        role?: string,
        token?: string
      ) => {
        // Simulate login - in real app, validate against backend
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: name || email.split("@")[0],
          email,
          role: role || "user",
        }
        set({ user, token, isAuthenticated: true })
        return true
      },
      register: (name: string, email: string, _password: string) => {
        // Simulate registration
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
        }
        set({ user, isAuthenticated: true })
        return true
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateProfile: (name: string, avatar?: string) => {
        set((state) => ({
          user: state.user ? { ...state.user, name, avatar } : null,
        }))
      },
      updateSettings: (newSettings: Partial<UserSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },
    }),
    {
      name: "auth-storage",
    }
  )
)

// Player Store
export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  queue: [],
  shuffle: false,
  repeat: "off",
  playSong: (song: Song) => {
    const { queue } = get()
    if (!queue.find((s) => s.id === song.id)) {
      set({ queue: [...queue, song] })
    }
    set({ currentSong: song, isPlaying: true, progress: 0 })
  },
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume: number) => set({ volume }),
  setProgress: (progress: number) => set({ progress }),
  setDuration: (duration: number) => set({ duration }),
  nextSong: () => {
    const { currentSong, queue, shuffle, repeat } = get()
    if (!currentSong || queue.length === 0) return

    const currentIndex = queue.findIndex((s) => s.id === currentSong.id)

    if (shuffle) {
      // Pick a random song different from current if possible
      let randomIndex = Math.floor(Math.random() * queue.length)
      if (queue.length > 1) {
        while (randomIndex === currentIndex) {
          randomIndex = Math.floor(Math.random() * queue.length)
        }
      }
      set({ currentSong: queue[randomIndex], progress: 0, isPlaying: true })
    } else if (currentIndex < queue.length - 1) {
      set({
        currentSong: queue[currentIndex + 1],
        progress: 0,
        isPlaying: true,
      })
    } else if (repeat === "all") {
      set({ currentSong: queue[0], progress: 0, isPlaying: true })
    } else {
      // End of queue, stop playing
      set({ isPlaying: false })
    }
  },
  prevSong: () => {
    const { currentSong, queue, progress, shuffle } = get()
    if (!currentSong || queue.length === 0) return

    const currentIndex = queue.findIndex((s) => s.id === currentSong.id)

    // If more than 3 seconds in, restart current song
    if (progress > 3) {
      set({ progress: 0 })
      return
    }

    if (shuffle) {
      // In shuffle mode, pick a random previous song
      let randomIndex = Math.floor(Math.random() * queue.length)
      if (queue.length > 1) {
        while (randomIndex === currentIndex) {
          randomIndex = Math.floor(Math.random() * queue.length)
        }
      }
      set({ currentSong: queue[randomIndex], progress: 0, isPlaying: true })
    } else if (currentIndex > 0) {
      set({
        currentSong: queue[currentIndex - 1],
        progress: 0,
        isPlaying: true,
      })
    } else {
      // At start of queue, restart current song
      set({ progress: 0 })
    }
  },
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  toggleRepeat: () =>
    set((state) => ({
      repeat:
        state.repeat === "off" ? "all" : state.repeat === "all" ? "one" : "off",
    })),
  addToQueue: (song: Song) =>
    set((state) => ({
      queue: state.queue.find((s) => s.id === song.id)
        ? state.queue
        : [...state.queue, song],
    })),
  setQueue: (songs: Song[]) => set({ queue: songs }),
  playAllFromIndex: (songs: Song[], index: number) => {
    const song = songs[index]
    if (song) {
      set({ queue: songs, currentSong: song, isPlaying: true, progress: 0 })
    }
  },
  clearQueue: () =>
    set({ queue: [], currentSong: null, isPlaying: false, progress: 0 }),
}))

// Playlist Store
export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set) => ({
      playlists: [
        {
          id: "liked",
          name: "Liked Songs",
          songs: [],
          createdAt: new Date(),
        },
      ],
      createPlaylist: (name: string) => {
        const newPlaylist: Playlist = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          songs: [],
          createdAt: new Date(),
        }
        set((state) => ({ playlists: [...state.playlists, newPlaylist] }))
      },
      deletePlaylist: (id: string) => {
        if (id === "liked") return // Can't delete liked songs
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== id),
        }))
      },
      addSongToPlaylist: (playlistId: string, song: Song) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId && !p.songs.find((s) => s.id === song.id)
              ? { ...p, songs: [...p.songs, song] }
              : p
          ),
        }))
      },
      removeSongFromPlaylist: (playlistId: string, songId: string) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
              : p
          ),
        }))
      },
    }),
    {
      name: "playlist-storage",
    }
  )
)

// Navigation Store
export const useNavigationStore = create<NavigationState>((set) => ({
  currentView: "home",
  currentPlaylistId: null,
  searchQuery: "",
  setView: (view) => set({ currentView: view, currentPlaylistId: null }),
  setCurrentPlaylistId: (id) =>
    set({ currentPlaylistId: id, currentView: "playlist" }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
