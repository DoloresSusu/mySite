# Endless Glide Project Prompt (End-to-End Replication)

## 1. Role Context
You are a senior game designer, creative technologist, and frontend engineer specializing in minimalist aesthetics and procedural generation. Your goal is to build a highly immersive, cinematic web game titled "Endless Glide".

## 2. Core Gameplay Logic
- **Mechanics**: A side-scrolling endless slider. The character moves forward automatically.
- **Controls**: 
  - `Space`: Jump (apply upward force with gravity simulation).
  - `Shift` / `Click` / `Touch`: Accelerate (increase horizontal velocity with friction logic).
- **Physics**: Implement a smooth inertia-based system. Character velocity should have a high ceiling (Max Vx: 25+) for an intense sense of speed.
- **Scoring**: Distance in meters is the primary metric.

## 3. Visual & Aesthetic Specification (Crucial)
- **Style**: Extreme minimalist silhouette style. Use solid black shapes for all foreground elements.
- **Background**:
  - **Dynamic Scenery**: Implement a linear gradient background that transitions smoothly between color stages every 500 meters (e.g., Sunset Pink to Purple, Ocean Blue, Misty Grey).
  - **Atmosphere**: Use CSS/Canvas gradients and blurred UI overlays to create a premium, atmospheric feel.
- **Environment**:
  - **Procedural Terrain**: Generate smooth, curved hills using Perlin or Simplex noise. Increase ruggedness as distance increases.
  - **Parallax Layers**: Implement at least 3 layers of mountain silhouettes to provide depth. Layers should move at different speeds.
  - **Details**: Scatter minimalist pine tree silhouettes along the foreground terrain.
- **Character**: A silhouette of a surfer/rider. Add a solid black ribbon/trail that follows the character's path with a delayed ripple effect.

## 4. UI Specification
- **In-Game Overlay**: 
  - Bold, white, sans-serif font (e.g., Outfit or System Sans).
  - Top-left corner: Display "Distance: [x] m" and "Speed: [x] km/h".
  - Bottom: Subdued control hints ("Space: Jump | Shift: Accel").
- **Start Screen**:
  - Full-screen cinematic title "ENDLESS GLIDE" in oversized font.
  - Minimalist Chinese subtitle "无尽滑行".
  - Pulsing "Press Space or Click to Start" prompt.
- **Game Over**: Blurred backdrop, final distance display, and a "Retry" button.

## 5. Technical Constraints
- **Stack**: Single-file HTML/JS or lightweight modular JS (no heavy engines).
- **Performance**: Use `requestAnimationFrame` for 60fps.
- **Responsiveness**: Enforce a cinematic 12:8 aspect ratio that scales to fit screen width/height.
- **Procedural Rule**: Trees and terrain must be generated on-the-fly, recycling memory by removing off-screen assets.

## 6. Tone & Vibe
Less is more. Avoid colors in the foreground. Focus on fluidity, motion, and the emotional resonance of a changing sky.
