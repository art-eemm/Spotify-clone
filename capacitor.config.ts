import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.soundwave",
  appName: "Soundwave",
  webDir: "public",
  // bundledWebRuntime: false,
  server: {
    url: "https://spotify-clone-phi.vercel.app/login",
    cleartext: true,
  },
}

export default config
