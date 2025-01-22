import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"

interface ProgressiveImageProps {
  src: string
  lowResSrc: string
  alt: string
  width: number
  height: number
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ src, lowResSrc, alt, width, height }) => {
  const [imgSrc, setImgSrc] = useState(lowResSrc)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImgSrc(src)
    }
  }, [src])

  return (
    <Image
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${imgSrc === lowResSrc ? "opacity-50 blur-sm" : "opacity-100"}`}
    />
  )
}

export default ProgressiveImage

