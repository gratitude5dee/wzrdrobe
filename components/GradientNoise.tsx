"use client"

import { useEffect, useRef } from "react"

const fragmentShader = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Improved Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    float time = u_time * 0.2;
    
    // Create multiple layers of noise
    float n1 = snoise(uv * 3.0 + time * vec2(0.1, 0.2));
    float n2 = snoise(uv * 2.0 - time * vec2(0.15, 0.1));
    float n3 = snoise(uv * 4.0 + time * vec2(0.2, -0.1));
    
    // Combine noise layers
    float noise = (n1 + n2 + n3) / 3.0;
    
    // Create dynamic color palette
    vec3 color1 = vec3(0.4, 0.7, 0.9);  // Blue
    vec3 color2 = vec3(0.8, 0.5, 0.9);  // Purple
    vec3 color3 = vec3(0.9, 0.7, 0.4);  // Gold
    vec3 color4 = vec3(0.7, 0.9, 0.7);  // Mint
    
    // Create smooth transitions between colors
    vec3 gradient = mix(
        mix(color1, color2, uv.x + noise * 0.3),
        mix(color3, color4, uv.y + noise * 0.3),
        sin(time) * 0.5 + 0.5
    );
    
    // Add depth and movement
    float depth = snoise(uv * 5.0 + time * 0.1) * 0.3;
    gradient += vec3(depth);
    
    // Add subtle vignette
    float vignette = length(uv - 0.5) * 0.5;
    gradient *= 1.0 - vignette;
    
    // Add mouse interaction glow
    vec2 mouse = u_mouse/u_resolution.xy;
    float mouseDistance = length(uv - mouse);
    float mouseGlow = smoothstep(0.3, 0.0, mouseDistance) * 0.5;
    gradient += vec3(mouseGlow);
    
    gl_FragColor = vec4(gradient, 1.0);
}
`

export function GradientNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    // Create shader program
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    if (!vertexShader || !fragmentShader) return

    // Vertex shader source
    const vsSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `

    // Compile shaders
    gl.shaderSource(vertexShader, vsSource)
    gl.compileShader(vertexShader)
    gl.shaderSource(fragmentShader, fragmentShader)
    gl.compileShader(fragmentShader)

    // Create program
    const program = gl.createProgram()
    if (!program) return

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    // Set up buffers
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    // Get locations
    const positionLocation = gl.getAttribLocation(program, "a_position")
    const timeLocation = gl.getUniformLocation(program, "u_time")
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
    const mouseLocation = gl.getUniformLocation(program, "u_mouse")

    // Animation setup
    const startTime = Date.now()
    let animationFrameId: number

    function render() {
      // Set canvas size
      const width = window.innerWidth * window.devicePixelRatio
      const height = window.innerHeight * window.devicePixelRatio
      canvas.width = width
      canvas.height = height

      // Update viewport
      gl.viewport(0, 0, width, height)

      // Clear and set program
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)

      // Update uniforms
      gl.uniform1f(timeLocation, (Date.now() - startTime) * 0.001)
      gl.uniform2f(resolutionLocation, width, height)
      gl.uniform2f(mouseLocation, mousePos.current.x, mousePos.current.y)

      // Draw
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      animationFrameId = requestAnimationFrame(render)
    }

    function handleMouseMove(event: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      mousePos.current = {
        x: (event.clientX - rect.left) * window.devicePixelRatio,
        y: (rect.height - (event.clientY - rect.top)) * window.devicePixelRatio,
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{
        background: "linear-gradient(45deg, #1a1a1a, #2a2a2a)",
        mixBlendMode: "screen",
      }}
    />
  )
}
