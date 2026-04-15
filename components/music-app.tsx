"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { MobileNav } from "./movile-nav"
import { PlayerBar } from "./player-bar"

export function MusicApp() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-36 md:pb-24">
        <Header />
      </main>

      <MobileNav />
      <PlayerBar />
    </div>
  )
}
