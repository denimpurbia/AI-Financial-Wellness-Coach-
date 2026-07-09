import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import avatarImgSrc from '../../imports/image-2.png';

export interface RoboticAI3DFaceProps {
  state: 'idle' | 'thinking' | 'speaking' | 'listening';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  zoomToFit?: boolean;
}

export function RoboticAI3DFace({ state, size = 'md', zoomToFit = false }: RoboticAI3DFaceProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Sized to ensure the robot face remains perfectly centered and aligned without cutting off
  // buttons, sidebar, or other UI elements (now supporting larger sizes).
  const DIM = { sm: 48, md: 150, lg: 240, xl: 360, '2xl': 440 } as const;
  const dim = DIM[size] || 150;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // SCENE
    const scene = new THREE.Scene();
    // Dark indigo background
    scene.fog = new THREE.FogExp2(0x0a0a1a, 0.05);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    // When zoomToFit is true (e.g. hero section), zoom in to perfectly frame it
    if (zoomToFit) {
      camera.position.set(0, 0, 3.2); // Closer for perfect framing
    } else {
      camera.position.set(0, 0, 5.0);
    }

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(dim, dim);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const disposables: Array<{ dispose(): void }> = [];
    const D = <T extends { dispose(): void }>(obj: T): T => {
      disposables.push(obj);
      return obj;
    };

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00ffff, 4, 10);
    pointLightCyan.position.set(-2, 2, 2);
    scene.add(pointLightCyan);

    const pointLightViolet = new THREE.PointLight(0x8a2be2, 4, 10);
    pointLightViolet.position.set(2, -2, 2);
    scene.add(pointLightViolet);

    // CENTRAL AVATAR (The reference image)
    const textureLoader = new THREE.TextureLoader();
    let avatarMesh: THREE.Mesh | null = null;
    let avatarMaterial: THREE.MeshPhysicalMaterial | null = null;
    let baseGeometryPositions: Float32Array | null = null;

    textureLoader.load(avatarImgSrc, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const imgAspect = texture.image.width / texture.image.height;
      // Calculate plane dimensions to perfectly frame the face within the circular mask
      // and ensure it never clips the camera frustum or CSS borders during hover/rotation
      let planeHeight = 3.4; 
      let planeWidth = planeHeight * imgAspect;
      
      // If the image is very wide, constrain by width instead
      if (planeWidth > 3.4) {
        planeWidth = 3.4;
        planeHeight = planeWidth / imgAspect;
      }
      
      const geometry = D(new THREE.PlaneGeometry(planeWidth, planeHeight, 64, 64));
      
      avatarMaterial = D(
        new THREE.MeshPhysicalMaterial({
          map: texture,
          bumpMap: texture,
          bumpScale: 0.08, // Enhanced for deeper cinematic 3D relief
          transparent: true,
          opacity: 0.98,
          roughness: 0.15, // Decreased for sharper, more realistic reflections
          metalness: 0.95, // Increased for a premium metallic Jarvis look
          emissive: 0x00ffff,
          emissiveMap: texture,
          emissiveIntensity: 0.15, // Subtle, natural glow
          side: THREE.DoubleSide,
        })
      );

      avatarMesh = new THREE.Mesh(geometry, avatarMaterial);
      avatarMesh.position.set(0, 0, 0);
      scene.add(avatarMesh);
      
      // Add subtle curve to the plane for 3D depth
      const positions = geometry.attributes.position;
      baseGeometryPositions = new Float32Array(positions.count * 3);
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        // Bend the edges backward slightly for spherical feeling
        const z = -Math.pow(x * 0.25, 2) - Math.pow(y * 0.25, 2);
        positions.setZ(i, z);
        
        baseGeometryPositions[i * 3] = x;
        baseGeometryPositions[i * 3 + 1] = y;
        baseGeometryPositions[i * 3 + 2] = z;
      }
      geometry.computeVertexNormals();
    });

    // BACKGROUND: Abstract digital lines & pulsing neon nodes
    const particles = new THREE.Group();
    scene.add(particles);

    const nodesCount = 200;
    const nodesGeo = D(new THREE.BufferGeometry());
    const nodesPos = new Float32Array(nodesCount * 3);
    const nodesColors = new Float32Array(nodesCount * 3);
    const nodesVel = new Float32Array(nodesCount * 3);

    const colorCyan = new THREE.Color(0x00ffff);
    const colorViolet = new THREE.Color(0x8a2be2);

    for (let i = 0; i < nodesCount; i++) {
      nodesPos[i * 3] = (Math.random() - 0.5) * 12;
      nodesPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      nodesPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;

      const mixedColor = Math.random() > 0.5 ? colorCyan : colorViolet;
      nodesColors[i * 3] = mixedColor.r;
      nodesColors[i * 3 + 1] = mixedColor.g;
      nodesColors[i * 3 + 2] = mixedColor.b;

      nodesVel[i * 3] = (Math.random() - 0.5) * 0.01;
      nodesVel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      nodesVel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    nodesGeo.setAttribute('position', new THREE.BufferAttribute(nodesPos, 3));
    nodesGeo.setAttribute('color', new THREE.BufferAttribute(nodesColors, 3));

    const nodesMat = D(
      new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.5, // Subtle to avoid blocking text
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );

    const points = new THREE.Points(nodesGeo, nodesMat);
    particles.add(points);

    // HOLOGRAPHIC AURA RINGS
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    
    for (let i = 0; i < 3; i++) {
      // Scaled down rings to ensure they fit entirely within the camera's view
      // and do not overlap the interface elements.
      const ringGeo = D(new THREE.RingGeometry(1.5 + i * 0.25, 1.52 + i * 0.25, 64));
      const ringMat = D(
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x00ffff : 0x8a2be2,
          transparent: true,
          opacity: 0.08 - i * 0.02, // Kept subtle
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.userData = {
        speedX: (Math.random() - 0.5) * 0.002,
        speedY: (Math.random() - 0.5) * 0.002,
        speedZ: (Math.random() - 0.5) * 0.002,
      };
      ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      ringGroup.add(ring);
    }

    // ABSTRACT DIGITAL LINES (Circuit-like trails framing the face/neck)
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);
    const lineCount = 65;
    
    for (let i = 0; i < lineCount; i++) {
      const points = [];
      // Concentrate lines around the head and neck area (center to lower center)
      let x = (Math.random() - 0.5) * 3.5;
      let y = (Math.random() - 0.5) * 4.0;
      let z = 0.5 + Math.random() * 1.5; // In front of the image
      points.push(new THREE.Vector3(x, y, z));
      
      for(let j=0; j<4; j++) {
        // Draw rigid circuit-like paths
        if (Math.random() > 0.5) {
          x += (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.8);
        } else {
          y += (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.8);
        }
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const lineGeo = D(new THREE.BufferGeometry().setFromPoints(points));
      const lineMat = D(
        new THREE.LineBasicMaterial({
          color: Math.random() > 0.4 ? 0x00ffff : 0x8a2be2, // Cyan and Violet
          transparent: true,
          opacity: 0.15 + Math.random() * 0.2, // Kept subtle
          blending: THREE.AdditiveBlending,
        })
      );
      const line = new THREE.Line(lineGeo, lineMat);
      linesGroup.add(line);
    }

    // ANIMATION LOOP
    let frame = 0;
    let animId = 0;
    
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;
      const time = frame * 0.01;
      const st = stateRef.current;

      // Calculate state-based intensities
      let intensityMult = 1;
      let auraSpeed = 1;
      if (st === 'listening') {
        intensityMult = 1.5;
        auraSpeed = 2;
      } else if (st === 'speaking') {
        intensityMult = 1.3 + Math.sin(time * 8) * 0.3;
        auraSpeed = 1.5;
      } else if (st === 'thinking') {
        intensityMult = 1.2 + Math.sin(time * 2) * 0.2;
        auraSpeed = 3;
      }

      // Animate Avatar Mesh (Hover, subtle rotation, and micro-expressions)
      if (avatarMesh) {
        // Base hover
        const hoverY = Math.sin(time * 1.5) * 0.1;
        avatarMesh.position.y = hoverY;

        // State-based rotation targets
        if (st === 'idle') {
          targetRotX = Math.sin(time * 0.5) * 0.05;
          targetRotY = Math.cos(time * 0.3) * 0.05;
        } else if (st === 'speaking') {
          targetRotX = Math.sin(time * 2) * 0.03;
          targetRotY = Math.cos(time * 1.5) * 0.08;
        } else if (st === 'listening') {
          targetRotX = 0.05;
          targetRotY = Math.sin(time * 0.8) * 0.1;
        } else if (st === 'thinking') {
          targetRotX = -0.05 + Math.sin(time) * 0.02;
          targetRotY = Math.cos(time * 0.5) * 0.15;
        }

        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;
        avatarMesh.rotation.x = currentRotX;
        avatarMesh.rotation.y = currentRotY;

        if (avatarMaterial) {
          // Soft eye glow variations
          avatarMaterial.emissiveIntensity = (0.12 + Math.sin(time * 0.5) * 0.03) * intensityMult;
        }
        
        // Micro-expressions via vertex displacement
        if (baseGeometryPositions) {
          const geo = avatarMesh.geometry as THREE.BufferGeometry;
          const posAttr = geo.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i < posAttr.count; i++) {
            const bx = baseGeometryPositions[i * 3];
            const by = baseGeometryPositions[i * 3 + 1];
            const bz = baseGeometryPositions[i * 3 + 2];
            
            // Subtle "breathing" expansion
            let dist = Math.sin(time * 3 + bx * 2 + by * 2) * 0.01 * intensityMult;
            
            // Simulate eye narrowing, facial tension, and micro-smiles
            let yShift = 0;
            let xShift = 0;
            
            // Add subtle idle micro-expressions so the face feels naturally alive
            if (st === 'idle') {
              if (by > -1.0 && by < -0.2 && Math.abs(bx) > 0.3 && Math.abs(bx) < 1.0) {
                // Occasional micro-smiles even when idle
                yShift = Math.max(0, Math.sin(time * 0.5)) * 0.005;
                xShift = Math.sign(bx) * Math.max(0, Math.sin(time * 0.5)) * 0.002;
              }
              // Subtle eye shift
              if (by > 0.5 && Math.abs(bx) < 1.5) {
                yShift += Math.sin(time * 0.3) * 0.005;
              }
            } else if (st === 'thinking' || st === 'listening') {
              // Eye narrowing (shifting near the top-middle)
              if (by > 0.5 && Math.abs(bx) < 1.5) {
                yShift = -Math.sin(time * 4) * 0.015;
              }
              // Micro-smile: pulling corners of the mouth subtly up and out
              if (by > -1.0 && by < -0.2 && Math.abs(bx) > 0.3 && Math.abs(bx) < 1.0) {
                yShift = Math.abs(Math.sin(time * 2)) * 0.01;
                xShift = Math.sign(bx) * Math.abs(Math.sin(time * 2)) * 0.005;
              }
            } else if (st === 'speaking') {
              // Jaw movement simulation in the lower-middle area
              if (by < -0.2 && Math.abs(bx) < 1.0) {
                yShift = -Math.abs(Math.sin(time * 12)) * 0.04;
              }
            }
            
            posAttr.setZ(i, bz + dist);
            posAttr.setY(i, by + yShift);
            posAttr.setX(i, bx + xShift);
          }
          posAttr.needsUpdate = true;
          geo.computeVertexNormals();
        }
      }

      // Animate Nodes
      const posAttr = nodesGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < nodesCount; i++) {
        posAttr.array[i * 3] += nodesVel[i * 3] * auraSpeed;
        posAttr.array[i * 3 + 1] += nodesVel[i * 3 + 1] * auraSpeed;
        posAttr.array[i * 3 + 2] += nodesVel[i * 3 + 2] * auraSpeed;

        // Wrap around
        if (posAttr.array[i * 3] > 6) posAttr.array[i * 3] = -6;
        if (posAttr.array[i * 3] < -6) posAttr.array[i * 3] = 6;
        if (posAttr.array[i * 3 + 1] > 6) posAttr.array[i * 3 + 1] = -6;
        if (posAttr.array[i * 3 + 1] < -6) posAttr.array[i * 3 + 1] = 6;
      }
      posAttr.needsUpdate = true;
      nodesMat.opacity = 0.4 * intensityMult;
      nodesMat.size = 0.05 * (0.8 + 0.2 * intensityMult);

      // Animate Rings
      ringGroup.children.forEach((child) => {
        const ring = child as THREE.Mesh;
        const speed = ring.userData;
        ring.rotation.x += speed.speedX * auraSpeed;
        ring.rotation.y += speed.speedY * auraSpeed;
        ring.rotation.z += speed.speedZ * auraSpeed;
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.08 * intensityMult;
      });

      // Animate Lines (opacity pulsing)
      linesGroup.children.forEach((child, idx) => {
        const line = child as THREE.Line;
        (line.material as THREE.LineBasicMaterial).opacity = 
          0.05 + Math.abs(Math.sin(time * 2 + idx)) * 0.2 * intensityMult;
      });

      // Point Lights pulse
      pointLightCyan.intensity = 4 * intensityMult;
      pointLightViolet.intensity = 4 * intensityMult;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [dim]);

  // CSS Halo overlay based on state
  const haloColor =
    state === 'listening' ? 'rgba(0, 255, 255, 0.4)' :
    state === 'speaking'  ? 'rgba(0, 255, 255, 0.25)' :
    state === 'thinking'  ? 'rgba(138, 43, 226, 0.35)' :
                            'rgba(0, 255, 255, 0.15)';

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: dim, height: dim }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out"
        style={{
          background: `radial-gradient(circle, ${haloColor} 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(20px)',
          transform: state !== 'idle' ? 'scale(1.1)' : 'scale(1)',
          animation: state !== 'idle' ? 'pulse 2s ease-in-out infinite' : 'none',
        }}
      />
      
      {dim >= 100 ? (
        <div
          ref={mountRef}
          className="relative z-10 w-full h-full rounded-full overflow-hidden"
          style={{
            boxShadow: `0 0 30px ${haloColor}, inset 0 0 20px rgba(0, 255, 255, 0.2)`,
            border: '1px solid rgba(0, 255, 255, 0.3)',
            backgroundColor: '#0a0a1a',
          }}
        />
      ) : (
        /* Fallback for small sizes (e.g., chat messages) */
        <div
          className="w-full h-full rounded-full flex items-center justify-center bg-[#0a0a1a] overflow-hidden"
          style={{
            border: '1px solid rgba(0, 255, 255, 0.4)',
            boxShadow: `0 0 10px ${haloColor}`,
          }}
        >
          <img 
            src={avatarImgSrc} 
            alt="Obsidian AI" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      )}
    </div>
  );
}
