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
import { StatusBar, Style } from "@capacitor/status-bar"
import { App as CapacitorApp } from "@capacitor/app"

function MobileNavigationHandler() {
  const { currentView, setView } = useNavigationStore()

  useEffect(() => {
    let listener: any = null

    const setupListener = async () => {
      try {
        listener = await CapacitorApp.addListener("backButton", () => {
          const state = useNavigationStore.getState()
          if (state.viewHistory.length > 0) {
            state.goBack()
          } else {
            CapacitorApp.minimizeApp()
          }
        })
      } catch (error) {
        console.log("Capacitor no detectado (entorno web normal)")
      }
    }

    setupListener()

    return () => {
      if (listener) {
        listener.remove()
      }
    }
  }, [currentView, setView])

  return null
}

export function MusicApp() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentView = useNavigationStore((state) => state.currentView)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const setupStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark })
        await StatusBar.setOverlaysWebView({ overlay: true })
      } catch (error) {
        console.log("Capacitor Status Bar no detectado (entorno web)")
      }
    }

    const init = async () => {
      await setupStatusBar()
      setIsReady(true)
    }

    init()
  }, [])

  // Verificación de autenticación
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.push("/login")
    }
  }, [isReady, isAuthenticated, router])

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
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]">
      <MobileNavigationHandler />

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
