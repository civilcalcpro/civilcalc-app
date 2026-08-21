"use client";

import React, { useEffect, useRef } from "react";

export default function ThreeDViewer({ formData }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamic import (CSR only)
    import("three").then((THREE) => {
      if (!containerRef.current) return;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f5f5);

      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(20, 15, 20);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.shadowMap.enabled = true;
      containerRef.current.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 20, 10);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      // Ground
      const groundGeometry = new THREE.PlaneGeometry(50, 50);
      const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90ee90 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Building dimensions
      const buildingLength = Number(formData.plotLength) * 0.8 || 40;
      const buildingWidth = Number(formData.plotWidth) * 0.6 || 24;
      const buildingHeight = formData.floors === "G" ? 12 : formData.floors === "G+1" ? 20 : 28;

      // Main walls
      const wallGeometry = new THREE.BoxGeometry(buildingLength, buildingHeight, buildingWidth);
      const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xd4a574 });
      const building = new THREE.Mesh(wallGeometry, wallMaterial);
      building.position.y = buildingHeight / 2;
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);

      // Roof (simple cone)
      const roofGeometry = new THREE.ConeGeometry(
        Math.sqrt(buildingLength ** 2 + buildingWidth ** 2) / 2,
        3,
        4
      );
      const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = buildingHeight;
      roof.rotation.z = Math.PI / 4;
      roof.castShadow = true;
      scene.add(roof);

      // Windows
      const windowGeometry = new THREE.BoxGeometry(2, 2, 0.1);
      const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87ceeb });

      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 2; j++) {
          const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
          window1.position.set(
            -buildingLength / 2.5 + i * 3,
            3 + j * 4,
            buildingWidth / 2 + 0.05
          );
          window1.castShadow = true;
          scene.add(window1);

          const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
          window2.position.set(
            -buildingLength / 2.5 + i * 3,
            3 + j * 4,
            -buildingWidth / 2 - 0.05
          );
          window2.castShadow = true;
          scene.add(window2);
        }
      }

      // Door
      const doorGeometry = new THREE.BoxGeometry(2, 3, 0.1);
      const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
      const door = new THREE.Mesh(doorGeometry, doorMaterial);
      door.position.set(0, 1.5, buildingWidth / 2 + 0.05);
      door.castShadow = true;
      scene.add(door);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        building.rotation.y += 0.005;
        roof.rotation.y += 0.005;
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      };
    });
  }, [formData]);

  return (
    <div
      ref={containerRef}
      className="w-full h-96 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-700 to-slate-900"
    />
  );
}
