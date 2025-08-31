import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useState } from "react";

type Organ = {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  risk: number; // percent
};

const ORGANS: Organ[] = [
  { id: "brain", label: "Brain", position: [0, 1.6, 0.1], color: "hsl(var(--neon-violet))", risk: 8 },
  { id: "heart", label: "Heart", position: [0.1, 1.0, 0.2], color: "hsl(var(--neon-aqua))", risk: 12 },
  { id: "lungs", label: "Lungs", position: [-0.25, 1.1, 0.1], color: "#60A5FA", risk: 6 },
  { id: "liver", label: "Liver", position: [0.25, 0.8, 0.05], color: "hsl(var(--neon-green))", risk: 10 },
];

function HumanShell() {
  return (
    <group>
      {/* Torso */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 1.2, 20]} />
        <meshStandardMaterial color="#1F2937" transparent opacity={0.35} emissive="#0ea5b7" emissiveIntensity={0.15} roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#1F2937" transparent opacity={0.35} emissive="#7c3aed" emissiveIntensity={0.2} roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Hips */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.4, 20]} />
        <meshStandardMaterial color="#1F2937" transparent opacity={0.35} emissive="#10b981" emissiveIntensity={0.15} roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
}

export default function Avatar({ onOrganHover }: { onOrganHover?: (o: Organ | null) => void }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="rounded-2xl overflow-hidden glass">
      <Canvas camera={{ position: [0, 1.4, 3.2], fov: 45 }} className="h-[300px] sm:h-[360px] lg:h-[420px]">
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.0} />
        <HumanShell />
        {ORGANS.map((o) => (
          <mesh
            key={o.id}
            position={o.position}
            onPointerOver={(e) => {
              e.stopPropagation();
              setActive(o.id);
              onOrganHover?.(o);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setActive((prev) => (prev === o.id ? null : prev));
              onOrganHover?.(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setActive(o.id);
            }}
          >
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial
              color={o.color}
              emissive={o.color}
              emissiveIntensity={active === o.id ? 1.4 : 0.7}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
        <OrbitControls enablePan={false} minDistance={2.5} maxDistance={4.5} enableZoom={true} />
      </Canvas>
    </div>
  );
}
