"use client";

import { useEffect, useState, useRef } from "react";

export default function AvantGardeGastronomy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCourse, setActiveCourse] = useState(0);
  const [mouseShadow, setMouseShadow] = useState({ x: 50, y: 50 });
  const [menuScale, setMenuScale] = useState(0);

  // Tracks smooth coordinate translation for ambient porcelain shading
  const handleShadowMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    setMouseShadow({ x: xPercent, y: yPercent });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setMenuScale(scrolled * 0.05);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main
      ref={containerRef}
      onMouseMove={handleShadowMove}
      style={{
        background: `radial-gradient(circle at ${mouseShadow.x}% ${mouseShadow.y}%, #fbfbfc 0%, #edeef2 80%)`,
      }}
      className="relative text-[#19191b] font-serif antialiased selection:bg-[#19191b] selection:text-white min-h-[220vh] p-8 md:p-16 transition-all duration-300 ease-out"
    >
      {/* Editorial Structural Border Framing */}
      <div className="fixed inset-0 pointer-events-none z-50 border-[20px] border-[#fbfbfc]" />
      <div className="fixed top-8 left-12 right-12 flex justify-between font-mono text-[9px] uppercase tracking-[0.3em] text-[#848588] z-40">
        <div>Atelier Gastronomique // Act IX</div>
        <div>Kyoto — Paris // Allocation Secure</div>
      </div>

      {/* ASYMMETRIC MINIMALIST HERO PHASE */}
      <section className="relative min-h-screen w-full flex flex-col justify-center max-w-6xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-8">
            <span className="block font-mono text-[10px] uppercase tracking-[0.5em] text-[#848588]">
              // Sensory Substance Lab
            </span>
            <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-[0.85] uppercase text-[#19191b]">
              Culinary <br />
              <span className="italic font-normal text-[#6f7074]">
                Primitives
              </span>
            </h1>
          </div>
          <div className="lg:col-span-4 pb-4">
            <p className="font-mono text-[10px] text-[#5c5d60] leading-loose uppercase tracking-widest border-l border-[#19191b]/20 pl-6">
              Discarding decorative artifice. Crafting extreme spatial flavors
              calibrated precisely to clean environmental atmospheric pressure
              matrices.
            </p>
          </div>
        </div>
      </section>

      {/* MULTI-STAGED VOLUMETRIC MANIFESTO ROW */}
      <section className="py-36 max-w-6xl mx-auto z-20 border-t border-[#19191b]/10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Interactive Menu Matrix */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-[9px] text-[#848588] tracking-widest block font-bold">
              // THE COURSE STRUCTURE
            </span>

            {[
              {
                id: "01",
                name: "Cryo-Preserved Juniper Air",
                component: "Atmospheric Caviar",
              },
              {
                id: "02",
                name: "Monolithic Sea Urchin Core",
                component: "Isotropic Slate Base",
              },
              {
                id: "03",
                name: "Decompressed Birch Extract",
                component: "Resonance Fluid",
              },
            ].map((course, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveCourse(idx)}
                className="group border-b border-[#19191b]/10 pb-6 cursor-pointer"
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[10px] text-[#848588]">
                    0{course.id}
                  </span>
                  <h3
                    className={`text-xl uppercase transition-all duration-300 ${activeCourse === idx ? "font-bold tracking-tight text-[#19191b]" : "font-light tracking-wide text-[#848588] group-hover:text-[#19191b]"}`}
                  >
                    {course.name}
                  </h3>
                </div>
                <div className="flex justify-between items-center mt-2 overflow-hidden h-0 group-hover:h-4 transition-all duration-300">
                  <span className="font-mono text-[9px] text-[#6f7074] uppercase tracking-wider">
                    {course.component}
                  </span>
                  <span className="font-mono text-[9px] text-[#19191b]">
                    // LOADED
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Editorial Visual Placeholder Mask */}
          <div className="lg:col-span-7 h-[55vh] border border-[#19191b]/15 bg-[#fbfbfc]/80 backdrop-blur-md shadow-2xl rounded-sm p-8 flex flex-col justify-between overflow-hidden relative group">
            <div className="flex justify-between font-mono text-[9px] text-[#848588]">
              <span>[ PORCELAIN_STAGE_VIEWPORT ]</span>
              <span>PLATE_DEFORM_OFFSET: {menuScale.toFixed(1)}PX</span>
            </div>

            {/* Asymmetric Morphing Geometric Framework Plate */}
            <div className="relative w-full h-48 flex items-center justify-center">
              <div
                className="w-40 h-40 border border-[#19191b]/30 rounded-full bg-[#f4f5f9] absolute transition-all duration-700 ease-out shadow-[inset_0_10px_30px_rgba(0,0,0,0.03)]"
                style={{
                  transform: `scale(${1 + activeCourse * 0.05}) rotate(${menuScale}deg)`,
                  borderRadius:
                    activeCourse === 0
                      ? "50%"
                      : activeCourse === 1
                        ? "48% 52% 45% 55%"
                        : "52% 48% 55% 45%",
                }}
              />
              <div className="w-1.5 h-1.5 bg-[#19191b] rounded-full absolute opacity-60 animate-ping" />
            </div>

            <div className="font-mono text-[9px] text-[#5c5d60] flex justify-between items-center border-t border-[#19191b]/10 pt-4">
              <span>ACTIVE_PLATE_INDEX: Course_0{activeCourse + 1}</span>
              <span className="uppercase tracking-widest text-[#19191b]">
                Tasting_Live
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
