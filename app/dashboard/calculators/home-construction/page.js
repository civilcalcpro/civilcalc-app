"use client";

import React, { useEffect, useMemo, useState, useRef, Suspense } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "@/lib/auth-context";
import { saveCalculationHistory } from "@/lib/calculation-history";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// 3D Visualization Imports
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

// Floor Plan Generation
import html2canvas from 'html2canvas';

// [Keep all your existing constants and helper functions]
const qualityOptions = {
  Economy: {
    rate: 1400,
    hindi: "इकॉनॉमी",
    desc: "Budget construction with basic finishing / कम बजट में बेसिक फिनिशिंग",
  },
  Standard: {
    rate: 1800,
    hindi: "स्टैंडर्ड",
    desc: "Good quality family home / अच्छी क्वालिटी का फैमिली घर",
  },
  Premium: {
    rate: 2400,
    hindi: "प्रीमियम",
    desc: "Premium materials and better finishing / प्रीमियम मटेरियल और फिनिशिंग",
  },
};

// ... [Keep all existing constants]

// NEW: Floor Plan Generator Class
class FloorPlanGenerator {
  constructor(config) {
    this.length = config.length || 30;
    this.width = config.width || 40;
    this.bedrooms = config.bedrooms || 2;
    this.bathrooms = config.bathrooms || 2;
    this.kitchens = config.kitchens || 1;
    this.halls = config.halls || 1;
    this.balconies = config.balconies || 0;
    this.floors = config.floors || 1;
  }

  generate() {
    const rooms = [];
    const totalArea = this.length * this.width;
    let usedArea = 0;

    // Intelligent room placement algorithm
    const allocations = this.calculateRoomAllocations(totalArea);

    let currentX = 0;
    let currentY = 0;
    let maxRowHeight = 0;

    // Hall (Living Room)
    for (let i = 0; i < this.halls; i++) {
      const room = {
        type: 'hall',
        name: `Hall ${i + 1}`,
        width: allocations.hall.width,
        height: allocations.hall.height,
        x: currentX,
        y: currentY,
        color: '#3b82f6',
      };
      rooms.push(room);
      currentX += room.width;
      maxRowHeight = Math.max(maxRowHeight, room.height);
      usedArea += room.width * room.height;
    }

    // Bedrooms
    for (let i = 0; i < this.bedrooms; i++) {
      if (currentX + allocations.bedroom.width > this.length) {
        currentX = 0;
        currentY += maxRowHeight;
        maxRowHeight = 0;
      }

      const room = {
        type: 'bedroom',
        name: `Bedroom ${i + 1}`,
        width: allocations.bedroom.width,
        height: allocations.bedroom.height,
        x: currentX,
        y: currentY,
        color: '#10b981',
      };
      rooms.push(room);
      currentX += room.width;
      maxRowHeight = Math.max(maxRowHeight, room.height);
      usedArea += room.width * room.height;
    }

    // Kitchen
    for (let i = 0; i < this.kitchens; i++) {
      if (currentX + allocations.kitchen.width > this.length) {
        currentX = 0;
        currentY += maxRowHeight;
        maxRowHeight = 0;
      }

      const room = {
        type: 'kitchen',
        name: `Kitchen ${i + 1}`,
        width: allocations.kitchen.width,
        height: allocations.kitchen.height,
        x: currentX,
        y: currentY,
        color: '#f59e0b',
      };
      rooms.push(room);
      currentX += room.width;
      maxRowHeight = Math.max(maxRowHeight, room.height);
      usedArea += room.width * room.height;
    }

    // Bathrooms
    for (let i = 0; i < this.bathrooms; i++) {
      if (currentX + allocations.bathroom.width > this.length) {
        currentX = 0;
        currentY += maxRowHeight;
        maxRowHeight = 0;
      }

      const room = {
        type: 'bathroom',
        name: `Bathroom ${i + 1}`,
        width: allocations.bathroom.width,
        height: allocations.bathroom.height,
        x: currentX,
        y: currentY,
        color: '#8b5cf6',
      };
      rooms.push(room);
      currentX += room.width;
      maxRowHeight = Math.max(maxRowHeight, room.height);
      usedArea += room.width * room.height;
    }

    // Balconies
    for (let i = 0; i < this.balconies; i++) {
      if (currentX + allocations.balcony.width > this.length) {
        currentX = 0;
        currentY += maxRowHeight;
        maxRowHeight = 0;
      }

      const room = {
        type: 'balcony',
        name: `Balcony ${i + 1}`,
        width: allocations.balcony.width,
        height: allocations.balcony.height,
        x: currentX,
        y: currentY,
        color: '#ec4899',
      };
      rooms.push(room);
      currentX += room.width;
      usedArea += room.width * room.height;
    }

    return {
      rooms,
      plotLength: this.length,
      plotWidth: this.width,
      totalArea,
      usedArea,
      efficiency: ((usedArea / totalArea) * 100).toFixed(1),
    };
  }

