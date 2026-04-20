"use client"

import { useState } from "react"
import {
  User,
  Settings,
  Volume2,
  Globe,
  Shield,
  ChevronRight,
  ArrowLeft,
} from "lucide-react"
import { useAuthStore, useNavigationStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type SettingsSection = "main" | "profile" | "playback" | "language" | "content"

export function SettingsView() {
  const { user, settings, updateProfile, updateSettings, logout } =
    useAuthStore()
  const { setView } = useNavigationStore()
  const [currentSection, setCurrentSection] = useState<SettingsSection>("main")
  const [profileName, setProfileName] = useState(user?.name || "")

  const handleSaveProfile = () => {
    updateProfile(profileName)
    setCurrentSection("main")
  }

  const renderMainMenu = () => (
    <div className="space-y-2">
      <SettingsMenuItem
        icon={User}
        label="Perfil"
        description="Edita la información de tu  perfil"
        onClick={() => setCurrentSection("profile")}
      />
      <SettingsMenuItem
        icon={Volume2}
        label="Reproducción"
        description="Calidad del audio, fade, y más"
        onClick={() => setCurrentSection("playback")}
      />
      <SettingsMenuItem
        icon={Globe}
        label="Idioma"
        description="Cambiar el idioma de la aplicación"
        onClick={() => setCurrentSection("language")}
      />
      <SettingsMenuItem
        icon={Shield}
        label="Preferencias de Contenido"
        description="Configuración de contenido explícito"
        onClick={() => setCurrentSection("content")}
      />
    </div>
  )

  const renderProfileSection = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentSection("main")}
        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Regresar</span>
      </button>

      <div className="flex flex-col items-center gap-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
          {profileName?.[0]?.toUpperCase() || "U"}
        </div>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nombre</label>
          <Input
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="border-border bg-secondary"
            placeholder="Tu nombre"
          />
        </div>

        <Button onClick={handleSaveProfile} className="w-full">
          Guardar Cambios
        </Button>
      </div>
    </div>
  )

  const renderPlaybackSection = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentSection("main")}
        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Regresar</span>
      </button>

      <h3 className="text-lg font-semibold text-foreground">
        Configuración de Reproducción
      </h3>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Calidad de Audio
          </label>
          <Select
            value={settings.audioQuality}
            onValueChange={(value: "low" | "normal" | "high") =>
              updateSettings({ audioQuality: value })
            }
          >
            <SelectTrigger className="border-border bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-card">
              <SelectItem value="low">Baja (96 kbps)</SelectItem>
              <SelectItem value="normal">Normal (160 kbps)</SelectItem>
              <SelectItem value="high">Alta (320 kbps)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            La calidad más alta utiliza más datos
          </p>
        </div>

        <SettingsToggle
          label="Crossfade"
          description="Transición suave entre canciones"
          checked={settings.crossfade}
          onCheckedChange={(checked) => updateSettings({ crossfade: checked })}
        />

        {settings.crossfade && (
          <div className="space-y-2 border-l-2 border-border pl-4">
            <label className="text-sm font-medium text-foreground">
              Duración: {settings.crossfadeDuration}s
            </label>
            <input
              type="range"
              min="1"
              max="12"
              value={settings.crossfadeDuration}
              onChange={(e) =>
                updateSettings({ crossfadeDuration: parseInt(e.target.value) })
              }
              className="w-full accent-primary"
            />
          </div>
        )}

        <SettingsToggle
          label="Normalizar Volumen"
          description="Establecer el mismo nivel de volumen para todas las canciones"
          checked={settings.normalizeVolume}
          onCheckedChange={(checked) =>
            updateSettings({ normalizeVolume: checked })
          }
        />

        <SettingsToggle
          label="Mostrar Letras"
          description="Mostrar letras cuando están disponibles"
          checked={settings.showLyrics}
          onCheckedChange={(checked) => updateSettings({ showLyrics: checked })}
        />
      </div>
    </div>
  )

  const renderLanguageSection = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentSection("main")}
        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Regresar</span>
      </button>

      <h3 className="text-lg font-semibold text-foreground">Idioma</h3>

      <div className="space-y-2">
        <Select
          value={settings.language}
          onValueChange={(value) => updateSettings({ language: value })}
        >
          <SelectTrigger className="border-border bg-secondary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-border bg-card">
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderContentSection = () => (
    <div className="space-y-6">
      <button
        onClick={() => setCurrentSection("main")}
        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Regresar</span>
      </button>

      <h3 className="text-lg font-semibold text-foreground">
        Preferencias de Contenido
      </h3>

      <SettingsToggle
        label="Permitir Contenido Explícito"
        description="Reproducir canciones con letras explícitas"
        checked={settings.explicitContent}
        onCheckedChange={(checked) =>
          updateSettings({ explicitContent: checked })
        }
      />
    </div>
  )

  const renderSection = () => {
    switch (currentSection) {
      case "profile":
        return renderProfileSection()
      case "playback":
        return renderPlaybackSection()
      case "language":
        return renderLanguageSection()
      case "content":
        return renderContentSection()
      default:
        return renderMainMenu()
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-8 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("home")}
            className="rounded-full bg-secondary p-2 transition-colors hover:bg-secondary/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Settings className="h-6 w-6" />
            Settings
          </h1>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        {renderSection()}
      </div>

      {currentSection === "main" && (
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={logout}
            className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Cerrar Sesión
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Soundwave v1.0.0
          </p>
        </div>
      )}
    </div>
  )
}

function SettingsMenuItem({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: React.ElementType
  label: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg p-4 text-left transition-colors hover:bg-secondary"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="truncate text-sm text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  )
}

function SettingsToggle({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
