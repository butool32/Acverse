"use client"

import { useEffect, useRef } from "react"

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Confetti settings
    const confettiCount = 200
    const gravity = 0.5
    const terminalVelocity = 5
    const drag = 0.075
    const colors = [
      { front: "#00E4FF", back: "#00C4DF" }, // Blue
      { front: "#FB36FF", back: "#DB16DF" }, // Pink
      { front: "#04E762", back: "#04C742" }, // Green
      { front: "#FFDD00", back: "#DFBD00" }, // Yellow
      { front: "#FF4A4A", back: "#DF2A2A" }, // Red
    ]

    // Confetti class
    class ConfettiPiece {
      x: number
      y: number
      rotation: number
      color: { front: string; back: string }
      shape: string
      size: number
      velocity: { x: number; y: number }
      amplitude: number
      angle: number
      angularVelocity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * -canvas.height
        this.rotation = Math.random() * 360
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.shape = Math.random() > 0.5 ? "circle" : "rectangle"
        this.size = Math.random() * 10 + 5
        this.velocity = {
          x: Math.random() * 6 - 3,
          y: Math.random() * 3 + 2,
        }
        this.amplitude = Math.random() * 4 + 2
        this.angle = Math.random() * 360
        this.angularVelocity = Math.random() * 2 - 1
      }

      update() {
        this.velocity.y = Math.min(this.velocity.y + gravity, terminalVelocity)
        this.velocity.x = Math.sign(this.velocity.x) * Math.min(Math.abs(this.velocity.x), terminalVelocity)

        this.x += this.velocity.x
        this.y += this.velocity.y

        this.angle += this.angularVelocity

        // Apply drag
        if (Math.abs(this.velocity.x) > 0.1) {
          this.velocity.x -= this.velocity.x * drag
        }

        // Horizontal movement with sine wave
        this.x += Math.sin((this.angle * Math.PI) / 180) * this.amplitude

        // Rotation
        this.rotation += this.angularVelocity * 2
      }

      draw() {
        if (!ctx) return

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.rotation * Math.PI) / 180)

        // Determine if showing front or back of confetti
        const isFront = Math.sin((this.angle * Math.PI) / 180) >= 0
        ctx.fillStyle = isFront ? this.color.front : this.color.back

        if (this.shape === "rectangle") {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, this.size / 2, 0, 2 * Math.PI)
          ctx.fill()
        }

        ctx.restore()
      }
    }

    // Create confetti pieces
    const confettiPieces: ConfettiPiece[] = []
    for (let i = 0; i < confettiCount; i++) {
      confettiPieces.push(new ConfettiPiece())
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let stillActive = false
      confettiPieces.forEach((confetti) => {
        confetti.update()
        confetti.draw()

        // Check if confetti is still on screen
        if (confetti.y < canvas.height) {
          stillActive = true
        }
      })

      // Stop animation when all confetti is off screen
      if (stillActive) {
        animationId = requestAnimationFrame(animate)
      }
    }

    // Start animation
    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100%", height: "100%" }}
    />
  )
}
