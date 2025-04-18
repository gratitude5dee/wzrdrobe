export interface FluxPulidInput {
  prompt: string
  reference_image_url: string
  image_size?: string
  num_inference_steps?: number
  guidance_scale?: number
  negative_prompt?: string
  enable_safety_checker?: boolean
}

export interface GeneratedImage {
  url: string
  width: number
  height: number
  content_type: string
}

export interface FluxPulidResponse {
  images: GeneratedImage[]
  seed: number
  has_nsfw_concepts: boolean[]
  prompt: string
  timings?: {
    inference: number
  }
}
