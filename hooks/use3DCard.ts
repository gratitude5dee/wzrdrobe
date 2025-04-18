"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface Mouse3D {
  rotateX: number
  rotateY: number
}

export function use3DCard(intensity = 15) {
  const [rotation, setRotation] = useState<Mouse3D>({ rotateX: 0, rotateY: 0 })

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const rotateY = ((mouseX - width / 2) / width) * intensity
      const rotateX = ((mouseY - height / 2) / height) * -intensity

      setRotation({ rotateX, rotateY })
    },
    [intensity],
  )

  const onMouseLeave = useCallback(() => {
    setRotation({ rotateX: 0, rotateY: 0 })
  }, [])

  return {
    rotation,
    onMouseMove,
    onMouseLeave,
  }
}
