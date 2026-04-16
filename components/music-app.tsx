"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { MobileNav } from "./movile-nav"
import { PlayerBar } from "./player-bar"
import { HomeView } from "./views/home-view"
import { SearchView } from "./views/search-view"
import { useAuthStore, useNavigationStore } from "@/lib/store"

export function MusicApp() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentView = useNavigationStore((state) => state.currentView)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [!isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView />
      case "search":
        return <SearchView />
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
