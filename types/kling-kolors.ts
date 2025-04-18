export interface KlingKolorsInput {
  human_image_url: string
  garment_image_url: string
}

export interface KlingKolorsResponse {
  image: {
    url: string
    content_type: string
    file_name: string
    file_size: number
    width: number
    height: number
  }
}
