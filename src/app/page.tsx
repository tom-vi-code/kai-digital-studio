"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";

/* ──────────────────────────────────────────────
   REUSABLE ANIMATION WRAPPERS
   ────────────────────────────────────────────── */

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
}

function FadeSlideIn({
  children,
  direction = "up",
  delay = 0,
  className = "",
  once = true,
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-100px" });

  const dirs = {
    up: { x: 0, y: 80 },
    down: { x: 0, y: -80 },
    left: { x: -120, y: 0 },
    right: { x: 120, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: dirs[direction].x, y: dirs[direction].y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScaleReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.7, rotate: -3 }}
      animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function LetterReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
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

function WordReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: "easeOut",
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.3,
}: {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y: smoothY }} className="w-full h-[120%] -mt-[10%]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
    </div>
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

/* ──────────────────────────────────────────────
   HORIZONTAL SCROLL COUNTER
   ────────────────────────────────────────────── */

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
    >
      {inView && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <CountUpInner target={target} suffix={suffix} />
        </motion.span>
      )}
    </motion.span>
  );
}

function CountUpInner({ target, suffix }: { target: number; suffix: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  if (typeof window !== "undefined" && !startedRef.current) {
    startedRef.current = true;
    requestAnimationFrame(() => {
      let current = 0;
      const step = target / 40;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        if (nodeRef.current) {
          nodeRef.current.textContent = Math.round(current) + suffix;
        }
      }, 30);
    });
  }

  return <span ref={nodeRef}>0{suffix}</span>;
}

/* ──────────────────────────────────────────────
   TESTIMONIALS DATA
   ────────────────────────────────────────────── */

const testimonials = [
  {
    quote:
      "Allie approaches website building with the utmost professionalism and talent. Her unique ability is combining an intricate knowledge of software development which makes her websites technologically seamless, but she also brings an understanding of design and layout that make her websites beautiful.",
    author: "Stephanie W.",
  },
  {
    quote:
      "Allie Hittinger is the real deal! I came to her with some Squarespace spacing and functionality issues on my real estate website. She took a look and provided thoughtful advice for how best to improve the website. I\u2019m amazed at Allie\u2019s attention to detail, organization, and promptness. She got everything done for me in record time, and she truly went above and beyond.",
    author: "Melanie E.",
  },
  {
    quote:
      "Allie truly made my website dreams come to life! As a creative, it was great to work with someone who took the time to understand my brand, vision for my website, and target audience. The website she created is both user-friendly and visually appealing \u2014 perfect for my needs!",
    author: "Dani C.",
  },
  {
    quote:
      "It has been a privilege working with one of most driven engineers I have ever met. Allie brings an expert design touch to websites. Everything Allie touches turns to gold. She is incredibly talented and a lot of fun to talk to.",
    author: "Louis S.",
  },
  {
    quote:
      "Allie is a powerhouse of talent and innovation. She blends top-tier software engineering with cutting-edge design to create applications that are both visually stunning and seamlessly engaging. Beyond her technical expertise, Allie\u2019s remarkable ability to connect with clients ensures that every project is delivered on time, within budget, and exceeds expectations.",
    author: "Paul S.",
  },
  {
    quote:
      "Allie Hittinger is one of my favorite developers to work with. We partnered for years in the consulting world and I always had full faith in her ability to both execute on her own designs or lead a team. She is very gifted in managing the intersection of frontend development and UI/UX design patterns.",
    author: "Jacques D.",
  },
];

/* ──────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────── */

