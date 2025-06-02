"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ViewIcon as View3d } from "lucide-react"
import { cn } from "@/lib/utils"

interface ARViewerButtonProps {
  modelUrl: string
  modelName: string
  className?: string
}

export default function ARViewerButton({ modelUrl, modelName, className }: ARViewerButtonProps) {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if the device is iOS
    const checkIfIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      setIsIOS(/iphone|ipad|ipod/.test(userAgent))
    }

    checkIfIOS()
  }, [])

  if (!isIOS) {
    return null // Only show on iOS devices
  }

  return (
    <a
      href={modelUrl}
      rel="ar"
      // These attributes help with AR Quick Look
      data-usdzaware="true"
      data-ar-scale="auto"
      data-ar-tracking="auto"
      data-ar-placement="floor"
    >
      <Button
        variant="secondary"
        size="lg"
        className={cn("rounded-full bg-background/80 backdrop-blur-sm", className)}
        aria-label={`View ${modelName} in AR`}
      >
        <View3d className="h-5 w-5 mr-2" />
        View in AR
      </Button>
    </a>
  )
}
