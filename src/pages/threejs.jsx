// App.js
import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, ScrollControls, useScroll, Scroll } from '@react-three/drei'

/**
 * 3D Model Component
 */
function Model(props) {
  const modelRef = useRef()
  const { scene } = useGLTF('/vitap logo export.glb') // Ensure this path is correct
  
  // Get scroll data
  const scroll = useScroll()

  useFrame((state, delta) => {
    // scroll.offset is a value from 0 (top) to 1 (bottom)
    if (modelRef.current) {
      modelRef.current.rotation.z = scroll.offset * Math.PI * 4
    }
  })

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={[0,-1, 0]} // Adjust as needed
      scale={1.5}           // Adjust as needed
      {...props}
    />
  )
}

/**
 * Main App Component
 */
export default function Three() {
  return (
    // ADD THIS WRAPPER
    <div className="h-screen w-screen"> 
      <Canvas
        style={{ background: '#111' }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <ScrollControls pages={3} damping={0.25}>
          
          <Suspense fallback={null}>
            {/* ... 3D lights and model ... */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} />
            <Model />
          </Suspense>

          <Scroll html style={{ width: '100%' }}>
            {/* ... Your h-screen HTML sections ... */}
            <section className="h-screen flex flex-col justify-center items-center text-center p-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                My 3D Showcase
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                Scroll down to see the model rotate.
              </p>
            </section>
            
            <section className="h-screen flex flex-col justify-center items-center text-center p-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                React Three Fiber
              </h2>
            </section>
            
            <section className="h-screen flex flex-col justify-center items-center text-center p-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                The End
              </h2>
            </section>
          </Scroll>
          
        </ScrollControls>
      </Canvas>
    </div> // CLOSE THE WRAPPER
  )
}

// ... (Make sure your Model component is also in the file or imported) ...
