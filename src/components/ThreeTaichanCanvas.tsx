import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ThreeTaichanCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const heatLevelRef = useRef<'normal' | 'hot' | 'super'>('normal');
  const [isFanning, setIsFanning] = useState(false);
  const [heatLevel, setHeatLevel] = useState<'normal' | 'hot' | 'super'>('normal');
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    heatLevelRef.current = heatLevel;
  }, [heatLevel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 380;

    // 2. Scene & Camera
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 40);
    camera.position.set(0, 3.1, 5.4);
    camera.lookAt(0, 0.05, 0);

    // 3. Transparent WebGLRenderer (frameless integration into page canvas)
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // PMREM Studio Lightbox IBL for natural food & ceramic highlights
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const studioScene = new THREE.Scene();
    studioScene.background = new THREE.Color(0x2a241e);
    const warmPanelMat = new THREE.MeshBasicMaterial({ color: 0xfff0dd });
    const coolPanelMat = new THREE.MeshBasicMaterial({ color: 0xdbeafe });
    const panelGeo = new THREE.PlaneGeometry(6, 4);
    const topPanel = new THREE.Mesh(panelGeo, warmPanelMat);
    topPanel.position.set(0, 5, 1);
    topPanel.rotation.x = Math.PI / 2;
    const sidePanel = new THREE.Mesh(panelGeo, coolPanelMat);
    sidePanel.position.set(-5, 2, 0);
    sidePanel.rotation.y = Math.PI / 2;
    studioScene.add(topPanel, sidePanel);
    const envTarget = pmremGenerator.fromScene(studioScene, 0.04);
    scene.environment = envTarget.texture;
    panelGeo.dispose();
    warmPanelMat.dispose();
    coolPanelMat.dispose();
    pmremGenerator.dispose();

    // 4. Three-Point + Ember Lighting
    const hemiLight = new THREE.HemisphereLight(0xfff9f0, 0x261f1a, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff3e0, 1.85);
    keyLight.position.set(3.5, 6, 4.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdce8ff, 0.75);
    rimLight.position.set(-4, 4, -3.5);
    scene.add(rimLight);

    const emberLight = new THREE.PointLight(0xff521b, 2.8, 5.5);
    emberLight.position.set(0, -0.05, 0);
    scene.add(emberLight);

    // Track disposable resources
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };

    // Soft grounded shadow plane underneath platter (works smoothly on light and dark backgrounds)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 18, 128, 128, 120);
      grad.addColorStop(0, 'rgba(20, 12, 6, 0.42)');
      grad.addColorStop(0.55, 'rgba(20, 12, 6, 0.16)');
      grad.addColorStop(1, 'rgba(20, 12, 6, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    textures.push(shadowTex);
    const shadowPlane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(5.6, 4.2)),
      trackMat(
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          depthWrite: false,
        })
      )
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.62;
    scene.add(shadowPlane);

    // 5. Build 3D Taichan Grill Platter Group
    const platterGroup = new THREE.Group();
    scene.add(platterGroup);

    // Slate Ceramic Tray Base
    const trayMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1b1a18,
        roughness: 0.72,
        metalness: 0.08,
      })
    );
    const trayRimMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x292623,
        roughness: 0.55,
        metalness: 0.15,
      })
    );

    const trayBase = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(3.75, 0.16, 2.55)),
      trayMat
    );
    trayBase.position.y = -0.34;
    platterGroup.add(trayBase);

    // Raised edge border around slate tray
    const edgeThickness = 0.08;
    const frontEdge = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.85, 0.22, edgeThickness)), trayRimMat);
    frontEdge.position.set(0, -0.31, 1.28);
    const backEdge = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.85, 0.22, edgeThickness)), trayRimMat);
    backEdge.position.set(0, -0.31, -1.28);
    const leftEdge = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(edgeThickness, 0.22, 2.55)), trayRimMat);
    leftEdge.position.set(-1.88, -0.31, 0);
    const rightEdge = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(edgeThickness, 0.22, 2.55)), trayRimMat);
    rightEdge.position.set(1.88, -0.31, 0);
    platterGroup.add(frontEdge, backEdge, leftEdge, rightEdge);

    // Glowing Coconut Charcoal Bed
    const coalMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e0e09,
        emissive: 0xff3f00,
        emissiveIntensity: 0.6,
        roughness: 0.92,
      })
    );
    const coalGeo = trackGeo(new THREE.DodecahedronGeometry(0.18, 0));
    for (let i = 0; i < 12; i++) {
      const coal = new THREE.Mesh(coalGeo, coalMat);
      const col = i % 4;
      const row = Math.floor(i / 4);
      coal.position.set(
        -1.05 + col * 0.65 + (Math.sin(i * 3.1) * 0.12),
        -0.21,
        -0.55 + row * 0.55 + (Math.cos(i * 2.4) * 0.1)
      );
      const scale = 0.78 + (i % 3) * 0.22;
      coal.scale.set(scale * 1.2, scale * 0.65, scale);
      coal.rotation.set(i * 0.7, i * 1.1, i * 0.4);
      platterGroup.add(coal);
    }

    // Stainless Grill Grate Rods above coals
    const grateMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x7b7874,
        roughness: 0.35,
        metalness: 0.85,
      })
    );
    const rodGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 2.9, 10));
    for (let r = -3; r <= 3; r++) {
      const rod = new THREE.Mesh(rodGeo, grateMat);
      rod.rotation.z = Math.PI / 2;
      rod.position.set(-0.15, -0.07, r * 0.28);
      platterGroup.add(rod);
    }

    // Skewers (5 Sate Taichan skewers fanned naturally)
    const bambooMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd9b37c,
        roughness: 0.78,
        metalness: 0.02,
      })
    );
    const chickenMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf4e4cb,
        roughness: 0.48,
        metalness: 0.05,
      })
    );
    const searedChickenMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe6be8a,
        roughness: 0.52,
        metalness: 0.06,
      })
    );
    const charMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x2b180d,
        roughness: 0.9,
      })
    );

    const stickGeo = trackGeo(new THREE.CylinderGeometry(0.02, 0.028, 3.35, 12));
    const meatGeo = trackGeo(new THREE.DodecahedronGeometry(0.185, 0));
    const charSpotGeo = trackGeo(new THREE.BoxGeometry(0.11, 0.025, 0.07));

    const skewerConfigs = [
      { x: -1.02, z: -0.05, rotY: 0.09, tiltZ: -0.05 },
      { x: -0.58, z: 0.02, rotY: 0.04, tiltZ: -0.02 },
      { x: -0.14, z: 0.04, rotY: 0.0, tiltZ: 0.01 },
      { x: 0.3, z: 0.01, rotY: -0.04, tiltZ: 0.03 },
      { x: 0.74, z: -0.06, rotY: -0.09, tiltZ: 0.05 },
    ];

    skewerConfigs.forEach((cfg, skewerIdx) => {
      const skewerGroup = new THREE.Group();
      skewerGroup.position.set(cfg.x, 0.08, cfg.z);
      skewerGroup.rotation.y = cfg.rotY;
      skewerGroup.rotation.z = cfg.tiltZ;

      const stick = new THREE.Mesh(stickGeo, bambooMat);
      stick.rotation.x = Math.PI / 2;
      stick.position.z = 0.25;
      skewerGroup.add(stick);

      const meatZs = [-0.66, -0.26, 0.14, 0.54];
      meatZs.forEach((mz, meatIdx) => {
        const pieceGroup = new THREE.Group();
        pieceGroup.position.set(0, 0.02, mz);

        const meat = new THREE.Mesh(
          meatGeo,
          (skewerIdx + meatIdx) % 2 === 0 ? chickenMat : searedChickenMat
        );
        const wScale = 1.15 + ((skewerIdx + meatIdx) % 2) * 0.12;
        const hScale = 0.68 + (meatIdx % 2) * 0.08;
        const dScale = 0.92 + (skewerIdx % 2) * 0.1;
        meat.scale.set(wScale, hScale, dScale);
        meat.rotation.set(
          (skewerIdx + meatIdx) * 0.45,
          meatIdx * 0.85,
          skewerIdx * 0.35
        );
        pieceGroup.add(meat);

        // Subtle sear lines on top of each chicken fillet chunk
        const charSpot = new THREE.Mesh(charSpotGeo, charMat);
        charSpot.position.set(0.03 * (meatIdx % 2 === 0 ? 1 : -1), 0.105, 0.01);
        charSpot.rotation.y = (skewerIdx % 2 === 0 ? 0.3 : -0.3);
        pieceGroup.add(charSpot);

        skewerGroup.add(pieceGroup);
      });

      platterGroup.add(skewerGroup);
    });

    // Dual Sambal Ramekins (Sambal Kacang & Sambal Pedas) on right side of tray
    const bowlMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x161618,
        roughness: 0.35,
        metalness: 0.12,
      })
    );
    const sambalPedasMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd9261c,
        roughness: 0.25,
        metalness: 0.05,
      })
    );
    const sambalKacangMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xa6632b,
        roughness: 0.45,
        metalness: 0.04,
      })
    );

    const bowlGeo = trackGeo(new THREE.CylinderGeometry(0.27, 0.2, 0.16, 20));
    const sauceGeo = trackGeo(new THREE.CylinderGeometry(0.23, 0.23, 0.04, 20));

    // Bowl 1: Sambal Pedas
    const bowlPedas = new THREE.Mesh(bowlGeo, bowlMat);
    bowlPedas.position.set(1.38, -0.17, -0.58);
    const saucePedas = new THREE.Mesh(sauceGeo, sambalPedasMat);
    saucePedas.position.set(1.38, -0.095, -0.58);
    platterGroup.add(bowlPedas, saucePedas);

    // Bowl 2: Sambal Kacang
    const bowlKacang = new THREE.Mesh(bowlGeo, bowlMat);
    bowlKacang.position.set(1.38, -0.17, 0.08);
    const sauceKacang = new THREE.Mesh(sauceGeo, sambalKacangMat);
    sauceKacang.position.set(1.38, -0.095, 0.08);
    platterGroup.add(bowlKacang, sauceKacang);

    // Fresh Lime Half (Jeruk Nipis)
    const limeGroup = new THREE.Group();
    limeGroup.position.set(1.34, -0.17, 0.78);
    limeGroup.rotation.set(0.25, -0.5, 0.15);

    const limePeelMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x3b7a1e, roughness: 0.5 }));
    const limePulpMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x9cd34a, roughness: 0.35 }));
    const limePeel = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.13, 18, 1, false, 0, Math.PI)),
      limePeelMat
    );
    const limePulp = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.134, 18, 1, false, 0, Math.PI)),
      limePulpMat
    );
    limeGroup.add(limePeel, limePulp);
    platterGroup.add(limeGroup);

    // 6. Subtle Rising Ember Particles
    const particleCount = isSoftwareGl ? 20 : 42;
    const particleGeo = trackGeo(new THREE.BufferGeometry());
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number; life: number; maxLife: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 2.2;
      particlePositions[i * 3 + 1] = Math.random() * 1.8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.4;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.006,
        y: 0.012 + Math.random() * 0.014,
        z: (Math.random() - 0.5) * 0.006,
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 60,
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = trackMat(
      new THREE.PointsMaterial({
        color: 0xf39223,
        size: 0.055,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      })
    );
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Pointer Drag Rotation
    let isDragging = false;
    let previousMouseX = 0;
    let targetRotationY = 0.25;
    let currentRotationY = 0.25;

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

    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frameId);
    };
    domElement.addEventListener('webglcontextlost', onContextLost);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 560;
      const h = container.clientHeight || 380;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation Loop using performance.now() (no deprecated THREE.Clock)
    let frameId = 0;
    let lastTime = performance.now();
    const startTime = lastTime;

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsedTime = (now - startTime) / 1000;

      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 6, delta);
      platterGroup.rotation.y = currentRotationY;

      if (!isDragging) {
        targetRotationY += delta * 0.22;
      }
      platterGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.035;

      const activeHeat = heatLevelRef.current;
      const flicker = Math.sin(elapsedTime * 7.5) * 0.35 + Math.sin(elapsedTime * 15) * 0.15;
      emberLight.intensity =
        (activeHeat === 'super' ? 4.8 : activeHeat === 'hot' ? 3.6 : 2.5) + flicker;
      coalMat.emissiveIntensity =
        (activeHeat === 'super' ? 1.15 : activeHeat === 'hot' ? 0.85 : 0.55) + flicker * 0.18;

      const posArray = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        vel.life += 1;

        posArray[i * 3] += vel.x + Math.sin(elapsedTime + i) * 0.002;
        posArray[i * 3 + 1] += vel.y * (activeHeat === 'super' ? 1.7 : 1.0);
        posArray[i * 3 + 2] += vel.z;

        if (vel.life > vel.maxLife || posArray[i * 3 + 1] > 2.4) {
          vel.life = 0;
          posArray[i * 3] = (Math.random() - 0.5) * 2.0;
          posArray[i * 3 + 1] = -0.18;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('webglcontextlost', onContextLost);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envTarget.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleFanBara = () => {
    setIsFanning(true);
    setHeatLevel('super');
    setTimeout(() => {
      setHeatLevel('hot');
      setTimeout(() => {
        setHeatLevel('normal');
        setIsFanning(false);
      }, 1400);
    }, 1100);
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {webglFailed ? (
        <div className="w-full max-w-md aspect-[4/3] flex items-center justify-center">
          <img
            src="/assets/menu/sate_taichan_bakar.png"
            alt="Sate Taichan Bakar Rotterdam"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
      ) : (
        <div
          ref={mountRef}
          className="w-full h-72 sm:h-88 md:h-96 cursor-grab active:cursor-grabbing flex items-center justify-center relative select-none"
          title="Geser untuk memutar sate taichan 3D"
        />
      )}

      {/* Minimal, non-boxed interaction cue directly below the 3D platter */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-4 text-xs text-[#6B665E] dark:text-neutral-400">
        <span>Geser untuk memutar 360°</span>
        <span aria-hidden="true" className="text-[#D8D0C5] dark:text-neutral-700">|</span>
        <button
          type="button"
          onClick={handleFanBara}
          disabled={isFanning}
          className="font-bold text-[#F39223] hover:text-[#ED1C24] transition-colors cursor-pointer disabled:opacity-50"
        >
          {isFanning ? 'Mengipas bara...' : 'Kipas bara arang'}
        </button>
      </div>
    </div>
  );
};
