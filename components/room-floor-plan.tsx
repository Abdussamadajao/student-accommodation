"use client"

import { useEffect, useRef, useState } from "react"

interface RoomFloorPlanProps {
  roomType: string
  dimensions?: string
  expanded?: boolean
}

export function RoomFloorPlan({ roomType, dimensions, expanded = false }: RoomFloorPlanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 })

  // Parse dimensions if provided
  const parseDimensions = () => {
    if (!dimensions) return { width: 4, height: 5 }

    try {
      const match = dimensions.match(/(\d+(?:\.\d+)?)m\s*x\s*(\d+(?:\.\d+)?)m/)
      if (match) {
        return {
          width: Number.parseFloat(match[1]),
          height: Number.parseFloat(match[2]),
        }
      }
    } catch (e) {
      console.error("Error parsing dimensions:", e)
    }

    return { width: 4, height: 5 }
  }

  const { width: roomWidth, height: roomHeight } = parseDimensions()

  useEffect(() => {
    // Set canvas size based on container and expanded state
    if (expanded) {
      setCanvasSize({ width: 600, height: 600 })
    } else {
      setCanvasSize({ width: 300, height: 300 })
    }
  }, [expanded])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set scale to fit the room in the canvas with padding
    const padding = 40
    const scale = Math.min((canvas.width - padding * 2) / roomWidth, (canvas.height - padding * 2) / roomHeight)

    // Calculate room dimensions in pixels
    const roomWidthPx = roomWidth * scale
    const roomHeightPx = roomHeight * scale

    // Calculate room position (centered)
    const roomX = (canvas.width - roomWidthPx) / 2
    const roomY = (canvas.height - roomHeightPx) / 2

    // Draw room outline
    ctx.strokeStyle = "#006400"
    ctx.lineWidth = 2
    ctx.strokeRect(roomX, roomY, roomWidthPx, roomHeightPx)

    // Fill room with light color
    ctx.fillStyle = "rgba(0, 100, 0, 0.05)"
    ctx.fillRect(roomX, roomY, roomWidthPx, roomHeightPx)

    // Draw room dimensions
    ctx.fillStyle = "#333"
    ctx.font = expanded ? "14px Arial" : "12px Arial"
    ctx.textAlign = "center"

    // Width dimension
    ctx.fillText(`${roomWidth}m`, roomX + roomWidthPx / 2, roomY + roomHeightPx + 20)

    // Height dimension
    ctx.save()
    ctx.translate(roomX - 20, roomY + roomHeightPx / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(`${roomHeight}m`, 0, 0)
    ctx.restore()

    // Draw furniture based on room type
    if (roomType === "1-person") {
      // Single bed
      drawBed(ctx, roomX + roomWidthPx * 0.1, roomY + roomHeightPx * 0.1, roomWidthPx * 0.4, roomHeightPx * 0.25, scale)

      // Study desk
      drawDesk(
        ctx,
        roomX + roomWidthPx * 0.1,
        roomY + roomHeightPx * 0.5,
        roomWidthPx * 0.3,
        roomHeightPx * 0.15,
        scale,
      )

      // Chair
      drawChair(ctx, roomX + roomWidthPx * 0.2, roomY + roomHeightPx * 0.7, scale)

      // Wardrobe
      drawWardrobe(
        ctx,
        roomX + roomWidthPx * 0.7,
        roomY + roomHeightPx * 0.1,
        roomWidthPx * 0.2,
        roomHeightPx * 0.3,
        scale,
      )

      // Bathroom (if applicable)
      if (roomType === "1-person" && roomWidth >= 3.5) {
        drawBathroom(
          ctx,
          roomX + roomWidthPx * 0.6,
          roomY + roomHeightPx * 0.5,
          roomWidthPx * 0.3,
          roomHeightPx * 0.4,
          scale,
        )
      }
    } else if (roomType === "2-person") {
      // Two beds
      drawBed(ctx, roomX + roomWidthPx * 0.1, roomY + roomHeightPx * 0.1, roomWidthPx * 0.35, roomHeightPx * 0.2, scale)
      drawBed(ctx, roomX + roomWidthPx * 0.1, roomY + roomHeightPx * 0.4, roomWidthPx * 0.35, roomHeightPx * 0.2, scale)

      // Two desks
      drawDesk(
        ctx,
        roomX + roomWidthPx * 0.55,
        roomY + roomHeightPx * 0.1,
        roomWidthPx * 0.25,
        roomHeightPx * 0.15,
        scale,
      )
      drawDesk(
        ctx,
        roomX + roomWidthPx * 0.55,
        roomY + roomHeightPx * 0.4,
        roomWidthPx * 0.25,
        roomHeightPx * 0.15,
        scale,
      )

      // Two chairs
      drawChair(ctx, roomX + roomWidthPx * 0.65, roomY + roomHeightPx * 0.3, scale)
      drawChair(ctx, roomX + roomWidthPx * 0.65, roomY + roomHeightPx * 0.6, scale)

      // Wardrobes
      drawWardrobe(
        ctx,
        roomX + roomWidthPx * 0.1,
        roomY + roomHeightPx * 0.7,
        roomWidthPx * 0.2,
        roomHeightPx * 0.2,
        scale,
      )
      drawWardrobe(
        ctx,
        roomX + roomWidthPx * 0.4,
        roomY + roomHeightPx * 0.7,
        roomWidthPx * 0.2,
        roomHeightPx * 0.2,
        scale,
      )
    } else if (roomType === "4-person") {
      // Four beds (bunk beds)
      drawBunkBed(
        ctx,
        roomX + roomWidthPx * 0.1,
        roomY + roomHeightPx * 0.1,
        roomWidthPx * 0.35,
        roomHeightPx * 0.4,
        scale,
      )
      drawBunkBed(
        ctx,
        roomX + roomWidthPx * 0.55,
        roomY + roomHeightPx * 0.1,
        roomWidthPx * 0.35,
        roomHeightPx * 0.4,
        scale,
      )

      // Four desks
      drawDesk(
        ctx,
        roomX + roomWidthPx * 0.1,
        roomY + roomHeightPx * 0.6,
        roomWidthPx * 0.2,
        roomHeightPx * 0.15,
        scale,
      )
      drawDesk(
        ctx,
        roomX + roomWidthPx * 0.35,
        roomY + roomHeightPx * 0.6,
        roomWidthPx * 0.2,
        roomHeightPx * 0.15,
        scale,
      )
      drawDesk(
        ctx,
        roomX + roomWidthPx * 0.6,
        roomY + roomHeightPx * 0.6,
        roomWidthPx * 0.2,
        roomHeightPx * 0.15,
        scale,
      )

      // Four chairs
      drawChair(ctx, roomX + roomWidthPx * 0.15, roomY + roomHeightPx * 0.8, scale)
      drawChair(ctx, roomX + roomWidthPx * 0.4, roomY + roomHeightPx * 0.8, scale)
      drawChair(ctx, roomX + roomWidthPx * 0.65, roomY + roomHeightPx * 0.8, scale)

      // Wardrobes
      drawWardrobe(
        ctx,
        roomX + roomWidthPx * 0.85,
        roomY + roomHeightPx * 0.6,
        roomWidthPx * 0.1,
        roomHeightPx * 0.3,
        scale,
      )
    }

    // Draw door
    drawDoor(ctx, roomX, roomY + roomHeightPx * 0.7, roomWidthPx * 0.1, roomHeightPx * 0.2, scale)

    // Draw window
    drawWindow(ctx, roomX + roomWidthPx * 0.4, roomY, roomWidthPx * 0.3, roomHeightPx * 0.05, scale)

    // Add legend if expanded
    if (expanded) {
      drawLegend(ctx, canvas.width - 150, canvas.height - 150, scale)
    }

    // Add room number
    ctx.fillStyle = "#006400"
    ctx.font = expanded ? "bold 16px Arial" : "bold 14px Arial"
    ctx.fillText("Floor Plan", canvas.width / 2, 20)

    // Add scale
    const scaleBarLength = 1 * scale // 1 meter
    ctx.beginPath()
    ctx.moveTo(roomX, roomY + roomHeightPx + 40)
    ctx.lineTo(roomX + scaleBarLength, roomY + roomHeightPx + 40)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = "#333"
    ctx.font = expanded ? "12px Arial" : "10px Arial"
    ctx.fillText("1m", roomX + scaleBarLength / 2, roomY + roomHeightPx + 55)
  }, [roomType, roomWidth, roomHeight, canvasSize, expanded])

  // Helper functions to draw furniture
  function drawBed(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, scale: number) {
    ctx.fillStyle = "#B0C4DE"
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = "#4682B4"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, width, height)

    // Pillow
    ctx.fillStyle = "#F0F8FF"
    ctx.fillRect(x + width * 0.1, y + height * 0.1, width * 0.2, height * 0.4)

    // Label
    if (scale > 10) {
      ctx.fillStyle = "#333"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Bed", x + width / 2, y + height / 2)
    }
  }

  function drawBunkBed(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    scale: number,
  ) {
    // Bottom bunk
    drawBed(ctx, x, y + height * 0.5, width, height * 0.45, scale)

    // Top bunk
    drawBed(ctx, x, y, width, height * 0.45, scale)

    // Ladder
    ctx.strokeStyle = "#8B4513"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x + width * 0.9, y + height * 0.5)
    ctx.lineTo(x + width * 0.9, y)
    ctx.stroke()

    // Ladder rungs
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(x + width * 0.8, y + height * 0.5 - i * height * 0.15)
      ctx.lineTo(x + width * 0.9, y + height * 0.5 - i * height * 0.15)
      ctx.stroke()
    }

    // Label
    if (scale > 10) {
      ctx.fillStyle = "#333"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Bunk Bed", x + width / 2, y + height * 0.25)
    }
  }

  function drawDesk(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, scale: number) {
    ctx.fillStyle = "#D2B48C"
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = "#8B4513"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, width, height)

    // Label
    if (scale > 10) {
      ctx.fillStyle = "#333"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Desk", x + width / 2, y + height / 2)
    }
  }

  function drawChair(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
    const size = scale * 0.3
    ctx.fillStyle = "#A0522D"
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()

    // Label
    if (scale > 10) {
      ctx.fillStyle = "#FFF"
      ctx.font = "8px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Chair", x, y + 3)
    }
  }

  function drawWardrobe(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    scale: number,
  ) {
    ctx.fillStyle = "#8B4513"
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = "#5C3317"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, width, height)

    // Door line
    ctx.beginPath()
    ctx.moveTo(x + width / 2, y)
    ctx.lineTo(x + width / 2, y + height)
    ctx.stroke()

    // Handles
    ctx.fillStyle = "#FFD700"
    ctx.beginPath()
    ctx.arc(x + width * 0.25, y + height / 2, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x + width * 0.75, y + height / 2, 2, 0, Math.PI * 2)
    ctx.fill()

    // Label
    if (scale > 10) {
      ctx.fillStyle = "#FFF"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Wardrobe", x + width / 2, y + height / 2)
    }
  }

  function drawBathroom(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    scale: number,
  ) {
    // Bathroom area
    ctx.fillStyle = "#E0FFFF"
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = "#5F9EA0"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, width, height)

    // Toilet
    ctx.fillStyle = "#FFFFFF"
    ctx.beginPath()
    ctx.ellipse(x + width * 0.3, y + height * 0.3, width * 0.15, height * 0.1, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Shower
    ctx.fillStyle = "#D3D3D3"
    ctx.fillRect(x + width * 0.6, y + height * 0.1, width * 0.3, height * 0.3)
    ctx.strokeRect(x + width * 0.6, y + height * 0.1, width * 0.3, height * 0.3)

    // Sink
    ctx.fillStyle = "#FFFFFF"
    ctx.beginPath()
    ctx.ellipse(x + width * 0.3, y + height * 0.7, width * 0.15, height * 0.1, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Label
    if (scale > 10) {
      ctx.fillStyle = "#333"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Bathroom", x + width / 2, y + height / 2)
    }
  }

  function drawDoor(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, scale: number) {
    // Door frame
    ctx.strokeStyle = "#8B4513"
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, width, height)

    // Door swing arc
    ctx.beginPath()
    ctx.arc(x, y, width, Math.PI * 1.5, 0, false)
    ctx.strokeStyle = "#8B4513"
    ctx.lineWidth = 1
    ctx.stroke()

    // Label
    if (scale > 10) {
      ctx.fillStyle = "#333"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Door", x + width / 2, y + height / 2)
    }
  }

  function drawWindow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    scale: number,
  ) {
    ctx.fillStyle = "#ADD8E6"
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = "#4682B4"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, width, height)

    // Window panes
    ctx.beginPath()
    ctx.moveTo(x + width / 2, y)
    ctx.lineTo(x + width / 2, y + height)
    ctx.stroke()

    // Label
    if (scale > 10) {
      ctx.fillStyle = "#333"
      ctx.font = "8px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Window", x + width / 2, y + height / 2)
    }
  }

  function drawLegend(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
    const legendWidth = 120
    const legendHeight = 140
    const itemHeight = 20

    // Legend background
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fillRect(x, y, legendWidth, legendHeight)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, legendWidth, legendHeight)

    // Legend title
    ctx.fillStyle = "#333"
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "left"
    ctx.fillText("Legend", x + 10, y + 15)

    // Legend items
    const items = [
      { color: "#B0C4DE", label: "Bed" },
      { color: "#D2B48C", label: "Desk" },
      { color: "#A0522D", label: "Chair" },
      { color: "#8B4513", label: "Wardrobe" },
      { color: "#E0FFFF", label: "Bathroom" },
      { color: "#ADD8E6", label: "Window" },
    ]

    items.forEach((item, index) => {
      const itemY = y + 25 + index * itemHeight

      // Color box
      ctx.fillStyle = item.color
      ctx.fillRect(x + 10, itemY, 15, 15)
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 0.5
      ctx.strokeRect(x + 10, itemY, 15, 15)

      // Label
      ctx.fillStyle = "#333"
      ctx.font = "11px Arial"
      ctx.textAlign = "left"
      ctx.fillText(item.label, x + 35, itemY + 12)
    })
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="mx-auto border rounded-md"
      />
      {!expanded && (
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Click the expand button to see more details
        </div>
      )}
    </div>
  )
}
