"use-client"

import { useRef, useEffect, useState } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Maximize2,
  ListMusic,
  ChevronUp,
} from "lucide-react"
import { usePlayerStore } from "@/lib/store"
import { cn } from "@/lib/utils"
