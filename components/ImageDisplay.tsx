"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Download, ZoomIn, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { use3DCard } from "@/hooks/use3DCard"

interface ImageDisplayProps {
  src: string
  alt: string
  className?: string
}

export function ImageDisplay({ src, alt, className }: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [error, setError] = useState(false)
  const { rotation, onMouseMove, onMouseLeave } = use3DCard(5)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(src)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = "kling-kolors-try-on.jpg"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <>
      <div
        className={cn(
          "group relative w-full overflow-hidden rounded-2xl bg-background/50 backdrop-blur-sm",
          "transition-all duration-500 ease-in-out perspective-1000",
          "hover:shadow-[0_8px_32px_rgba(104,14,142,0.3)]",
          className,
        )}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Loading Skeleton */}
        {isLoading && <div className="absolute inset-0 animate-pulse bg-muted/50" />}

        {/* Error State */}
        {error ? (
          <div className="flex h-full min-h-[200px] sm:min-h-[400px] flex-col items-center justify-center gap-4 p-4 sm:p-8">
            <div className="rounded-full bg-red-100 p-3">
              <X className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-center text-sm text-muted-foreground">Failed to load image. Please try again.</p>
          </div>
        ) : (
          <>
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={src || "/placeholder.svg"}
                alt={alt}
                fill
                className={cn(
                  "object-cover transition-all duration-700",
                  "group-hover:scale-105",
                  isLoading ? "opacity-0" : "opacity-100",
                )}
                onLoad={handleLoad}
                onError={handleError}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Action Buttons */}
              <div className="absolute right-2 sm:right-4 top-2 sm:top-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-purple-900/90 backdrop-blur-sm hover:bg-purple-800"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <ZoomIn className="h-4 w-4 text-purple-200" />
                  <span className="sr-only">View full size</span>
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-purple-900/90 backdrop-blur-sm hover:bg-purple-800"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 text-purple-200" />
                  <span className="sr-only">Download image</span>
                </Button>
              </div>
            </div>

            {/* Image Metadata */}
            <div className="space-y-1 p-4">
              <p className="text-sm font-medium text-purple-100">Virtual Try-On Result</p>
              <p className="text-xs text-purple-300/70">Click to view in full size</p>
            </div>
          </>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-screen-lg border-none bg-transparent p-0 shadow-none">
          <div className="relative aspect-auto max-h-[90vh] w-full overflow-hidden rounded-lg bg-background/80 backdrop-blur-xl">
            <Image src={src || "/placeholder.svg"} alt={alt} fill className="object-contain" sizes="100vw" />
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-2 sm:right-4 top-2 sm:top-4 h-8 w-8 rounded-full bg-purple-900/90 backdrop-blur-sm hover:bg-purple-800"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-4 w-4 text-purple-200" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
