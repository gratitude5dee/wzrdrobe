"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Upload, Settings, Sparkles, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { compressImage } from "@/utils/imageCompression"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ImageDisplay } from "./ImageDisplay"
import { cn } from "@/lib/utils"
import { use3DCard } from "@/hooks/use3DCard"

const IMAGE_SIZES = [
  { value: "square_hd", label: "Square HD" },
  { value: "square", label: "Square" },
  { value: "portrait_4_3", label: "Portrait 4:3" },
  { value: "portrait_16_9", label: "Portrait 16:9" },
  { value: "landscape_4_3", label: "Landscape 4:3" },
  { value: "landscape_16_9", label: "Landscape 16:9" },
]

interface GeneratedImage {
  url: string
  width: number
  height: number
  content_type: string
}

export function FluxPulidGenerator() {
  const { rotation, onMouseMove, onMouseLeave } = use3DCard(10)
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState(
    "bad quality, worst quality, text, signature, watermark, extra limbs",
  )
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState("landscape_4_3")
  const [numInferenceSteps, setNumInferenceSteps] = useState(50)
  const [guidanceScale, setGuidanceScale] = useState(17.5)
  const [enableSafetyChecker, setEnableSafetyChecker] = useState(true)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false)

  const processAndCompressImage = async (file: File) => {
    try {
      const compressedBlob = await compressImage(file, 1024, 1024, 0.8)
      const compressedFile = new File([compressedBlob], file.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      })

      setReferenceImage(compressedFile)
      const objectUrl = URL.createObjectURL(compressedBlob)
      setReferenceImagePreview(objectUrl)

      return true
    } catch (err) {
      setError("Error processing image. Please try another image.")
      console.error("Error processing image:", err)
      return false
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      console.log("Dropped file:", file.name, file.type, file.size)

      try {
        const compressedBlob = await compressImage(file, 1024, 1024, 0.8)
        const compressedFile = new File([compressedBlob], file.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        })

        console.log("Compressed file:", compressedFile.name, compressedFile.type, compressedFile.size)

        setReferenceImage(compressedFile)
        const objectUrl = URL.createObjectURL(compressedBlob)
        setReferenceImagePreview(objectUrl)
      } catch (err) {
        console.error("Error processing image:", err)
        setError("Error processing image. Please try another image.")
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  })

  const handleSubmit = async () => {
    if (!referenceImage) {
      setError("Please upload a reference image")
      return
    }

    if (!prompt || prompt.trim() === "") {
      setError("Please enter a vision description")
      return
    }

    setIsLoading(true)
    setError("")
    setGeneratedImage(null)

    try {
      const formData = new FormData()
      formData.append("prompt", prompt)
      formData.append("referenceImage", referenceImage)
      formData.append("imageSize", imageSize)
      formData.append("numInferenceSteps", numInferenceSteps.toString())
      formData.append("guidanceScale", guidanceScale.toString())
      formData.append("negativePrompt", negativePrompt)
      formData.append("enableSafetyChecker", enableSafetyChecker.toString())

      console.log("Submitting form with:", {
        prompt,
        imageSize,
        numInferenceSteps,
        guidanceScale,
        negativePrompt,
        enableSafetyChecker,
        referenceImageName: referenceImage.name,
        referenceImageType: referenceImage.type,
        referenceImageSize: referenceImage.size,
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

      if (!data.images?.[0]?.url) {
        throw new Error("No image URL in response")
      }

      setGeneratedImage(data.images[0].url)
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

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen perspective-1000">
      {generatedImage && (
        <div className="mx-auto max-w-4xl mb-8">
          <ImageDisplay
            src={generatedImage || "/placeholder.svg"}
            alt="Generated vision based on your description"
            prompt={prompt}
          />
        </div>
      )}

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
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Your Vision Board</CardTitle>
              <CardDescription>Transform your ideas into stunning visuals</CardDescription>
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
                isDragActive ? "border-primary/50 bg-primary/5" : "border-border",
              )}
            >
              <CardContent className="p-0">
                <div
                  {...getRootProps()}
                  className="flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-all"
                >
                  <input {...getInputProps()} />
                  {referenceImagePreview ? (
                    <div className="relative w-full h-[300px]">
                      <Image
                        src={referenceImagePreview || "/placeholder.svg"}
                        alt="Reference"
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
                        <p className="font-medium mb-1">Drop your reference image here</p>
                        <p className="text-sm text-muted-foreground">Maximum file size: 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Vision Description</Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision in detail..."
                  className="glass-input min-h-[120px] resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Exclusions</Label>
                <Textarea
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="What you don't want to see..."
                  className="glass-input min-h-[120px] resize-none"
                />
              </div>
            </div>
          </div>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Generation Settings</span>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Output Size</Label>
                    <Select value={imageSize} onValueChange={setImageSize}>
                      <SelectTrigger className="glass-input">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {IMAGE_SIZES.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Inference Steps: {numInferenceSteps}</Label>
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      value={[numInferenceSteps]}
                      onValueChange={(value) => setNumInferenceSteps(value[0])}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Guidance Scale: {guidanceScale.toFixed(1)}</Label>
                    <Slider
                      min={1}
                      max={20}
                      step={0.1}
                      value={[guidanceScale]}
                      onValueChange={(value) => setGuidanceScale(value[0])}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={enableSafetyChecker} onCheckedChange={setEnableSafetyChecker} />
                    <Label>Enable Safety Checker</Label>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button onClick={handleSubmit} disabled={isLoading || !referenceImage} className="glass-button w-full h-12">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-purple-300/20 border-t-purple-300 rounded-full animate-spin" />
                <span className="text-purple-100">Dreaming your vision into reality...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-200" />
                <span className="text-purple-100">Create Your Future: Generate Vision</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
