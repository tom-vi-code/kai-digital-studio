"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

function LetterReveal({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`inline-block ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.04,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

function FloatingShape({
  color,
  size,
  left,
  top,
  delay = 0,
}: {
  color: string;
  size: number;
  left: string;
  top: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left,
        top,
        background: color,
        filter: "blur(80px)",
      }}
      animate={{
        y: [0, -30, 0, 30, 0],
        x: [0, 20, 0, -20, 0],
        scale: [1, 1.1, 1, 0.9, 1],
      }}
      transition={{
        duration: 12,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function Home() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#758bee]">
        <FloatingShape color="rgba(232,128,229,0.3)" size={500} left="-10%" top="-10%" />
        <FloatingShape color="rgba(39,24,126,0.3)" size={400} left="70%" top="60%" delay={3} />
        <FloatingShape color="rgba(201,206,244,0.2)" size={300} left="50%" top="10%" delay={6} />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none mb-6">
            <LetterReveal text="KAI DIGITAL" />
            <br />
            <LetterReveal text="STUDIO" className="text-[#c9cef4]" />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <p className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase mb-10 text-white/80">
              Customized Websites
            </p>
            <motion.a
              href="#about"
              className="inline-block px-16 py-7 bg-[#e880e5] text-white rounded-2xl font-semibold tracking-wider uppercase text-lg shadow-lg shadow-[#e880e5]/30"
              whileHover={{ scale: 1.08, boxShadow: "0 20px 40px rgba(232,128,229,0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Explore
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
