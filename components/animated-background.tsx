"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor(x: number, y: number, size: number, speedX: number, speedY: number, color: string) {
        this.x = x
        this.y = y
        this.size = size
        this.speedX = speedX
        this.speedY = speedY
        this.color = color
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX *= -1
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY *= -1
        }
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100)

    const createParticles = () => {
      const isDark = theme === "dark"

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 5 + 1
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const speedX = (Math.random() - 0.5) * 0.5
        const speedY = (Math.random() - 0.5) * 0.5

        // Colors based on theme
        const color = isDark ? `rgba(255, 255, 255, ${Math.random() * 0.08})` : `rgba(0, 0, 0, ${Math.random() * 0.08})`

        particles.push(new Particle(x, y, size, speedX, speedY, color))
      }
    }

    createParticles()

    // Animation loop
    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)

      if (theme === "dark") {
        gradient.addColorStop(0, "rgba(10, 10, 10, 0.8)")
        gradient.addColorStop(1, "rgba(30, 30, 30, 0.8)")
      } else {
        gradient.addColorStop(0, "rgba(245, 245, 245, 0.8)")
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)")
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle =
              theme === "dark"
                ? `rgba(255, 255, 255, ${0.05 * (1 - distance / 100)})`
                : `rgba(0, 0, 0, ${0.05 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Update particles when theme changes
    const updateParticleColors = () => {
      const isDark = theme === "dark"
      particles.forEach((particle) => {
        particle.color = isDark
          ? `rgba(255, 255, 255, ${Math.random() * 0.08})`
          : `rgba(0, 0, 0, ${Math.random() * 0.08})`
      })
    }

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      updateParticleColors()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
      observer.disconnect()
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" aria-hidden="true" />
}
