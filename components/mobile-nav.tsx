"use client"

import { Home, Search, Library } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigationStore, usePlayerStore } from "@/lib/store"

export function MobileNav() {
  const { currentView, setView } = useNavigationStore()
  const currentSong = usePlayerStore((state) => state.currentSong)

  const bottomPosition = currentSong ? "bottom-16" : "bottom-0"

  return (
    <nav
      className={cn(
        "fixed right-0 left-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg transition-all duration-200 md:hidden",
        bottomPosition
      )}
    >
      <div className="safe-area-bottom flex items-center justify-around py-2">
        <NavButton
          icon={Home}
          label="Inicio"
          active={currentView === "home"}
          onClick={() => setView("home")}
        />
        <NavButton
          icon={Search}
          label="Buscar"
          active={currentView === "search"}
          onClick={() => setView("search")}
        />
        <NavButton
          icon={Library}
          label="Biblioteca"
          active={currentView === "library" || currentView === "playlist"}
          onClick={() => setView("library")}
        />
      </div>
    </nav>
  )
}

function NavButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 px-6 py-2 transition-colors active:scale-95",
        active ? "text-foreground" : "text-muted-foreground"
      )}
    >
      <Icon className={cn("h-6 w-6", active && "text-primary")} />
      <span className={cn("text-[10px] font-medium", active && "text-primary")}>
        {label}
      </span>
    </button>
  )
}
