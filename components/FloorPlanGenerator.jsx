"use client";

import React, { useEffect, useRef, useState } from "react";

export default function FloorPlanGenerator({ formData, result }) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    drawFloorPlan();
  }, [formData, scale]);

  const drawFloorPlan = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Grid background
    ctx.strokeStyle = "#e5e5e5";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Calculate plot dimensions
    const plotLength = Number(formData.plotLength) || 50;
    const plotWidth = Number(formData.plotWidth) || 30;
    const plotScale = Math.min((width - 100) / plotLength, (height - 100) / plotWidth);

    const startX = 50;
    const startY = 50;
    const scaledLength = plotLength * plotScale * scale;
    const scaledWidth = plotWidth * plotScale * scale;

    // Draw plot boundary
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, scaledLength, scaledWidth);

    // Draw setbacks (if available)
    const setbackFront = 20;
    const setbackRear = 15;
    const setbackLeft = 5;
    const setbackRight = 5;

    ctx.strokeStyle = "#ff7a00";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Front setback
    ctx.strokeRect(startX, startY + setbackFront * plotScale * scale, scaledLength, 0);
    // Rear setback
    ctx.strokeRect(startX, startY + scaledWidth - setbackRear * plotScale * scale, scaledLength, 0);
    // Left setback
    ctx.strokeRect(startX + setbackLeft * plotScale * scale, startY, 0, scaledWidth);
    // Right setback
    ctx.strokeRect(startX + scaledLength - setbackRight * plotScale * scale, startY, 0, scaledWidth);

    ctx.setLineDash([]);

    // Build usable area
    const buildableX = startX + setbackLeft * plotScale * scale;
    const buildableY = startY + setbackFront * plotScale * scale;
    const buildableLength = scaledLength - (setbackLeft + setbackRight) * plotScale * scale;
    const buildableWidth = scaledWidth - (setbackFront + setbackRear) * plotScale * scale;

    // Draw rooms
    drawRooms(ctx, buildableX, buildableY, buildableLength, buildableWidth, formData);

    // Draw dimensions
    ctx.fillStyle = "#666666";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${plotLength} ft`, startX + scaledLength / 2, startY - 10);
    ctx.textAlign = "right";
    ctx.fillText(`${plotWidth} ft`, startX - 10, startY + scaledWidth / 2);

    // Title
    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Ground Floor Plan", startX, height - 10);
  };

  const drawRooms = (ctx, startX, startY, totalLength, totalWidth, formData) => {
    const bedrooms = Number(formData.bedrooms) || 2;
    const bathrooms = Number(formData.bathrooms) || 1;
    const kitchens = Number(formData.kitchens) || 1;

    // Room dimensions (proportional)
    const roomWidth = totalWidth / 2;
    const roomHeight = totalLength / (bedrooms + 1);

    const rooms = [];

    // Add bedrooms
    for (let i = 0; i < bedrooms; i++) {
      rooms.push({
        name: `Bedroom ${i + 1}`,
        x: startX,
        y: startY + i * roomHeight,
        width: roomWidth * 0.45,
        height: roomHeight * 0.9,
        color: "#e3f2fd",
        textColor: "#1565c0",
      });
    }

    // Add kitchen
    rooms.push({
      name: "Kitchen",
      x: startX + roomWidth * 0.5,
      y: startY,
      width: roomWidth * 0.45,
      height: roomHeight * 0.9,
      color: "#fff3e0",
      textColor: "#e65100",
    });

    // Add bathrooms
    for (let i = 0; i < bathrooms; i++) {
      rooms.push({
        name: `Bathroom`,
        x: startX + roomWidth * 0.5,
        y: startY + (i + 1) * roomHeight * 0.4,
        width: roomWidth * 0.2,
        height: roomHeight * 0.35,
        color: "#e0f2f1",
        textColor: "#004d40",
      });
    }

    // Add living room
    rooms.push({
      name: "Living Room",
      x: startX,
      y: startY + bedrooms * roomHeight,
      width: totalLength * 0.9,
      height: roomHeight * 0.8,
      color: "#f3e5f5",
      textColor: "#6a1b9a",
    });

    // Draw all rooms
    rooms.forEach((room) => {
      // Room background
      ctx.fillStyle = room.color;
      ctx.fillRect(room.x, room.y, room.width, room.height);

      // Room border
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 2;
      ctx.strokeRect(room.x, room.y, room.width, room.height);

      // Room name
      ctx.fillStyle = room.textColor;
      ctx.font = "bold 11px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(room.name, room.x + room.width / 2, room.y + room.height / 2 - 5);

      // Room dimensions
      ctx.fillStyle = "#666666";
      ctx.font = "9px Arial";
      const roomLengthFt = (room.width / (totalLength * 0.9)) * 30;
      const roomWidthFt = (room.height / (totalLength * 0.9)) * 20;
      ctx.fillText(
        `${roomLengthFt.toFixed(0)}x${roomWidthFt.toFixed(0)} ft`,
        room.x + room.width / 2,
        room.y + room.height / 2 + 5
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <label className="text-sm text-slate-300">Scale:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-slate-400">{(scale * 100).toFixed(0)}%</span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 flex justify-center">
        <canvas
          ref={canvasRef}
          width={700}
          height={600}
          className="border border-white/20 rounded-lg"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "floor-plan.png";
            link.click();
          }}
          className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 font-bold transition"
        >
          Download PNG
        </button>
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            canvas.toBlob((blob) => {
              navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);
              alert("Floor plan copied to clipboard!");
            });
          }}
          className="flex-1 bg-green-500 hover:bg-green-600 rounded-lg px-4 py-2 font-bold transition"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
