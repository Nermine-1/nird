import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// Floating educational objects
function FloatingObject({ position, scale = 1, color = '#6366f1' }: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[1]) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} />
      </mesh>
    </Float>
  );
}

// Book object
function Book({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {/* Book spine */}
        <Box args={[0.8, 1.2, 0.2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#8b5cf6" />
        </Box>
        {/* Book pages */}
        <Box args={[0.7, 1.1, 0.05]} position={[0, 0, 0.1]}>
          <meshStandardMaterial color="#f8fafc" />
        </Box>
      </group>
    </Float>
  );
}

// Lightbulb (idea)
function Lightbulb({ position }: { position: [number, number, number] }) {
  const bulbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (bulbRef.current) {
      bulbRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.4;
      // Pulsing glow effect
      const material = bulbRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={bulbRef} position={position}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

// Gear (representing critical thinking)
function Gear({ position }: { position: [number, number, number] }) {
  const gearRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (gearRef.current) {
      gearRef.current.rotation.z = state.clock.elapsedTime;
      gearRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7) * 0.2;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={gearRef} position={position}>
        <torusGeometry args={[0.4, 0.1, 8, 16]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    </Float>
  );
}

// Question mark
function QuestionMark({ position }: { position: [number, number, number] }) {
  const textRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.3}>
      <Text
        ref={textRef}
        position={position}
        fontSize={0.8}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        ?
      </Text>
    </Float>
  );
}

// Main scene component
function Scene() {
  const objects = useMemo(() => [
    // Books
    { type: 'book' as const, position: [-8, 2, -5] as [number, number, number] },
    { type: 'book' as const, position: [6, -1, -8] as [number, number, number] },
    { type: 'book' as const, position: [-4, 4, -6] as [number, number, number] },

    // Lightbulbs (ideas)
    { type: 'lightbulb' as const, position: [5, 3, -4] as [number, number, number] },
    { type: 'lightbulb' as const, position: [-6, -2, -7] as [number, number, number] },

    // Gears (critical thinking)
    { type: 'gear' as const, position: [3, 1, -9] as [number, number, number] },
    { type: 'gear' as const, position: [-2, -3, -3] as [number, number, number] },

    // Question marks
    { type: 'question' as const, position: [7, -4, -6] as [number, number, number] },
    { type: 'question' as const, position: [-7, 0, -8] as [number, number, number] },

    // Floating spheres (knowledge particles)
    { type: 'sphere' as const, position: [2, 5, -7] as [number, number, number], color: '#6366f1' },
    { type: 'sphere' as const, position: [-3, -5, -4] as [number, number, number], color: '#8b5cf6' },
    { type: 'sphere' as const, position: [8, -2, -5] as [number, number, number], color: '#06b6d4' },
    { type: 'sphere' as const, position: [-9, 3, -6] as [number, number, number], color: '#10b981' },
  ], []);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />

      {/* Render objects */}
      {objects.map((obj, index) => {
        switch (obj.type) {
          case 'book':
            return <Book key={index} position={obj.position} />;
          case 'lightbulb':
            return <Lightbulb key={index} position={obj.position} />;
          case 'gear':
            return <Gear key={index} position={obj.position} />;
          case 'question':
            return <QuestionMark key={index} position={obj.position} />;
          case 'sphere':
            return (
              <FloatingObject
                key={index}
                position={obj.position}
                color={obj.color}
                scale={0.3}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}

// Main component
export function EducationalBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}