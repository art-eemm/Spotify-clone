"use client"

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  Settings,
  User,
} from "lucide-react"
import { useNavigationStore, useAuthStore } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function Header() {
  const { searchQuery, setSearchQuery, setView, currentView } =
    useNavigationStore()
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (currentView !== "search") {
      setView("search")
    }
  }

  const handleSearchFocus = () => {
    if (currentView !== "search") {
      setView("search")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-linear-to-b from-secondary/50 to-transparent px-4 py-4 md:px-8">
      {/* Navigation Arrows */}
      <div className="hidden items-center gap-2 sm:flex">
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-foreground transition-colors hover:bg-background">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-foreground transition-colors hover:bg-background">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Search bar */}
      <div className="mx-2 max-w-md flex-1 sm:mx-4 md:mx-8">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Busca canciones, artistas..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            className="w-full rounded-full bg-card py-2 pr-4 pl-10 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none sm:py-2.5"
          />
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="relative hidden h-8 w-8 items-center justify-center rounded-full bg-background/70 text-muted-foreground transition-colors hover:bg-background hover:text-foreground md:flex">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:outline-none sm:h-9 sm:w-9">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-border bg-card"
          >
            <div className="px-3 py-2">
              <p className="truncate font-medium text-foreground">
                {user?.name}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={() => setView("settings")}
              className="cursor-pointer focus:bg-secondary"
            >
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setView("settings")}
              className="cursor-pointer focus:bg-secondary"
            >
              <User className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