  calculateRoomAllocations(totalArea) {
    return {
      hall: { width: 15, height: 20 },
      bedroom: { width: 12, height: 12 },
      kitchen: { width: 10, height: 10 },
      bathroom: { width: 5, height: 8 },
      balcony: { width: 8, height: 5 },
    };
  }
}

// NEW: 3D Room Component
function Room3D({ room, floorHeight, isSelected, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        hovered || isSelected ? 1.05 : 1,
        0.1
      );
    }
  });

  return (
    <group>
      {/* Floor */}
      <Box
        ref={meshRef}
        args={[room.width, 0.2, room.height]}
        position={[room.x + room.width / 2, 0.1, room.y + room.height / 2]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered || isSelected ? '#ff7a00' : '#1a1a2e'} />
      </Box>

      {/* Walls */}
      {/* Front Wall */}
      <Box
        args={[room.width, floorHeight, 0.2]}
        position={[room.x + room.width / 2, floorHeight / 2, room.y]}
      >
        <meshStandardMaterial color={room.color} opacity={0.7} transparent />
      </Box>

      {/* Back Wall */}
      <Box
        args={[room.width, floorHeight, 0.2]}
        position={[room.x + room.width / 2, floorHeight / 2, room.y + room.height]}
      >
        <meshStandardMaterial color={room.color} opacity={0.7} transparent />
      </Box>

      {/* Left Wall */}
      <Box
        args={[0.2, floorHeight, room.height]}
        position={[room.x, floorHeight / 2, room.y + room.height / 2]}
      >
        <meshStandardMaterial color={room.color} opacity={0.7} transparent />
      </Box>

      {/* Right Wall */}
      <Box
        args={[0.2, floorHeight, room.height]}
        position={[room.x + room.width, floorHeight / 2, room.y + room.height / 2]}
      >
        <meshStandardMaterial color={room.color} opacity={0.7} transparent />
      </Box>

      {/* Room Label */}
      <Text
        position={[room.x + room.width / 2, floorHeight + 1, room.y + room.height / 2]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>
    </group>
  );
}

