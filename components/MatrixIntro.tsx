"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function MatrixIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    // Make the canvas fill the screen
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Characters used for the rain - Katakana are classic Matrix, but digits/ASCII are fine too
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ"
    const characterArray = characters.split("")

    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)

    // Initialize drops (y-position for each column)
    const drops: number[] = []
    for (let x = 0; x < columns; x++) {
      drops[x] = (Math.random() * canvas.height) / fontSize // Start at random heights
    }

    const draw = () => {
      // Semi-transparent black background for fading effect
      ctx.fillStyle = "rgba(13, 9, 24, 0.1)" // Use a background color close to the main theme
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#680E8E" // Matrix green-ish/Purple color matching theme
      ctx.font = `${fontSize}px monospace`

      // Loop over columns
      for (let i = 0; i < drops.length; i++) {
        // Get random character
        const text = characterArray[Math.floor(Math.random() * characterArray.length)]
        // x, y coordinates
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Send drop back to top randomly after it crosses the screen
        // or make it reset based on random probability
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Increment y coordinate
        drops[i]++
      }
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    // Fade out logic
    const fadeTimer = setTimeout(() => {
      setIsFading(true)
    }, 4000) // Start fading after 4 seconds

    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      // Optional: Store in sessionStorage to prevent re-show on refresh
      try {
        sessionStorage.setItem("introShown", "true")
      } catch (e) {
        console.warn("Could not set sessionStorage for intro")
      }
    }, 5000) // Hide completely after 5 seconds

    // Resize handler
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        // Recalculate columns and reset drops if needed (simplified here)
      }
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Prevent showing if already shown in this session
  useEffect(() => {
    try {
      if (sessionStorage.getItem("introShown") === "true") {
        setIsVisible(false)
      }
    } catch (e) {
      console.warn("Could not read sessionStorage for intro")
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] bg-[#0D0918] transition-opacity duration-1000 ease-out", // Match theme bg
        isFading ? "opacity-0" : "opacity-100",
      )}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1
          className={cn(
            "text-4xl sm:text-6xl md:text-8xl font-mono text-purple-300 opacity-0 animate-fadeInGlow",
            "tracking-widest whitespace-nowrap",
            "filter drop-shadow-[0_0_10px_rgba(150,50,200,0.7)]", // Purple glow
          )}
          style={{ animationDelay: "0.5s" }} // Delay text appearance slightly
        >
          npm install wzrd
        </h1>
      </div>
      {/* Add simple keyframes for the text */}
      <style jsx global>{`
        @keyframes fadeInGlow {
          0% {
            opacity: 0;
            text-shadow: 0 0 5px rgba(150, 50, 200, 0);
          }
          50% {
            opacity: 0.8;
            text-shadow: 0 0 15px rgba(150, 50, 200, 0.8);
          }
          100% {
            opacity: 1;
            text-shadow: 0 0 10px rgba(150, 50, 200, 0.7);
          }
        }
        .animate-fadeInGlow {
          animation: fadeInGlow 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}
