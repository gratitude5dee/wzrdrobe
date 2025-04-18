"use client"

import { useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: -9999, y: -9999 }) // Start off-screen
  const animationFrameId = useRef<number | null>(null)

  const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Only draw if mouse is reasonably positioned (prevents initial flash at 0,0)
    if (mousePos.current.x > -1000) {
      const gradient = ctx.createRadialGradient(
        mousePos.current.x,
        mousePos.current.y,
        0, // Inner circle (center, radius)
        mousePos.current.x,
        mousePos.current.y,
        300, // Outer circle (center, radius)
      )

      // Use theme purple color, fading out
      gradient.addColorStop(0, "rgba(104, 14, 142, 0.15)") // Inner color (more opaque)
      gradient.addColorStop(0.5, "rgba(104, 14, 142, 0.05)")
      gradient.addColorStop(1, "rgba(104, 14, 142, 0)") // Outer color (transparent)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasSize = () => {
      // Use devicePixelRatio for sharper rendering on high-DPI screens
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio) // Scale context to match CSS pixels
    }

    setCanvasSize() // Initial size setup

    const handleMouseMove = (event: MouseEvent) => {
      mousePos.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseLeave = () => {
      // Move effect off-screen smoothly when mouse leaves
      mousePos.current = { x: -9999, y: -9999 }
    }

    const renderLoop = () => {
      draw(ctx, canvas)
      animationFrameId.current = requestAnimationFrame(renderLoop)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", setCanvasSize)
    document.body.addEventListener("mouseleave", handleMouseLeave) // Handle mouse leaving the window

    renderLoop() // Start the animation loop

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", setCanvasSize)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [draw]) // Add draw to dependency array

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed inset-0 -z-10 pointer-events-none transition-opacity duration-300")} // Position behind content, ignore mouse events
      aria-hidden="true"
    />
  )
}
