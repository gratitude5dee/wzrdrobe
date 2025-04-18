"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Upload, Sparkles, AlertCircle, Shirt, Zap, Film } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { compressImage } from "@/utils/imageCompression"
import { cn } from "@/lib/utils"
import { use3DCard } from "@/hooks/use3DCard"
import { toast } from "@/components/ui/use-toast"

const SIZES = [
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "Extra Large" },
]

export function KlingKolorsGenerator() {
  const { rotation, onMouseMove, onMouseLeave } = use3DCard(10)
  const [tryOnItem, setTryOnItem] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("bad quality, worst quality, blurry, distorted")
  const [humanImage, setHumanImage] = useState<File | null>(null)
  const [humanImagePreview, setHumanImagePreview] = useState<string | null>(null)
  const [garmentImage, setGarmentImage] = useState<File | null>(null)
  const [garmentImagePreview, setGarmentImagePreview] = useState<string | null>(null)
  const [size, setSize] = useState("M")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [error, setError] = useState("")

  const processAndCompressImage = async (file: File) => {
    try {
      const compressedBlob = await compressImage(file, 1024, 1024, 0.8)
      const compressedFile = new File([compressedBlob], file.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      })

      const objectUrl = URL.createObjectURL(compressedBlob)
      return { compressedFile, objectUrl }
    } catch (err) {
      console.error("Error processing image:", err)
      throw new Error("Error processing image. Please try another image.")
    }
  }

  const onDropHuman = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      console.log("Dropped human image:", file.name, file.type, file.size)

      try {
        const { compressedFile, objectUrl } = await processAndCompressImage(file)
        setHumanImage(compressedFile)
        setHumanImagePreview(objectUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error processing image")
      }
    }
  }, [])

  const onDropGarment = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      console.log("Dropped garment image:", file.name, file.type, file.size)

      try {
        const { compressedFile, objectUrl } = await processAndCompressImage(file)
        setGarmentImage(compressedFile)
        setGarmentImagePreview(objectUrl)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error processing image")
      }
    }
  }, [])

  const {
    getRootProps: getHumanRootProps,
    getInputProps: getHumanInputProps,
    isDragActive: isHumanDragActive,
  } = useDropzone({
    onDrop: onDropHuman,
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  })

  const {
    getRootProps: getGarmentRootProps,
    getInputProps: getGarmentInputProps,
    isDragActive: isGarmentDragActive,
  } = useDropzone({
    onDrop: onDropGarment,
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  })

  const handleSubmit = async () => {
    if (!humanImage) {
      setError("Please upload a photo of yourself")
      return
    }

    if (!garmentImage) {
      setError("Please upload a garment image")
      return
    }

    setIsLoading(true)
    setError("")
    setGeneratedImage(null)
    setGeneratedVideo(null)

    try {
      const formData = new FormData()
      formData.append("referenceImage", humanImage)
      formData.append("garmentImage", garmentImage)
      formData.append("size", size)
      formData.append("negativePrompt", negativePrompt)

      console.log("Submitting form with:", {
        humanImage: humanImage.name,
        garmentImage: garmentImage.name,
        size,
        negativePrompt,
      })

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.image?.url) {
        throw new Error("No image URL in response")
      }

      setGeneratedImage(data.image.url)
    } catch (err) {
      console.error("Generation error:", err)
      let errorMessage = "An unexpected error occurred"
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === "object" && err !== null) {
        errorMessage = JSON.stringify(err)
      }
      setError(`Generation failed: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnhanceImage = () => {
    // This function would handle the enhancement logic
    console.log("Enhancing image with AI...")
    // Here you could call another API endpoint to enhance the image
    toast({
      title: "Enhancing image",
      description: "Your image is being enhanced with AI magic...",
    })
  }

  const handleAddMotion = async () => {
    if (!generatedImage) return

    setIsGeneratingVideo(true)
    setError("")

    try {
      toast({
        title: "Generating video",
        description: "Creating a lifelike animation with Luma Ray 2...",
      })

      // Call the API to generate a video using Luma Ray 2 Flash
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: generatedImage,
          prompt: "A fashion model showcasing clothing with subtle, natural movement in a professional studio setting",
          aspect_ratio: "9:16", // Portrait mode for fashion
          resolution: "720p",
          duration: "5s",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Video generation failed: ${response.status}`)
      }

      const data = await response.json()

      if (!data.videoUrl) {
        throw new Error("No video URL in response")
      }

      console.log("Video generated successfully:", data.videoUrl)
      setGeneratedVideo(data.videoUrl)

      toast({
        title: "Video created!",
        description: "Your fashion animation is ready to view",
        variant: "success",
      })

      // Open the video in a new tab or modal
      window.open(data.videoUrl, "_blank")
    } catch (error) {
      console.error("Error generating video:", error)
      setError(`Failed to generate video: ${error instanceof Error ? error.message : "Unknown error"}`)

      toast({
        title: "Video generation failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen perspective-1000">
      <Card
        className={cn(
          "purple-gradient-card max-w-4xl mx-auto transition-transform duration-200 perspective-1000",
          "hover:shadow-[0_0_50px_rgba(104,14,142,0.3)]",
        )}
        style={{
          transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <CardHeader className="space-y-1 pb-7">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Shirt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">WZRDROBE Virtual Try-On</CardTitle>
              <CardDescription>See how clothes look on you before you buy</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className={cn(
                "purple-gradient-card border-2 border-dashed",
                isHumanDragActive ? "border-primary/50 bg-primary/5" : "border-border",
              )}
            >
              <CardContent className="p-0">
                <div
                  {...getHumanRootProps()}
                  className="flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-all"
                >
                  <input {...getHumanInputProps()} />
                  {humanImagePreview ? (
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={humanImagePreview || "/placeholder.svg"}
                        alt="Your photo"
                        fill
                        className="object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 p-6 text-center">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Upload your photo</p>
                        <p className="text-sm text-muted-foreground">Full body photo works best</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Upload Clothing Item</Label>
                <Card
                  className={cn(
                    "purple-gradient-card border-2 border-dashed",
                    isGarmentDragActive ? "border-primary/50 bg-primary/5" : "border-border",
                  )}
                >
                  <CardContent className="p-0">
                    <div
                      {...getGarmentRootProps()}
                      className="flex flex-col items-center justify-center min-h-[200px] cursor-pointer transition-all"
                    >
                      <input {...getGarmentInputProps()} />
                      {garmentImagePreview ? (
                        <div className="relative w-full h-[200px]">
                          <Image
                            src={garmentImagePreview || "/placeholder.svg"}
                            alt="Garment"
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 p-4 text-center">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Shirt className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Upload garment image</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !humanImage || !garmentImage}
            className="glass-button w-full h-12"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-purple-300/20 border-t-purple-300 rounded-full animate-spin" />
                <span className="text-purple-100">Creating your virtual try-on...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-200" />
                <span className="text-purple-100">Try It On</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated image section - now below the upload UI */}
      {generatedImage && (
        <div className="mx-auto max-w-4xl mt-12 mb-8 perspective-1000">
          <h2 className="text-2xl font-bold text-center mb-6 text-purple-100">Your Virtual Try-On</h2>
          <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(104,14,142,0.2)]">
            <Image
              src={generatedImage || "/placeholder.svg"}
              alt="Virtual try-on result"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Action buttons that appear on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-8 right-8 flex flex-row items-center gap-6">
                {/* Enhance button */}
                <div className="flex flex-col items-center gap-3">
                  <Button
                    onClick={handleEnhanceImage}
                    size="icon"
                    className="h-16 w-16 rounded-full bg-primary/90 backdrop-blur-md shadow-[0_0_20px_rgba(104,14,142,0.6)] hover:bg-primary hover:scale-110 transition-all duration-300"
                  >
                    <Zap className="h-8 w-8 text-white" />
                    <span className="sr-only">Enhance Image</span>
                  </Button>
                  <span className="text-sm font-medium text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                    Enhance
                  </span>
                </div>

                {/* Add Motion button */}
                <div className="flex flex-col items-center gap-3">
                  <Button
                    onClick={handleAddMotion}
                    size="icon"
                    disabled={isGeneratingVideo}
                    className="h-16 w-16 rounded-full bg-purple-700/90 backdrop-blur-md shadow-[0_0_20px_rgba(104,14,142,0.6)] hover:bg-purple-600 hover:scale-110 transition-all duration-300"
                  >
                    {isGeneratingVideo ? (
                      <div className="h-8 w-8 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Film className="h-8 w-8 text-white" />
                    )}
                    <span className="sr-only">Add Motion</span>
                  </Button>
                  <span className="text-sm font-medium text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                    Add Motion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
