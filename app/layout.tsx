import type React from "react"
import { MedievalSharp } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { MatrixIntro } from "@/components/MatrixIntro" // Import the intro
import { InteractiveBackground } from "@/components/InteractiveBackground" // Import the background
import { cn } from "@/lib/utils"

const medievalSharp = MedievalSharp({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(medievalSharp.className, "bg-[#0D0918]")}>
        {" "}
        {/* Set base background */}
        <MatrixIntro /> {/* Display the intro - it handles its own visibility */}
        <InteractiveBackground /> {/* Add the interactive background */}
        <main className="relative z-10">
          {" "}
          {/* Ensure content is above background */}
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.dev",
  title: "WZRDROBE Virtual Try-On", // Add a title
  description: "Experience virtual try-on powered by AI.", // Add a description
}
