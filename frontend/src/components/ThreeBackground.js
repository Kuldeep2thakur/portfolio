import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Create particle material with new theme colors
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xa855f7, // Purple
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create geometric shapes with new theme colors
    const createShape = (geometry, color, position) => {
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.1,
        wireframe: true
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      return mesh;
    };

    // Add various geometric shapes with new theme colors
    const shapes = [
      createShape(new THREE.TetrahedronGeometry(2), 0xed4bff, [5, 0, -5]), // Magenta
      createShape(new THREE.OctahedronGeometry(1.5), 0xf97316, [-5, 0, -5]), // Orange
      createShape(new THREE.IcosahedronGeometry(1), 0xa855f7, [0, 5, -5]), // Purple
      createShape(new THREE.TorusGeometry(1, 0.3, 8, 16), 0x667eea, [0, -5, -5]), // Indigo
    ];

    shapes.forEach(shape => scene.add(shape));

    // Position camera
    camera.position.z = 10;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate particles
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.002;

      // Rotate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 + index * 0.002;
        shape.rotation.y += 0.01 + index * 0.003;
      });

      // Mouse interaction
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ zIndex: 0 }}
    />
  );
};

export default ThreeBackground;
