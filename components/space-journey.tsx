'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function SpaceJourney() {
  const groupRef = useRef<THREE.Group>(null)
  const starsRef = useRef<THREE.Points>(null)
  const nebulaRef = useRef<THREE.Points>(null)
  const { camera } = useThree()
  const timeRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const starsMaterialRef = useRef<THREE.ShaderMaterial | null>(null)
  const nebulaMaterialRef = useRef<THREE.ShaderMaterial | null>(null)
  
  // Direction change state
  const directionRef = useRef({
    currentAngle: 0,
    targetAngle: 0,
    currentPitch: 0,
    targetPitch: 0,
    lastChangeTime: 0,
    changeInterval: 4,
    transitionSpeed: 0.02
  })
  
  // Camera path state
  const cameraPathRef = useRef({
    x: 0,
    y: 0,
    z: 0,
    velocityX: 0,
    velocityY: 0,
    velocityZ: -2
  })

  const generateNewDirection = () => {
    const dir = directionRef.current
    dir.targetAngle = (Math.random() - 0.5) * Math.PI * 0.8
    dir.targetPitch = (Math.random() - 0.5) * Math.PI * 0.4
    dir.changeInterval = 3 + Math.random() * 4
  }

  // Create all geometries
  const { starsGeometry, nebulaGeometry, gridGeometry, gridMaterial, structures, waypoints, neuralData } = useMemo(() => {
    // Stars
    const starCount = 2000
    const starPositions = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 12 + Math.random() * 35
      const z = (Math.random() - 0.5) * 300

      starPositions[i * 3] = Math.cos(angle) * radius
      starPositions[i * 3 + 1] = Math.sin(angle) * radius
      starPositions[i * 3 + 2] = z

      const colorChoice = Math.random()
      if (colorChoice < 0.5) {
        starColors[i * 3] = 0.95
        starColors[i * 3 + 1] = 0.98
        starColors[i * 3 + 2] = 1.0
      } else if (colorChoice < 0.75) {
        starColors[i * 3] = 0.2
        starColors[i * 3 + 1] = 0.85
        starColors[i * 3 + 2] = 1.0
      } else {
        starColors[i * 3] = 0.75
        starColors[i * 3 + 1] = 0.5
        starColors[i * 3 + 2] = 1.0
      }

      starSizes[i] = 0.3 + Math.random() * 1.0
    }

    const starsGeometry = new THREE.BufferGeometry()
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    starsGeometry.setAttribute('aColor', new THREE.Float32BufferAttribute(starColors, 3))
    starsGeometry.setAttribute('aSize', new THREE.Float32BufferAttribute(starSizes, 1))

    // Nebula
    const nebulaCount = 80
    const nebulaPositions = new Float32Array(nebulaCount * 3)
    const nebulaColors = new Float32Array(nebulaCount * 3)
    const nebulaSizes = new Float32Array(nebulaCount)

    for (let i = 0; i < nebulaCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 18 + Math.random() * 28
      const z = (Math.random() - 0.5) * 250

      nebulaPositions[i * 3] = Math.cos(angle) * radius
      nebulaPositions[i * 3 + 1] = Math.sin(angle) * radius
      nebulaPositions[i * 3 + 2] = z

      const t = Math.random()
      nebulaColors[i * 3] = 0.15 + t * 0.4
      nebulaColors[i * 3 + 1] = 0.5 + t * 0.3
      nebulaColors[i * 3 + 2] = 1.0

      nebulaSizes[i] = 12 + Math.random() * 18
    }

    const nebulaGeometry = new THREE.BufferGeometry()
    nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nebulaPositions, 3))
    nebulaGeometry.setAttribute('aColor', new THREE.Float32BufferAttribute(nebulaColors, 3))
    nebulaGeometry.setAttribute('aSize', new THREE.Float32BufferAttribute(nebulaSizes, 1))

    // Grid
    const gridPositions: number[] = []
    const gridColors: number[] = []
    
    for (let i = 0; i < 50; i++) {
      const z = -250 + i * 10
      const radius = 25
      
      for (let j = 0; j <= 48; j++) {
        const angle = (j / 48) * Math.PI * 2
        const nextAngle = ((j + 1) / 48) * Math.PI * 2
        
        gridPositions.push(
          Math.cos(angle) * radius, Math.sin(angle) * radius, z,
          Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius, z
        )
        
        gridColors.push(0.1, 0.6, 1.0, 0.1, 0.6, 1.0)
      }
    }

    const gridGeometry = new THREE.BufferGeometry()
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3))
    gridGeometry.setAttribute('color', new THREE.Float32BufferAttribute(gridColors, 3))

    const gridMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending
    })

    // Structures
    const structures = []
    for (let i = 0; i < 25; i++) {
      const z = -40 - Math.random() * 200
      const angle = Math.random() * Math.PI * 2
      const radius = 10 + Math.random() * 15
      
      structures.push({
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius, z] as [number, number, number],
        rotation: Math.random() * Math.PI,
        scale: 0.3 + Math.random() * 0.6,
        type: Math.floor(Math.random() * 4),
        speed: 0.2 + Math.random() * 0.3,
        color: ['#22d3ee', '#a78bfa', '#34d399', '#f472b6'][Math.floor(Math.random() * 4)]
      })
    }

    // Waypoints
    const waypoints = []
    for (let i = 0; i < 12; i++) {
      const z = -60 - i * 30
      waypoints.push({
        position: [0, 0, z] as [number, number, number],
        scale: 2 + Math.random() * 2
      })
    }

    // Neural network data
    const neuralData = generateNeuralNetwork()

    return { starsGeometry, nebulaGeometry, gridGeometry, gridMaterial, structures, waypoints, neuralData }
  }, [])

  // Generate neural network structure
  function generateNeuralNetwork() {
    const nodes: { position: THREE.Vector3; connections: number[]; phase: number; cluster: number }[] = []
    const nodeCount = 120
    
    for (let i = 0; i < nodeCount; i++) {
      const cluster = Math.floor(i / 20)
      const clusterOffset = new THREE.Vector3(
        (cluster % 3 - 1) * 15,
        (Math.floor(cluster / 3) - 1) * 10,
        -30 - Math.random() * 180
      )
      
      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 8
      
      nodes.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius + clusterOffset.x,
          Math.sin(angle) * radius + clusterOffset.y,
          clusterOffset.z + (Math.random() - 0.5) * 10
        ),
        connections: [],
        phase: Math.random() * Math.PI * 2,
        cluster: cluster
      })
    }

    const connections: { start: number; end: number; strength: number }[] = []
    
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position)
        const sameCluster = nodes[i].cluster === nodes[j].cluster
        const maxDist = sameCluster ? 8 : 15
        
        if (dist < maxDist && Math.random() < (sameCluster ? 0.4 : 0.15)) {
          nodes[i].connections.push(j)
          nodes[j].connections.push(i)
          connections.push({
            start: i,
            end: j,
            strength: sameCluster ? 0.8 : 0.4
          })
        }
      }
    }

    const pulsePaths: { nodePath: number[]; progress: number; speed: number; color: THREE.Color }[] = []
    for (let i = 0; i < 30; i++) {
      const startNode = Math.floor(Math.random() * nodeCount)
      const path = [startNode]
      let current = startNode
      
      for (let j = 0; j < 3 + Math.floor(Math.random() * 4); j++) {
        if (nodes[current].connections.length > 0) {
          const next = nodes[current].connections[Math.floor(Math.random() * nodes[current].connections.length)]
          if (!path.includes(next)) {
            path.push(next)
            current = next
          }
        }
      }
      
      pulsePaths.push({
        nodePath: path,
        progress: Math.random(),
        speed: 0.3 + Math.random() * 0.5,
        color: new THREE.Color().setHSL(0.5 + Math.random() * 0.2, 0.8, 0.6)
      })
    }

    return { nodes, connections, pulsePaths }
  }

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.targetY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Create shader materials
  const starsMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        
        void main() {
          vColor = aColor;
          float twinkle = sin(uTime * 2.5 + position.x * 0.05 + position.y * 0.05 + position.z * 0.02) * 0.5 + 0.5;
          vAlpha = 0.4 + twinkle * 0.6;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (1.0 + twinkle * 0.4) * uPixelRatio * (80.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = (1.0 - dist * 2.0) * vAlpha;
          float glow = exp(-dist * 5.0);
          gl_FragColor = vec4(vColor * (1.0 + glow * 0.3), alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    starsMaterialRef.current = mat
    return mat
  }, [])

  const nebulaMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uTime;
        uniform float uPixelRatio;
        
        void main() {
          vColor = aColor;
          vec3 pos = position;
          pos.x += sin(uTime * 0.12 + position.z * 0.006) * 2.5;
          pos.y += cos(uTime * 0.1 + position.z * 0.005) * 2.5;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = aSize * uPixelRatio * (80.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = exp(-dist * 2.0) * 0.1;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    nebulaMaterialRef.current = mat
    return mat
  }, [])

  useFrame((state, delta) => {
    timeRef.current += delta
    const time = state.clock.elapsedTime
    const dir = directionRef.current
    const cam = cameraPathRef.current

    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04

    if (time - dir.lastChangeTime > dir.changeInterval) {
      dir.lastChangeTime = time
      generateNewDirection()
    }

    dir.currentAngle += (dir.targetAngle - dir.currentAngle) * dir.transitionSpeed
    dir.currentPitch += (dir.targetPitch - dir.currentPitch) * dir.transitionSpeed

    const naturalSway = {
      x: Math.sin(time * 0.3) * 0.12,
      y: Math.cos(time * 0.25) * 0.08
    }

    const directionX = Math.sin(dir.currentAngle) + naturalSway.x + mouseRef.current.x * 0.25
    const directionY = Math.sin(dir.currentPitch) + naturalSway.y + mouseRef.current.y * 0.18

    cam.velocityX = directionX * 1.2
    cam.velocityY = directionY * 1.0
    cam.velocityZ = -2.2 - Math.abs(mouseRef.current.y) * 0.4

    cam.x += cam.velocityX * delta
    cam.y += cam.velocityY * delta
    cam.z += cam.velocityZ * delta

    cam.x = THREE.MathUtils.clamp(cam.x, -18, 18)
    cam.y = THREE.MathUtils.clamp(cam.y, -12, 12)

    camera.position.set(cam.x, cam.y, cam.z)

    const lookAhead = 12
    camera.lookAt(
      cam.x + cam.velocityX * lookAhead,
      cam.y + cam.velocityY * lookAhead,
      cam.z - lookAhead
    )

    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    if (starsMaterialRef.current) {
      starsMaterialRef.current.uniforms.uTime.value = timeRef.current
      starsMaterialRef.current.uniforms.uPixelRatio.value = pixelRatio
    }
    if (nebulaMaterialRef.current) {
      nebulaMaterialRef.current.uniforms.uTime.value = timeRef.current
      nebulaMaterialRef.current.uniforms.uPixelRatio.value = pixelRatio
    }

    if (groupRef.current) {
      groupRef.current.rotation.z = dir.currentAngle * 0.08
      groupRef.current.rotation.x = dir.currentPitch * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={starsRef} geometry={starsGeometry} material={starsMaterial} />
      <points ref={nebulaRef} geometry={nebulaGeometry} material={nebulaMaterial} />
      <lineSegments geometry={gridGeometry} material={gridMaterial} />
      
      <NeuralConnections neuralData={neuralData} />
      
      {waypoints.map((wp, i) => (
        <Waypoint key={i} position={wp.position} scale={wp.scale} index={i} />
      ))}
      
      {structures.map((struct, i) => (
        <FloatingStructure key={i} struct={struct} />
      ))}
    </group>
  )
}

function NeuralConnections({ neuralData }: { neuralData: {
  nodes: { position: THREE.Vector3; connections: number[]; phase: number; cluster: number }[]
  connections: { start: number; end: number; strength: number }[]
  pulsePaths: { nodePath: number[]; progress: number; speed: number; color: THREE.Color }[]
}}) {
  const nodesGroupRef = useRef<THREE.Group>(null)
  const pulsesRef = useRef<THREE.Points>(null)
  const timeRef = useRef(0)
  const pulseStatesRef = useRef<{ progress: number; nodeIndex: number; pathIndex: number }[]>([])
  const nodesMaterialRef = useRef<THREE.ShaderMaterial | null>(null)
  const pulsesMaterialRef = useRef<THREE.ShaderMaterial | null>(null)

  const { nodesGeometry, nodesMaterial, connectionsGeometry, connectionsMaterial, pulsesGeometry, pulsesMaterial } = useMemo(() => {
    const nodePositions = new Float32Array(neuralData.nodes.length * 3)
    const nodeColors = new Float32Array(neuralData.nodes.length * 3)
    const nodeSizes = new Float32Array(neuralData.nodes.length)

    neuralData.nodes.forEach((node, i) => {
      nodePositions[i * 3] = node.position.x
      nodePositions[i * 3 + 1] = node.position.y
      nodePositions[i * 3 + 2] = node.position.z

      const hue = 0.5 + (node.cluster * 0.1)
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
      nodeColors[i * 3] = color.r
      nodeColors[i * 3 + 1] = color.g
      nodeColors[i * 3 + 2] = color.b

      nodeSizes[i] = 0.15 + Math.random() * 0.1
    })

    const nodesGeometry = new THREE.BufferGeometry()
    nodesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3))
    nodesGeometry.setAttribute('aColor', new THREE.Float32BufferAttribute(nodeColors, 3))
    nodesGeometry.setAttribute('aSize', new THREE.Float32BufferAttribute(nodeSizes, 1))

    const nodesMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        varying float vPulse;
        uniform float uTime;
        uniform float uPixelRatio;
        
        void main() {
          vColor = aColor;
          float pulse = sin(uTime * 2.0 + position.x * 0.5 + position.y * 0.3) * 0.5 + 0.5;
          vPulse = pulse;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (1.5 + pulse * 0.8) * uPixelRatio * (150.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vPulse;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.1, 0.5, dist);
          float glow = exp(-dist * 2.0) * (0.5 + vPulse * 0.5);
          float core = exp(-dist * 8.0);
          
          vec3 finalColor = vColor + glow * vec3(0.3, 0.6, 1.0) + core * vec3(1.0);
          gl_FragColor = vec4(finalColor, alpha * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    nodesMaterialRef.current = nodesMaterial

    const connectionPositions: number[] = []
    const connectionColors: number[] = []

    neuralData.connections.forEach(conn => {
      const start = neuralData.nodes[conn.start].position
      const end = neuralData.nodes[conn.end].position
      
      connectionPositions.push(start.x, start.y, start.z, end.x, end.y, end.z)
      
      const color = new THREE.Color().setHSL(0.55, 0.7, 0.5)
      connectionColors.push(color.r, color.g, color.b, color.r, color.g, color.b)
    })

    const connectionsGeometry = new THREE.BufferGeometry()
    connectionsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3))
    connectionsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(connectionColors, 3))

    const connectionsMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    })

    const pulseCount = 60
    const pulsePositions = new Float32Array(pulseCount * 3)
    const pulseColors = new Float32Array(pulseCount * 3)
    const pulseSizes = new Float32Array(pulseCount)

    for (let i = 0; i < pulseCount; i++) {
      pulseSizes[i] = 0.2
      pulseColors[i * 3] = 0.3
      pulseColors[i * 3 + 1] = 0.8
      pulseColors[i * 3 + 2] = 1.0
    }

    const pulsesGeometry = new THREE.BufferGeometry()
    pulsesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pulsePositions, 3))
    pulsesGeometry.setAttribute('aColor', new THREE.Float32BufferAttribute(pulseColors, 3))
    pulsesGeometry.setAttribute('aSize', new THREE.Float32BufferAttribute(pulseSizes, 1))

    const pulsesMaterial = new THREE.ShaderMaterial({
      uniforms: { uPixelRatio: { value: 1 } },
      vertexShader: `
        attribute float aSize;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uPixelRatio;
        
        void main() {
          vColor = aColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = exp(-dist * 2.0);
          float glow = exp(-dist * 4.0);
          
          gl_FragColor = vec4(vColor + glow * vec3(0.5, 0.8, 1.0), alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    pulsesMaterialRef.current = pulsesMaterial

    pulseStatesRef.current = neuralData.pulsePaths.map((path, i) => ({
      progress: Math.random(),
      nodeIndex: 0,
      pathIndex: i
    }))

    return { nodesGeometry, nodesMaterial, connectionsGeometry, connectionsMaterial, pulsesGeometry, pulsesMaterial }
  }, [neuralData])

  useFrame((state, delta) => {
    timeRef.current += delta
    const time = state.clock.elapsedTime

    if (nodesMaterialRef.current) {
      nodesMaterialRef.current.uniforms.uTime.value = time
      nodesMaterialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    }

    if (pulsesRef.current) {
      const positions = pulsesRef.current.geometry.attributes.position.array as Float32Array
      const colors = pulsesRef.current.geometry.attributes.aColor.array as Float32Array
      const sizes = pulsesRef.current.geometry.attributes.aSize.array as Float32Array

      pulseStatesRef.current.forEach((pulseState, i) => {
        const path = neuralData.pulsePaths[pulseState.pathIndex]
        if (!path || path.nodePath.length < 2) return

        pulseState.progress += delta * path.speed
        
        if (pulseState.progress >= 1) {
          pulseState.progress = 0
          pulseState.nodeIndex = (pulseState.nodeIndex + 1) % (path.nodePath.length - 1)
        }

        const nodeIndex = pulseState.nodeIndex
        const startNode = neuralData.nodes[path.nodePath[nodeIndex]]
        const endNode = neuralData.nodes[path.nodePath[nodeIndex + 1]]
        
        if (startNode && endNode) {
          const t = pulseState.progress
          positions[i * 3] = startNode.position.x + (endNode.position.x - startNode.position.x) * t
          positions[i * 3 + 1] = startNode.position.y + (endNode.position.y - startNode.position.y) * t
          positions[i * 3 + 2] = startNode.position.z + (endNode.position.z - startNode.position.z) * t

          colors[i * 3] = path.color.r + Math.sin(time * 3 + i) * 0.2
          colors[i * 3 + 1] = path.color.g + Math.sin(time * 2 + i) * 0.1
          colors[i * 3 + 2] = path.color.b

          sizes[i] = 0.15 + Math.sin(time * 4 + i * 0.5) * 0.08
        }
      })

      pulsesRef.current.geometry.attributes.position.needsUpdate = true
      pulsesRef.current.geometry.attributes.aColor.needsUpdate = true
      pulsesRef.current.geometry.attributes.aSize.needsUpdate = true
      
      if (pulsesMaterialRef.current) {
        pulsesMaterialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
      }
    }
  })

  return (
    <group ref={nodesGroupRef}>
      <lineSegments geometry={connectionsGeometry} material={connectionsMaterial} />
      <points geometry={nodesGeometry} material={nodesMaterial} />
      <points ref={pulsesRef} geometry={pulsesGeometry} material={pulsesMaterial} />
    </group>
  )
}

function Waypoint({ position, scale, index }: { position: [number, number, number], scale: number, index: number }) {
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * (0.15 + index * 0.01)
      ringRef.current.rotation.x = Math.PI / 2
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.12
      ringRef.current.scale.setScalar(pulse * scale)
    }
  })

  return (
    <mesh ref={ringRef} position={position}>
      <torusGeometry args={[1, 0.025, 16, 64]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.25} />
    </mesh>
  )
}

function FloatingStructure({ struct }: { struct: {
  position: [number, number, number]
  rotation: number
  scale: number
  type: number
  speed: number
  color: string
}}) {
  const groupRef = useRef<THREE.Group>(null)

  const geometry = useMemo(() => {
    switch (struct.type) {
      case 0: return new THREE.IcosahedronGeometry(struct.scale, 0)
      case 1: return new THREE.OctahedronGeometry(struct.scale, 0)
      case 2: return new THREE.DodecahedronGeometry(struct.scale, 0)
      default: return new THREE.TetrahedronGeometry(struct.scale, 0)
    }
  }, [struct.type, struct.scale])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.elapsedTime * struct.speed * 0.3
      groupRef.current.rotation.y = state.clock.elapsedTime * struct.speed
      groupRef.current.rotation.z = state.clock.elapsedTime * struct.speed * 0.15
    }
  })

  return (
    <group ref={groupRef} position={struct.position} rotation={[struct.rotation, struct.rotation * 0.5, 0]}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={struct.color} transparent opacity={0.08} />
      </mesh>
      <lineSegments geometry={new THREE.EdgesGeometry(geometry)}>
        <lineBasicMaterial color={struct.color} transparent opacity={0.4} />
      </lineSegments>
    </group>
  )
}