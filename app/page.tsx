"use client"

import { useState, useEffect, useRef } from 'react'
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion"
import {
  ShieldCheck,
  Users,
  Heart,
  ChevronRight,
  MapPin,
  Clock,
  CloudRain,
  Sun,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  CalendarCheck2,
  PhoneCall
} from "lucide-react"

import BookingForm from "@/components/BookingForm"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const bookingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <main className="min-h-screen font-sans text-neutral-900 bg-neutral-50 selection:bg-green-200 selection:text-green-900 overflow-x-hidden">

      {/* Premium Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-neutral-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
              <MountainIcon className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-neutral-900' : 'text-white'}`}>
              Velligiri<span className="text-green-500">Hills</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: 'The Journey', href: '#the-journey' },
              { name: 'Gallery', href: '#gallery' },
              { name: 'Process', href: '#process' },
              { name: 'Safety', href: '#safety' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`text-sm font-semibold transition-colors ${isScrolled ? 'text-neutral-600 hover:text-green-600' : 'text-white/80 hover:text-white'}`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          <Button
            size="sm"
            onClick={scrollToBooking}
            className="bg-green-600 hover:bg-green-500 text-white rounded-full px-6 transition-transform hover:scale-105"
          >
            Book Now
          </Button>
        </div>
      </header>

      {/* Cinematic Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <Image
            src="/sunrise_view.png"
            alt="Velligiri Hills Sunrise"
            fill
            priority
            className="object-cover object-center brightness-[0.7] transition-transform duration-[2s] hover:scale-105"
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-neutral-50" />
        </motion.div>

        <div className="container relative z-10 px-6 grid lg:grid-cols-2 gap-16 items-center pt-24">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 text-white text-center lg:text-left"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-green-300 shadow-2xl"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Season Open: Jan - May 2026</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1] drop-shadow-2xl italic">
              Experience <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-200 to-green-300">
                Pure Divinity
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-neutral-200 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-xl opacity-90">
              Traverse the seven sacred hills. A journey beyond the physical, into the very heart of South India's spiritual crown.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
              <Button
                size="lg"
                onClick={scrollToBooking}
                className="bg-green-600 hover:bg-green-500 text-white rounded-full px-10 h-14 text-lg font-bold shadow-[0_20px_40px_rgba(22,163,74,0.3)] transition-all hover:translate-y-[-4px]"
              >
                Start Your Journey
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Floating Form Card */}
          <motion.div
            ref={bookingRef}
            initial={{ opacity: 0, y: 100, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg mx-auto lg:mr-0 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-green-500/20 to-emerald-500/20 rounded-[40px] blur-3xl" />
            <div className="relative bg-white/5 backdrop-blur-2xl p-2 rounded-[32px] border border-white/20 shadow-[-20px_40px_80px_rgba(0,0,0,0.3)]">
              <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-6 text-center">
                  <h3 className="font-black text-2xl text-white tracking-tight">Reserve Your Slot</h3>
                  <p className="text-green-300/80 text-sm font-medium mt-1">Limited groups per day for peak safety</p>
                </div>
                <div className="p-8">
                  <BookingForm />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Discover More</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        </motion.div>
      </section>

      {/* Stats / Journey Info */}
      <section id="the-journey" className="py-32 bg-white relative overflow-hidden">
        <div className="container px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-bold tracking-widest uppercase">
                The Heritage
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-neutral-900 leading-[1.1]">
                Beyond the <br />Seventh Hill
              </h2>
              <p className="text-xl text-neutral-600 leading-relaxed font-medium">
                The Velligiri Hills, popularly known as the "Thenkailayam" or the Kailash of the South, are located at an altitude of 6000 ft in the Western Ghats. This isn't just a trek; it's a centuries-old tradition of devotion.
              </p>

              <div className="grid grid-cols-2 gap-10 pt-8">
                {[
                  { label: "Elevation", value: "6,000 ft", icon: MountainIcon },
                  { label: "Total Steps", value: "6,000+", icon: StepsIcon },
                  { label: "Trail Length", value: "8.5 km", icon: MapPin },
                  { label: "Difficulty", value: "Extreme", icon: ShieldCheck },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                      <item.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-neutral-900">{item.value}</div>
                      <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl group"
            >
              <Image
                src="/trek_path.png"
                alt="Sacred Path"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                <div className="text-white space-y-2">
                  <h4 className="text-2xl font-black">The Dense Sholas</h4>
                  <p className="text-white/80 font-medium">Lush greenery and wild trails that test your spirit.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Bento Gallery - The "Next Level" UI */}
      <section id="gallery" className="py-32 bg-neutral-950 text-white relative">
        <div className="container px-6 mx-auto">
          <div className="max-w-3xl mb-20 space-y-4">
            <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
              A Glimpse into <span className="text-green-500">Eternity</span>
            </h2>
            <p className="text-neutral-400 text-xl font-medium">Captured moments of endurance, faith, and breathtaking beauty.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[1000px] md:h-[700px]">
            {/* Main Feature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="md:col-span-2 md:row-span-2 relative rounded-[32px] overflow-hidden group border border-white/10"
            >
              <Image src="/hero.png" alt="Majestic Peaks" fill className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex flex-col justify-end">
                <span className="text-green-400 font-bold uppercase tracking-widest text-xs mb-2">The Summit</span>
                <h3 className="text-4xl font-black">Mount Velligiri Hills</h3>
              </div>
            </motion.div>

            {/* Side Items with Interactive Hover */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="md:col-span-1 relative rounded-[32px] overflow-hidden group border border-white/10"
            >
              <Image src="/adiyogi.png" alt="Adiyogi Statue" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1 relative rounded-[32px] overflow-hidden group border border-white/10"
            >
              <Image src="/steps_7th_hill.png" alt="The Steps" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 relative rounded-[32px] overflow-hidden group border border-white/10"
            >
              <Image src="/temple_shrine.png" alt="Summit Shrine" fill className="object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-black">Sacred Shrine</h3>
                <p className="text-neutral-400 font-medium">Where the heavens meet the earth.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW: Process Section */}
      <section id="process" className="py-32 bg-neutral-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        <div className="container px-6 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-bold tracking-widest uppercase">
              The Path
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900">How to Join</h2>
            <p className="text-neutral-500 font-medium italic">Simplicity is the first step towards divinity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-neutral-200 -z-0" />

            {[
              {
                step: "01",
                icon: CalendarCheck2,
                title: "Choose Your Date",
                desc: "Select your preferred slot between January and May. Group sizes are fixed at 12 to ensure survival safety."
              },
              {
                step: "02",
                icon: CheckCircle2,
                title: "Official Verification",
                desc: "Our team reviews your details and assigns a certified local guide for your specific group batch."
              },
              {
                step: "03",
                icon: MountainIcon,
                title: "The Summit",
                desc: "Depart from the Poondi base camp with your group. Reach the seventh hill to witness the sacred lingam."
              }
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 bg-white p-10 rounded-[40px] border border-neutral-100 shadow-xl shadow-neutral-200/50 group hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="absolute -top-6 left-10 bg-green-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-green-900/20">
                  {p.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center mb-6 group-hover:bg-green-50 group-hover:scale-110 transition-all">
                  <p.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-black mb-4">{p.title}</h3>
                <p className="text-neutral-500 leading-relaxed font-medium">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features - Safety */}
      <section id="safety" className="py-32 bg-white">
        <div className="container px-6 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black">Safety Above All</h2>
            <p className="text-neutral-500 font-medium">Equipped for the extreme, prepared for the divine.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Expert Survival Guides",
                desc: "Certified trekkers with extensive knowledge of the Western Ghats terrain and emergency response.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: Users,
                title: "Curated Group Batches",
                desc: "We maintain small, intimate group sizes for personalized care, better pace control, and spiritual focus.",
                color: "bg-green-50 text-green-600"
              },
              {
                icon: Heart,
                title: "Spiritual Preparedness",
                desc: "Pre-trek ritual guidance and cultural insights for a deeper experience that respects the mountain's sanctity.",
                color: "bg-rose-50 text-rose-600"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 rounded-[40px] bg-neutral-50 border border-neutral-100 hover:bg-white hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-2xl ${f.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                <p className="text-neutral-500 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-500 py-20 border-t border-white/5">
        <div className="container px-6 mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <MountainIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white italic">Velligiri<span className="text-green-500">Hills</span></span>
            </div>
            <p className="max-w-sm text-lg font-medium">
              Empowering pilgrims to reach the sacred seventh hill with safety, dignity, and devotion.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase">Quick Links</h4>
            <ul className="space-y-4 font-medium italic">
              <li><a href="#safety" className="hover:text-green-500 transition-colors">Safety Protocols</a></li>
              <li><a href="#process" className="hover:text-green-500 transition-colors">How to Book</a></li>
              <li><a href="/admin/login" className="hover:text-green-500 transition-colors">Admin Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase">Location</h4>
            <p className="font-medium italic">
              Base Camp Office,<br />
              Poondi, Tamil Nadu 641114<br />
              India
            </p>
          </div>
        </div>
        <div className="container px-6 mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold opacity-30 tracking-widest uppercase">Om Namah Shivaya</p>
          <p className="text-sm">© {new Date().getFullYear()} Velligiri Hills Trekking Services. Designed for Pilgrims.</p>
        </div>
      </footer>
    </main>
  )
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}

function StepsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h4v-4h4v-4h4v-4h4" />
    </svg>
  )
}
