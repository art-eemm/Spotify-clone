"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

function toast({ title, description, action }: ToastProps) {
  const id = sonnerToast(title ?? "", {
    description,
    action,
  })

  return {
    id,
    dismiss: () => sonnerToast.dismiss(id),
    update: (props: ToastProps) => {
      sonnerToast.dismiss(id)
      return toast(props)
    },
  }
}

function useToast() {
  return {
    toast,
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  }
}

export { useToast, toast }
