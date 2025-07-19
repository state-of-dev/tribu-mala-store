"use client"

import { useState, useEffect } from "react"

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleClick = () => {
      setClicked(true)
      setTimeout(() => setClicked(false), 300)
    }

    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <div
      className={`custom-cursor ${clicked ? "cursor-click" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  )
}