export default function Home() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.8], [1, 0.85]);
  const heroY = useTransform(heroScroll, [0, 1], [0, 200]);

  return (
    <main>
      {/* ─── NAVBAR ─── */}
      <NavBar />

      {/* ═══════════════════════════════════════════
          SLIDE 1: HERO
          ═══════════════════════════════════════════ */}
      <Section className="bg-[#758bee]" id="home">
        <div ref={heroRef} className="absolute inset-0" />
        <FloatingShape color="rgba(232,128,229,0.3)" size={500} left="-10%" top="-10%" />
        <FloatingShape color="rgba(39,24,126,0.3)" size={400} left="70%" top="60%" delay={3} />
        <FloatingShape color="rgba(201,206,244,0.2)" size={300} left="50%" top="10%" delay={6} />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
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
              className="inline-block px-14 py-6 bg-[#e880e5] text-white rounded-full font-semibold tracking-wider uppercase text-base shadow-lg shadow-[#e880e5]/30"
              whileHover={{ scale: 1.08, boxShadow: "0 20px 40px rgba(232,128,229,0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Explore
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          SLIDE 2: TAGLINE / WHAT I DO
          ═══════════════════════════════════════════ */}
      <Section className="bg-[#27187e]">
        <FloatingShape color="rgba(117,139,238,0.2)" size={400} left="80%" top="20%" delay={2} />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <FadeSlideIn direction="up">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-tight">
              CUSTOMIZED <span className="text-[#e880e5]">WEBSITES.</span>
            </h2>
          </FadeSlideIn>
          <FadeSlideIn direction="up" delay={0.2}>
            <h3 className="text-xl md:text-2xl font-light tracking-[0.25em] uppercase text-[#c9cef4] mb-8">
              By a Software Developer / Architect
            </h3>
          </FadeSlideIn>
          <FadeSlideIn direction="up" delay={0.4}>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              I specialize in creating custom websites that are visually stunning,
              user-friendly, and tailored to your unique goals. Whether you need a
              brand-new site or a redesign, I&apos;m here to bring your vision to life
              with creative solutions and modern technologies.
            </p>
          </FadeSlideIn>
          <FadeSlideIn direction="up" delay={0.6}>
            <motion.a
              href="#connect"
              className="inline-block mt-10 px-14 py-6 border-2 border-[#e880e5] text-[#e880e5] rounded-full font-semibold tracking-wider uppercase text-base"
              whileHover={{
                backgroundColor: "#e880e5",
                color: "#ffffff",
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              Connect With Me
            </motion.a>
          </FadeSlideIn>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          SLIDE 3: QUICK FIXES
          ═══════════════════════════════════════════ */}
      <Section className="bg-[#e880e5]">
        <FloatingShape color="rgba(255,255,255,0.15)" size={350} left="5%" top="10%" delay={1} />
        <FloatingShape color="rgba(39,24,126,0.2)" size={300} left="75%" top="65%" delay={4} />
        <div className="relative z-10 px-6 max-w-5xl w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <ScaleReveal>
                <h2 className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-2">
                  Quick
                </h2>
              </ScaleReveal>
              <ScaleReveal delay={0.15}>
                <h2 className="text-6xl md:text-8xl font-bold tracking-tight leading-none mb-2">
                  Fixes,
                </h2>
              </ScaleReveal>
              <ScaleReveal delay={0.3}>
                <h2 className="text-6xl md:text-8xl font-bold tracking-tight leading-none text-[#27187e]">
                  Big Impact.
                </h2>
              </ScaleReveal>
            </div>
            <FadeSlideIn direction="right" delay={0.3}>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Already have a website but it needs some love? I offer website fixes
                and enhancements to improve performance, design, and user experience
                — without a full rebuild. From mobile issues to content updates and
                layout tweaks, I&apos;ll make your site work better for your business.
              </p>
            </FadeSlideIn>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          SLIDE 4: ABOUT THE FOUNDER
          ═══════════════════════════════════════════ */}
      <Section className="bg-[#c9cef4]" id="about">
        <div className="relative z-10 px-6 max-w-6xl w-full">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeSlideIn direction="left">
              <ParallaxImage
                src="/images/allie-webflow.png"
                alt="Allie Kai Hittinger"
                className="relative rounded-[24px] overflow-hidden aspect-[3/4] shadow-2xl"
                speed={0.2}
              />
            </FadeSlideIn>

            <div>
              <FadeSlideIn direction="right">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#27187e] mb-2 leading-tight">
                  ABOUT THE
                </h2>
              </FadeSlideIn>
              <FadeSlideIn direction="right" delay={0.1}>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#27187e] mb-6 leading-tight">
                  FOUNDER
                </h2>
              </FadeSlideIn>
              <FadeSlideIn direction="right" delay={0.2}>
                <h3 className="text-xl md:text-2xl font-semibold tracking-wider text-[#758bee] mb-6">
                  ALLIE KAI HITTINGER
                </h3>
              </FadeSlideIn>
              <FadeSlideIn direction="right" delay={0.3}>
                <p className="text-[#27187e]/80 text-lg leading-relaxed mb-8">
                  Hi, I&apos;m Allie! After a decade as a software developer and
                  architect, I launched <em className="font-semibold not-italic text-[#27187e]">Kai Digital Studio</em> to
                  combine my passion for design and development with the flexibility
                  of freelancing. Now, I&apos;m dedicated to creating amazing digital
                  solutions for my incredible clients!
                </p>
              </FadeSlideIn>
              <FadeSlideIn direction="right" delay={0.4}>
                <motion.a
                  href="#connect"
                  className="inline-block px-14 py-6 bg-[#27187e] text-white rounded-full font-semibold tracking-wider uppercase text-base"
                  whileHover={{ scale: 1.08, backgroundColor: "#758bee" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More About Me
                </motion.a>
              </FadeSlideIn>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          SLIDE 5: STATS BAR
          ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#758bee] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: 10, suffix: "+", label: "Years Experience" },
              { num: 50, suffix: "+", label: "Projects Delivered" },
              { num: 100, suffix: "%", label: "Client Satisfaction" },
              { num: 6, suffix: "", label: "Glowing Reviews" },
            ].map((stat, i) => (
              <FadeSlideIn key={i} direction="up" delay={i * 0.15}>
                <div>
                  <p className="text-5xl md:text-6xl font-bold text-white mb-2">
                    <CountUp target={stat.num} suffix={stat.suffix} />
                  </p>
                  <p className="text-white/70 text-sm tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
              </FadeSlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SLIDE 6: TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <Section className="bg-[#27187e] !min-h-0 py-24">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <FadeSlideIn direction="up">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-center mb-16">
              TESTIMONIALS
            </h2>
          </FadeSlideIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeSlideIn key={i} direction="up" delay={i * 0.1}>
                <motion.div
                  className="bg-[#c9cef4] rounded-[20px] p-8 h-full flex flex-col justify-between"
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 60px rgba(117,139,238,0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <svg
                      className="w-8 h-8 text-[#e880e5] mb-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-[#27187e] text-[15px] leading-relaxed mb-6 italic">
                      {t.quote}
                    </p>
                  </div>
                  <p className="text-[#758bee] font-bold tracking-wider text-sm uppercase">
                    {t.author}
                  </p>
                </motion.div>
              </FadeSlideIn>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          SLIDE 7: MY APPROACH
          ═══════════════════════════════════════════ */}
      <Section className="bg-[#ffffff] !min-h-0 py-24" id="approach">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <FadeSlideIn direction="up">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#27187e] text-center mb-20">
              MY APPROACH
            </h2>
          </FadeSlideIn>

          <div className="space-y-0">
            {[
              {
                num: "01",
                title: "DISCOVERY & DESIGN",
                desc: "Conduct a discovery session to define the purpose of the website. We discuss target audience, content requirements, design preferences, and functional needs. I present template options and share drafts for your feedback before full development.",
                color: "#758bee",
              },
              {
                num: "02",
                title: "BUILD & CUSTOMIZE",
                desc: "Create the site\u2019s navigation and key pages. Add client-specific branding elements like logos and custom graphics. Configure features like contact forms, email integrations, or e-commerce. Optimize for SEO and preview across all devices.",
                color: "#e880e5",
              },
              {
                num: "03",
                title: "LAUNCH & SUPPORT",
                desc: "Review the site with you, incorporating final feedback. Connect your domain for secure browsing. I provide a tutorial and written guide, include a post-launch support period, and propose a maintenance plan for ongoing updates.",
                color: "#27187e",
              },
            ].map((phase, i) => (
              <FadeSlideIn key={i} direction={i % 2 === 0 ? "left" : "right"} delay={0.1}>
                <div className="flex flex-col md:flex-row items-start gap-8 py-12 border-b border-[#c9cef4] last:border-0">
                  <motion.div
                    className="text-8xl md:text-9xl font-bold leading-none"
                    style={{ color: phase.color, opacity: 0.25 }}
                    whileInView={{ opacity: 0.25 }}
                    viewport={{ once: true }}
                  >
                    {phase.num}
                  </motion.div>
                  <div className="flex-1">
                    <h3
                      className="text-2xl md:text-3xl font-bold tracking-wider mb-4"
                      style={{ color: phase.color }}
                    >
                      {phase.title}
                    </h3>
                    <p className="text-[#27187e]/70 text-lg leading-relaxed max-w-xl">
                      {phase.desc}
                    </p>
                  </div>
                </div>
              </FadeSlideIn>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          SLIDE 8: CTA / CONNECT
          ═══════════════════════════════════════════ */}
      <Section className="bg-[#27187e]" id="connect">
        <FloatingShape color="rgba(232,128,229,0.25)" size={500} left="60%" top="20%" delay={2} />
        <FloatingShape color="rgba(117,139,238,0.2)" size={400} left="-10%" top="60%" delay={5} />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <FadeSlideIn direction="up">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <WordReveal text="LET'S CREATE SOMETHING" />
              <br />
              <span className="text-[#e880e5]">
                <WordReveal text="AMAZING" delay={0.4} />
              </span>
            </h2>
          </FadeSlideIn>
          <FadeSlideIn direction="up" delay={0.3}>
            <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Ready to bring your vision to life? Whether you need a brand-new
              website, a redesign, or quick fixes to an existing site, I&apos;d love
              to hear from you.
            </p>
          </FadeSlideIn>
          <FadeSlideIn direction="up" delay={0.5}>
            <motion.a
              href="mailto:hello@kaidigitalstudio.com"
              className="inline-block px-16 py-7 bg-[#e880e5] text-white rounded-full font-bold tracking-wider uppercase text-lg shadow-2xl shadow-[#e880e5]/30"
              whileHover={{
                scale: 1.08,
                boxShadow: "0 25px 60px rgba(232,128,229,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get In Touch
            </motion.a>
          </FadeSlideIn>
        </div>
      </Section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 px-6 bg-[#27187e] border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Kai Digital Studio"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-white/70 text-sm tracking-wider font-semibold">
              Kai Digital Studio
            </span>
          </div>
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Kai Digital Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ──────────────────────────────────────────────
   NAVBAR
   ────────────────────────────────────────────── */

function NavBar() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 100], ["rgba(117,139,238,0)", "rgba(39,24,126,0.95)"]);
  const blur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(12px)"]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: bg, backdropFilter: blur }}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <motion.a
          href="#home"
          className="text-white font-bold text-lg tracking-[0.15em] uppercase"
          whileHover={{ scale: 1.05 }}
        >
          Kai Digital Studio
        </motion.a>
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: "About", href: "#about" },
            { label: "Approach", href: "#approach" },
            { label: "Connect", href: "#connect" },
          ].map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="text-white/80 text-sm tracking-[0.2em] uppercase"
              whileHover={{ color: "#e880e5", y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
