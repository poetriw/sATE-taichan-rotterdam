import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Flame, RotateCcw, Sparkles } from 'lucide-react';

export const ThreeTaichanCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isFanning, setIsFanning] = useState(false);
  const [heatLevel, setHeatLevel] = useState<'normal' | 'hot' | 'super'>('normal');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    // 2. Scene & Camera
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 3.2, 5.2);
    camera.lookAt(0, 0, 0);

    // 3. WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 4. Lights
    const hemiLight = new THREE.HemisphereLight(0xfff6ea, 0x1a1a24, 1.4);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    // Ember glow light (pulsates with fanning)
    const emberLight = new THREE.PointLight(0xff4500, 3.5, 6);
    emberLight.position.set(0, -0.2, 0);
    scene.add(emberLight);

    // 5. Build 3D Skewers Platter Group
    const platterGroup = new THREE.Group();
    scene.add(platterGroup);

    // Ceramic / Slate Grill Plate
    const plateGeo = new THREE.BoxGeometry(3.6, 0.16, 2.4);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x1c1c1f,
      roughness: 0.85,
      metalness: 0.1,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = -0.3;
    platterGroup.add(plate);

    // Glowing charcoal chunks on the plate
    const coalsGroup = new THREE.Group();
    const coalMat = new THREE.MeshStandardMaterial({
      color: 0x22110c,
      emissive: 0xff3b00,
      emissiveIntensity: 0.65,
      roughness: 0.9,
    });
    for (let i = 0; i < 9; i++) {
      const coalGeo = new THREE.DodecahedronGeometry(0.18 + Math.random() * 0.08, 0);
      const coal = new THREE.Mesh(coalGeo, coalMat);
      coal.position.set(
        (Math.random() - 0.5) * 2.6,
        -0.18,
        (Math.random() - 0.5) * 1.6
      );
      coal.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      coalsGroup.add(coal);
    }
    platterGroup.add(coalsGroup);

    // Shared Materials for Taichan Skewers
    const bambooMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887,
      roughness: 0.75,
      metalness: 0.05,
    });

    const chickenMat = new THREE.MeshStandardMaterial({
      color: 0xf5ebd9,
      roughness: 0.45,
      metalness: 0.08,
    });

    const charMat = new THREE.MeshStandardMaterial({
      color: 0x2b1c11,
      roughness: 0.9,
    });

    // Create 3 succulent Taichan skewers
    const skewerOffsets = [-0.65, 0, 0.65];
    const skewerAngles = [-0.08, 0, 0.08];

    skewerOffsets.forEach((xOffset, skewerIdx) => {
      const skewerGroup = new THREE.Group();
      skewerGroup.position.set(xOffset, 0, 0);
      skewerGroup.rotation.z = skewerAngles[skewerIdx];
      skewerGroup.rotation.y = (Math.random() - 0.5) * 0.1;

      // Bamboo stick
      const stickGeo = new THREE.CylinderGeometry(0.025, 0.03, 3.4, 12);
      const stick = new THREE.Mesh(stickGeo, bambooMat);
      stick.rotation.x = Math.PI / 2;
      stick.position.z = 0.2;
      skewerGroup.add(stick);

      // 4 pieces of chicken meat on each skewer
      const meatPositions = [-0.6, -0.2, 0.2, 0.6];
      meatPositions.forEach((zPos, meatIdx) => {
        const meatGroup = new THREE.Group();
        meatGroup.position.set(0, 0.02, zPos);

        const meatGeo = new THREE.DodecahedronGeometry(0.19 + (meatIdx % 2) * 0.03, 1);
        meatGeo.scale(1.1, 0.85, 1.0);
        const meat = new THREE.Mesh(meatGeo, chickenMat);
        meat.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
        meatGroup.add(meat);

        // Char marks (small burnt spots from coconut charcoal grilling)
        const charGeo = new THREE.SphereGeometry(0.06, 6, 6);
        charGeo.scale(1.4, 0.4, 0.8);
        const char = new THREE.Mesh(charGeo, charMat);
        char.position.set(0.12, 0.1, 0.04);
        char.rotation.set(0.3, 0.2, 0.5);
        meatGroup.add(char);

        skewerGroup.add(meatGroup);
      });

      platterGroup.add(skewerGroup);
    });

    // Lime Wedge (Jeruk Nipis) on the side
    const limeGroup = new THREE.Group();
    limeGroup.position.set(1.2, -0.15, 0.65);
    limeGroup.rotation.set(0.2, -0.4, 0.1);

    const limePeelMat = new THREE.MeshStandardMaterial({ color: 0x3b7a1e, roughness: 0.5 });
    const limePulpMat = new THREE.MeshStandardMaterial({ color: 0x98cf4a, roughness: 0.35 });

    const limePeel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.14, 16, 1, false, 0, Math.PI),
      limePeelMat
    );
    const limePulp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.142, 16, 1, false, 0, Math.PI),
      limePulpMat
    );
    limeGroup.add(limePeel);
    limeGroup.add(limePulp);
    platterGroup.add(limeGroup);

    // 6. Smoke / Ember Rising Particles
    const particleCount = isSoftwareGl ? 30 : 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number; life: number; maxLife: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 1.8;
      particlePositions[i * 3 + 1] = Math.random() * 2.0;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.4;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.012,
        y: 0.015 + Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.012,
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 60,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xff6b35,
      size: 0.07,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Interactive Drag / Touch to Rotate
    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = 0.35;
    let currentRotationY = 0.35;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      targetRotationY += deltaX * 0.008;
      previousMouseX = e.clientX;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.style.touchAction = 'none';
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation Loop
    let frameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth damped rotation
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 6, delta);
      platterGroup.rotation.y = currentRotationY;

      // Auto subtle floating / slow spin when not dragging
      if (!isDragging) {
        targetRotationY += 0.003;
      }
      platterGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.04;

      // Ember flicker
      const flicker = Math.sin(elapsedTime * 8) * 0.4 + Math.sin(elapsedTime * 17) * 0.2;
      emberLight.intensity = (heatLevel === 'super' ? 5.5 : heatLevel === 'hot' ? 4.2 : 3.0) + flicker;
      coalMat.emissiveIntensity = 0.6 + flicker * 0.2;

      // Animate Smoke & Embers Particles
      const posArray = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        vel.life += 1;

        posArray[i * 3] += vel.x + Math.sin(elapsedTime + i) * 0.003;
        posArray[i * 3 + 1] += vel.y * (heatLevel === 'super' ? 1.8 : 1.0);
        posArray[i * 3 + 2] += vel.z;

        if (vel.life > vel.maxLife || posArray[i * 3 + 1] > 2.8) {
          vel.life = 0;
          posArray[i * 3] = (Math.random() - 0.5) * 1.8;
          posArray[i * 3 + 1] = -0.15;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      renderer.dispose();
      plateGeo.dispose();
      plateMat.dispose();
      coalMat.dispose();
      bambooMat.dispose();
      chickenMat.dispose();
      charMat.dispose();
      limePeelMat.dispose();
      limePulpMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [heatLevel]);

  const handleFanBara = () => {
    setIsFanning(true);
    setHeatLevel('super');
    setTimeout(() => {
      setHeatLevel('hot');
      setTimeout(() => {
        setHeatLevel('normal');
        setIsFanning(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#1C1A17] to-[#121110] border border-[#3A332C] p-4 sm:p-5 shadow-2xl flex flex-col items-center">
      {/* Header Badge */}
      <div className="w-full flex items-center justify-between z-10 mb-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#F39223]/20 border border-[#F39223]/40 text-[#F39223]">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <div className="text-[11px] font-black tracking-wider uppercase text-[#F39223]">
              3D Interactive Grill
            </div>
            <div className="text-xs font-bold text-white">
              Sate Taichan Rotterdam #BakarArang
            </div>
          </div>
        </div>

        <span className="text-[10px] text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-full border border-neutral-700/60 hidden sm:inline-block">
          Putar 360° dengan kursor
        </span>
      </div>

      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing flex items-center justify-center relative select-none"
        title="Geser / Drag untuk memutar sate taichan 3D"
      />

      {/* Action / Interaction Bar */}
      <div className="w-full mt-2 pt-3 border-t border-neutral-800 flex items-center justify-between gap-3 z-10">
        <div className="text-[11px] text-neutral-300 flex items-center gap-1.5">
          <Flame className={`w-3.5 h-3.5 ${heatLevel === 'super' ? 'text-[#ED1C24] animate-bounce' : 'text-[#F39223]'}`} />
          <span>Bara Arang: <strong className={heatLevel === 'super' ? 'text-[#ED1C24]' : 'text-[#F39223]'}>{heatLevel === 'super' ? 'Membara Panas!' : heatLevel === 'hot' ? 'Panas Sedang' : 'Normal Siap Saji'}</strong></span>
        </div>

        <button
          type="button"
          onClick={handleFanBara}
          disabled={isFanning}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F39223] to-[#ED1C24] hover:opacity-95 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <Flame className="w-3.5 h-3.5 fill-white" />
          <span>{isFanning ? 'Sedang Dikipas...' : 'Kipas Bara Arang 🔥'}</span>
        </button>
      </div>
    </div>
  );
};
