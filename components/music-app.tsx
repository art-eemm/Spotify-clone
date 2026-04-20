"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { MobileNav } from "./mobile-nav"
import { PlayerBar } from "./player-bar"
import { HomeView } from "./views/home-view"
import { PlaylistView } from "./views/playlist-view"
import { SettingsView } from "./views/settings-view"
import { LibraryView } from "./views/library-view"
import { SearchView } from "./views/search-view"
import { AdminView } from "./views/admin-view"
import { AlbumView } from "./views/album-view"
import { useAuthStore, useNavigationStore } from "@/lib/store"

export function MusicApp() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentView = useNavigationStore((state) => state.currentView)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.push("/login")
    }
  }, [!isAuthenticated, router])

  if (!isReady || !isAuthenticated) {
    return null
  }

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView />
      case "search":
        return <SearchView />
      case "library":
        return <LibraryView />
      case "playlist":
        return <PlaylistView />
      case "album":
        return <AlbumView />
      case "settings":
        return <SettingsView />
      case "admin":
        return <AdminView />
      default:
        return <HomeView />
    }
  }
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-36 md:pb-24">
        <Header />
        {renderView()}
      </main>

      <MobileNav />
      <PlayerBar />
    </div>
  )
}
