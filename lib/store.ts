"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export interface Song {
  id: string
  name: string
  artist: string
  album: string
  cover: string
  audioUrl: string
  duration: number
}

export interface Artist {
  id: string
  name: string
  image: string
}

export interface Album {
  id: string
  name: string
  artist: string
  cover: string
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
    name: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 200,
  },
  {
    id: "2",
    name: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    cover:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 203,
  },
  {
    id: "3",
    name: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    album: "F*CK LOVE 3",
    cover:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 141,
  },
  {
    id: "4",
    name: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 238,
  },
  {
    id: "5",
    name: "Peaches",
    artist: "Justin Bieber",
    album: "Justice",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: 198,
  },
  {
    id: "6",
    name: "Montero",
    artist: "Lil Nas X",
    album: "Montero",
    cover:
      "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: 137,
  },
  {
    id: "7",
    name: "Industry Baby",
    artist: "Lil Nas X, Jack Harlow",
    album: "Montero",
    cover:
      "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: 212,
  },
  {
    id: "8",
    name: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    cover:
      "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: 178,
  },
  {
    id: "9",
    name: "drivers license",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    cover:
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    duration: 242,
  },
  {
    id: "10",
    name: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    cover:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    duration: 215,
  },
  {
    id: "11",
    name: "Kiss Me More",
    artist: "Doja Cat, SZA",
    album: "Planet Her",
    cover:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    duration: 208,
  },
  {
    id: "12",
    name: "positions",
    artist: "Ariana Grande",
    album: "Positions",
    cover:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    duration: 172,
  },
]

export const mockArtists: Artist[] = [
  {
    id: "1",
    name: "The Weeknd",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Dua Lipa",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Drake",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Billie Eilish",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Post Malone",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Ariana Grande",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop",
  },
  {
    id: "7",
    name: "Olivia Rodrigo",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop",
  },
  {
    id: "8",
    name: "Lil Nas X",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop",
  },
]

export const mockAlbums: Album[] = [
  {
    id: "1",
    name: "After Hours",
    artist: "The Weeknd",
    cover:
      "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Future Nostalgia",
    artist: "Dua Lipa",
    cover:
      "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=300&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Certified Lover Boy",
    artist: "Drake",
    cover:
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Happier Than Ever",
    artist: "Billie Eilish",
    cover:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Positions",
    artist: "Ariana Grande",
    cover:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop",
  },
  {
    id: "6",
    name: "SOUR",
    artist: "Olivia Rodrigo",
    cover:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
  },
  {
    id: "7",
    name: "Planet Her",
    artist: "Doja Cat",
    cover:
      "https://images.unsplash.com/photo-1484755560615-a4c64e778a6c?w=300&h=300&fit=crop",
  },
  {
    id: "8",
    name: "Montero",
    artist: "Lil Nas X",
    cover:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
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
