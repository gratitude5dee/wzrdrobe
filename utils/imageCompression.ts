export async function compressImage(file: File, maxWidth = 1024, maxHeight = 1024, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      URL.revokeObjectURL(img.src)

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width
      let height = img.height

      const aspectRatio = width / height

      if (width > maxWidth) {
        width = maxWidth
        height = Math.round(width / aspectRatio)
      }

      if (height > maxHeight) {
        height = maxHeight
        width = Math.round(height * aspectRatio)
      }

      // Create canvas and context
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Draw and compress
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not compress image"))
            return
          }

          // If the blob is still too large, try again with more compression
          if (blob.size > 4 * 1024 * 1024) {
            console.log("Image still too large, compressing further:", blob.size)
            compressImage(file, maxWidth, maxHeight, quality * 0.8)
              .then(resolve)
              .catch(reject)
            return
          }

          console.log("Compressed image size:", blob.size)
          resolve(blob)
        },
        "image/jpeg",
        quality,
      )
    }

    img.onerror = (e) => {
      console.error("Image load error:", e)
      reject(new Error("Could not load image"))
    }

    // Create object URL from file
    const objectUrl = URL.createObjectURL(file)
    img.src = objectUrl

    // Set a timeout to reject the promise if the image takes too long to load
    const timeout = setTimeout(() => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("Image load timeout"))
    }, 30000)

    // Clear the timeout when the image loads or errors
    img.onload = () => {
      clearTimeout(timeout)
      img.onload = null

      URL.revokeObjectURL(objectUrl)

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width
      let height = img.height

      const aspectRatio = width / height

      if (width > maxWidth) {
        width = maxWidth
        height = Math.round(width / aspectRatio)
      }

      if (height > maxHeight) {
        height = maxHeight
        width = Math.round(height * aspectRatio)
      }

      // Create canvas and context
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Draw and compress
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not compress image"))
            return
          }

          // If the blob is still too large, try again with more compression
          if (blob.size > 4 * 1024 * 1024) {
            console.log("Image still too large, compressing further:", blob.size)
            compressImage(file, maxWidth, maxHeight, quality * 0.8)
              .then(resolve)
              .catch(reject)
            return
          }

          console.log("Compressed image size:", blob.size)
          resolve(blob)
        },
        "image/jpeg",
        quality,
      )
    }

    img.onerror = () => {
      clearTimeout(timeout)
      URL.revokeObjectURL(objectUrl)
      reject(new Error("Could not load image"))
    }
  })
}