// NEW: 3D House Viewer Component
function HouseViewer3D({ floorPlan, buildingHeight, floors }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [cameraMode, setCameraMode] = useState('orbit'); // 'orbit' or 'walkthrough'
  
  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-white/10">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[50, 30, 50]} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        {/* Ground Plane */}
        <Plane
          args={[floorPlan.plotLength * 1.5, floorPlan.plotWidth * 1.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[floorPlan.plotLength / 2, -0.1, floorPlan.plotWidth / 2]}
          receiveShadow
        >
          <meshStandardMaterial color="#0a0a0a" />
        </Plane>

        {/* Plot Boundary */}
        <Box
          args={[floorPlan.plotLength, 0.1, floorPlan.plotWidth]}
          position={[floorPlan.plotLength / 2, 0, floorPlan.plotWidth / 2]}
        >
          <meshStandardMaterial color="#1a1a2e" wireframe />
        </Box>

        {/* Render Floors */}
        {Array.from({ length: floors }).map((_, floorIndex) => (
          <group key={floorIndex} position={[0, floorIndex * buildingHeight, 0]}>
            {floorPlan.rooms.map((room, idx) => (
              <Room3D
                key={`${floorIndex}-${idx}`}
                room={room}
                floorHeight={buildingHeight}
                isSelected={selectedRoom === `${floorIndex}-${idx}`}
                onClick={() => setSelectedRoom(`${floorIndex}-${idx}`)}
              />
            ))}
          </group>
        ))}

        {/* Grid Helper */}
        <gridHelper args={[100, 50, '#444444', '#222222']} />
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 bg-black/80 rounded-xl p-3 space-y-2">
        <button
          onClick={() => setCameraMode(cameraMode === 'orbit' ? 'walkthrough' : 'orbit')}
          className="w-full px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-xs font-bold"
        >
          {cameraMode === 'orbit' ? '👁️ Walk Mode' : '🔄 Orbit Mode'}
        </button>
        
        {selectedRoom && (
          <div className="text-xs text-white">
            <p className="font-bold">Selected:</p>
            <p>{floorPlan.rooms[parseInt(selectedRoom.split('-')[1])]?.name}</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/80 rounded-xl p-3 text-xs text-slate-300">
        <p>🖱️ Left Click + Drag: Rotate</p>
        <p>🖱️ Right Click + Drag: Pan</p>
        <p>🖱️ Scroll: Zoom</p>
        <p>🖱️ Click Room: Select</p>
      </div>
    </div>
  );
}

// NEW: 2D Floor Plan Component
function FloorPlan2D({ floorPlan, onRoomClick }) {
  const canvasRef = useRef(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [scale, setScale] = useState(10); // pixels per foot

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = (floorPlan.plotLength + 5) * scale;
    canvas.height = (floorPlan.plotWidth + 5) * scale;

    // Draw plot boundary
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      scale,
      scale,
      floorPlan.plotLength * scale,
      floorPlan.plotWidth * scale
    );

    // Draw rooms
    floorPlan.rooms.forEach((room, index) => {
      const x = (room.x + 1) * scale;
      const y = (room.y + 1) * scale;
      const w = room.width * scale;
      const h = room.height * scale;

      // Fill room
      ctx.fillStyle = selectedRoom === index ? '#ff7a00' : room.color;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(x, y, w, h);

      // Room border
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      // Room label
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${scale * 0.8}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(room.name, x + w / 2, y + h / 2);

      // Room dimensions
      ctx.font = `${scale * 0.6}px Arial`;
      ctx.fillText(`${room.width}' × ${room.height}'`, x + w / 2, y + h / 2 + scale);
    });

    // Add dimensions
    ctx.fillStyle = '#ff7a00';
    ctx.font = `bold ${scale * 0.7}px Arial`;
    ctx.fillText(
      `Plot: ${floorPlan.plotLength}' × ${floorPlan.plotWidth}'`,
      canvas.width / 2,
      scale * 0.5
    );

  }, [floorPlan, selectedRoom, scale]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale - 1;
    const y = (e.clientY - rect.top) / scale - 1;

    const clickedRoom = floorPlan.rooms.findIndex(room =>
      x >= room.x && x <= room.x + room.width &&
      y >= room.y && y <= room.y + room.height
    );

    setSelectedRoom(clickedRoom >= 0 ? clickedRoom : null);
    if (clickedRoom >= 0 && onRoomClick) {
      onRoomClick(floorPlan.rooms[clickedRoom]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-white">2D Floor Plan</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setScale(Math.max(5, scale - 2))}
            className="px-3 py-1 bg-white/10 rounded-lg text-sm"
          >
            −
          </button>
          <span className="px-3 py-1 bg-white/5 rounded-lg text-sm">
            {scale}x
          </span>
          <button
            onClick={() => setScale(Math.min(20, scale + 2))}
            className="px-3 py-1 bg-white/10 rounded-lg text-sm"
          >
            +
          </button>
        </div>
      </div>

      <div className="bg-black/40 rounded-2xl p-4 overflow-auto">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="cursor-pointer max-w-full"
        />
      </div>

      {selectedRoom !== null && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
          <h4 className="font-bold text-orange-400">Selected Room</h4>
          <div className="mt-2 space-y-1 text-sm">
            <p>Name: {floorPlan.rooms[selectedRoom].name}</p>
            <p>Type: {floorPlan.rooms[selectedRoom].type}</p>
            <p>Size: {floorPlan.rooms[selectedRoom].width}' × {floorPlan.rooms[selectedRoom].height}'</p>
            <p>Area: {(floorPlan.rooms[selectedRoom].width * floorPlan.rooms[selectedRoom].height).toFixed(1)} sq ft</p>
          </div>
        </div>
      )}
    </div>
  );
}

// NEW: Export Functions
const exportToDXF = (floorPlan) => {
  // Simple DXF export (basic implementation)
  let dxf = `0\nSECTION\n2\nENTITIES\n`;

  floorPlan.rooms.forEach(room => {
    // Add rectangle for each room
    dxf += `0\nLWPOLYLINE\n8\n${room.type}\n62\n1\n90\n5\n70\n1\n`;
    dxf += `10\n${room.x}\n20\n${room.y}\n`;
    dxf += `10\n${room.x + room.width}\n20\n${room.y}\n`;
    dxf += `10\n${room.x + room.width}\n20\n${room.y + room.height}\n`;
    dxf += `10\n${room.x}\n20\n${room.y + room.height}\n`;
    dxf += `10\n${room.x}\n20\n${room.y}\n`;
  });

  dxf += `0\nENDSEC\n0\nEOF`;

  const blob = new Blob([dxf], { type: 'application/dxf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'floor-plan.dxf';
  a.click();
  URL.revokeObjectURL(url);
};

const exportToOBJ = (floorPlan, buildingHeight) => {
  let obj = `# Floor Plan 3D Model\n`;
  let vertexIndex = 1;

  floorPlan.rooms.forEach(room => {
    obj += `# ${room.name}\n`;
    
    // Define 8 vertices for the room box
    const vertices = [
      [room.x, 0, room.y],
      [room.x + room.width, 0, room.y],
      [room.x + room.width, 0, room.y + room.height],
      [room.x, 0, room.y + room.height],
      [room.x, buildingHeight, room.y],
      [room.x + room.width, buildingHeight, room.y],
      [room.x + room.width, buildingHeight, room.y + room.height],
      [room.x, buildingHeight, room.y + room.height],
    ];

    vertices.forEach(v => {
      obj += `v ${v[0]} ${v[1]} ${v[2]}\n`;
    });

    // Define faces
    const faces = [
      [1, 2, 3, 4], // bottom
      [5, 6, 7, 8], // top
      [1, 2, 6, 5], // front
      [2, 3, 7, 6], // right
      [3, 4, 8, 7], // back
      [4, 1, 5, 8], // left
    ];

    faces.forEach(face => {
      obj += `f ${face.map(f => f + vertexIndex - 1).join(' ')}\n`;
    });

    vertexIndex += 8;
  });

  const blob = new Blob([obj], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'floor-plan-3d.obj';
  a.click();
  URL.revokeObjectURL(url);
};

// Main Component Modifications
export default function HomeConstructionCalculator() {
  const { authFetch } = useAuth();
  const [screen, setScreen] = useState("home");
  const [calculated, setCalculated] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [openBoq, setOpenBoq] = useState("Foundation");

  // NEW STATES
  const [show3DView, setShow3DView] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [floorPlan, setFloorPlan] = useState(null);
  const [buildingHeight, setBuildingHeight] = useState(10); // feet per floor

  const [form, setForm] = useState(createDefaultForm);
  const [rates, setRates] = useState(defaultRates);
  const [wastage, setWastage] = useState(defaultWastage);
  const [hiddenCosts, setHiddenCosts] = useState(hiddenDefaults);

  // [Keep all existing useEffect and functions]

  // NEW: Generate Floor Plan Function
  const generateFloorPlan = () => {
    const generator = new FloorPlanGenerator({
      length: numberValue(form.plotLength, 30),
      width: numberValue(form.plotWidth, 40),
      bedrooms: numberValue(form.bedrooms, 2),
      bathrooms: numberValue(form.bathrooms, 2),
      kitchens: numberValue(form.kitchens, 1),
      halls: numberValue(form.halls, 1),
      balconies: numberValue(form.balcony, 0),
      floors: getFloorCountFromValue(form.floors, form.customFloors),
    });

    const plan = generator.generate();
    setFloorPlan(plan);
    setShowFloorPlan(true);
    
    setTimeout(() => {
      document.getElementById('floor-plan-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  // NEW: Enhanced PDF with Floor Plan
  const downloadEnhancedPDF = async () => {
    if (!calculated) {
      alert("Please calculate estimate first");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    
    // [Keep existing PDF generation code]
    // ... existing PDF code ...

    // Add Floor Plan Page
    if (floorPlan) {
      doc.addPage();
      doc.setFillColor(5, 11, 31);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 24, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("Floor Plan", 14, 10);

      // Capture floor plan as image
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 14, 30, 180, 180);
      }

      // Add room details table
      autoTable(doc, {
        startY: 220,
        head: [['Room', 'Type', 'Size', 'Area']],
        body: floorPlan.rooms.map(room => [
          room.name,
          room.type,
          `${room.width}' × ${room.height}'`,
          `${(room.width * room.height).toFixed(0)} sq ft`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [255, 122, 0] },
      });
    }

    doc.save(`${form.projectName || 'home-estimate'}-with-floor-plan.pdf`);
  };

  // [Keep all existing result calculation logic]
  const result = useMemo(() => {
    // ... existing calculation code ...
  }, [form, rates, hiddenCosts, wastage]);

  // [Keep existing functions: calculate, saveProject, etc.]

  if (screen === "home") {
    return (
      <div className="min-h-screen bg-[#050B1F] text-white p-4 md:p-6">
        {/* ... existing home screen code ... */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B1F] text-white pb-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* ... existing header code ... */}

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-6">
            {/* ... existing input panels ... */}

            {/* NEW: Floor Plan Generation Panel */}
            <Panel title="🏗️ Floor Plan Generator / फ्लोर प्लान बनाएं">
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  Automatic floor plan generation based on your inputs.
                  Length, breadth aur rooms se automatic plan ban jayega.
                </p>

                <button
                  onClick={generateFloorPlan}
                  disabled={!form.plotLength || !form.plotWidth}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-2xl px-6 py-4 font-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🎨 Generate Floor Plan
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShow3DView(!show3DView)}
                    disabled={!floorPlan}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold disabled:opacity-50"
                  >
                    {show3DView ? '📐 2D View' : '🏠 3D View'}
                  </button>

                  <button
                    onClick={() => {
                      if (!floorPlan) return;
                      setShowFloorPlan(!showFloorPlan);
                    }}
                    disabled={!floorPlan}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold disabled:opacity-50"
                  >
                    {showFloorPlan ? '❌ Hide Plan' : '📋 Show Plan'}
                  </button>
                </div>

                {floorPlan && (
                  <div className="space-y-2 text-sm">
                    <div className="bg-white/5 rounded-xl p-3">
                      <Row label="Total Rooms" value={floorPlan.rooms.length} />
                      <Row label="Used Area" value={`${floorPlan.usedArea.toFixed(0)} sq ft`} />
                      <Row label="Efficiency" value={`${floorPlan.efficiency}%`} />
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            {/* NEW: Building Height Control */}
            {show3DView && (
              <Panel title="🏢 Building Settings / बिल्डिंग सेटिंग्स">
                <Input
                  label="Floor Height (feet) / फ्लोर की ऊंचाई"
                  value={buildingHeight}
                  onChange={(v) => setBuildingHeight(numberValue(v, 10))}
                />
                <p className="text-xs text-slate-400">
                  Standard residential floor height is 10 feet.
                  Normal घर में 10 feet floor height रहती है.
                </p>
              </Panel>
            )}
          </div>

          <div className="xl:col-span-2 space-y-6">
            {/* NEW: Floor Plan Display Section */}
            {floorPlan && showFloorPlan && (
              <div id="floor-plan-section">
                <Panel title="📐 Generated Floor Plan / बना हुआ फ्लोर प्लान">
                  <div className="space-y-4">
                    {!show3DView ? (
                      <FloorPlan2D
                        floorPlan={floorPlan}
                        onRoomClick={(room) => console.log('Room clicked:', room)}
                      />
                    ) : (
                      <Suspense fallback={
                        <div className="h-[600px] flex items-center justify-center bg-black/20 rounded-2xl">
                          <p className="text-white">Loading 3D View...</p>
                        </div>
                      }>
                        <HouseViewer3D
                          floorPlan={floorPlan}
                          buildingHeight={buildingHeight}
                          floors={getFloorCountFromValue(form.floors, form.customFloors)}
                        />
                      </Suspense>
                    )}

                    {/* Export Options */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        onClick={() => exportToDXF(floorPlan)}
                        className="actionBtn"
                      >
                        📄 Export DWG
                      </button>
                      <button
                        onClick={() => exportToOBJ(floorPlan, buildingHeight)}
                        className="actionBtn"
                      >
                        📦 Export 3D (OBJ)
                      </button>
                      <button
                        onClick={downloadEnhancedPDF}
                        className="actionBtn"
                      >
                        📑 PDF with Plan
                      </button>
                      <button
                        onClick={() => {
                          // Future: IFC export for Revit
                          alert('IFC export coming soon for Revit compatibility!');
                        }}
                        className="actionBtn"
                      >
                        🏗️ Export IFC (Revit)
                      </button>
                    </div>

                    {/* Room List */}
                    <div className="bg-white/5 rounded-2xl p-4">
                      <h3 className="font-bold text-orange-400 mb-3">Room Details / रूम विवरण</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {floorPlan.rooms.map((room, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-white/10 p-3"
                            style={{ borderLeftColor: room.color, borderLeftWidth: '4px' }}
                          >
                            <h4 className="font-bold text-white">{room.name}</h4>
                            <p className="text-sm text-slate-400 mt-1">
                              {room.width}' × {room.height}' ({(room.width * room.height).toFixed(0)} sq ft)
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>
            )}

            {/* ... existing results panels ... */}
            {calculated && (
              <div id="results-section" className="space-y-6">
                {/* ... existing result panels ... */}
              </div>
            )}

            {/* ... rest of existing code ... */}
          </div>
        </section>
      </div>

      {/* ... existing bottom navigation ... */}

      <StyleBlock />
    </div>
  );
}

// [Keep all existing helper components: Panel, Input, Select, Row, Mini, etc.]
