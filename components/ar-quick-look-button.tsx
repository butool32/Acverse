"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { View } from "lucide-react"
import { cn } from "@/lib/utils"

interface ARQuickLookButtonProps {
  modelUrl?: string
  className?: string
  size?: "default" | "sm" | "lg"
  variant?: "default" | "secondary" | "outline"
  isInsideLink?: boolean
}

export default function ARQuickLookButton({
  modelUrl = "https://www.apple.com/105/media/us/ipad-pro/2020/79fd9e34-5115-4ea4-b8d6-41f4ef1cf3e2/anim/ar/ipad_pro_space_gray_usdz.usdz",
  className,
  size = "default",
  variant = "secondary",
  isInsideLink = false,
}: ARQuickLookButtonProps) {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if the device is iOS
    const checkIfIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      setIsIOS(/iphone|ipad|ipod/.test(userAgent))
    }

    checkIfIOS()
  }, [])

  // Button component that's shared between both rendering paths
  const ButtonComponent = (
    <Button
      variant={variant}
      size={size}
      className={cn("rounded-full", variant === "secondary" && "bg-background/80 backdrop-blur-sm", className)}
      onClick={(e) => {
        // If inside a link, prevent the parent link from being followed
        if (isInsideLink) {
          e.preventDefault()
          e.stopPropagation()
          // Open AR model in a new tab/window
          window.open(modelUrl, "_blank")
        }
      }}
    >
      <View className="h-4 w-4 mr-2" />
      View in AR
    </Button>
  )

  // If not on iOS, don't render anything
  if (!isIOS) {
    return null
  }

  // If inside a link, just return the button without wrapping it in an anchor
  if (isInsideLink) {
    return ButtonComponent
  }

  // Otherwise, wrap the button in an anchor with AR attributes
  return (
    <a
      href={modelUrl}
      rel="ar"
      className={cn("inline-block")}
      data-usdzaware="true"
      data-ar-scale="auto"
      data-ar-tracking="auto"
    >
      {ButtonComponent}
    </a>
  )
}
