"use client"

import { useState, useEffect, useRef } from 'react'
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence, useInView, useSpring } from "framer-motion"
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
  PhoneCall,
  Zap,
  TrendingUp,
  ListFilter,
  Mountain as MountainIcon
} from "lucide-react"

// Sacred SVG Components
const TrishulIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20M12 2L8 6M12 2l4 4M5 8c0 4 3 7 7 7s7-3 7-7" />
    <path d="M8 15v2M16 15v2" />
  </svg>
)

const CrescentMoon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
)

const ThirdEye = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" className="fill-current animate-pulse" />
    <path d="M12 5v2M12 17v2M5 12h2M17 12h2" className="opacity-40" />
  </svg>
)


import BookingForm from "@/components/BookingForm"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GalleryItem {
  _id: string
  url: string
  caption: string
  category: string
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const bookingRef = useRef<HTMLDivElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const cursorX = useSpring(0, { stiffness: 500, damping: 28 })
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 })

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [cursorX, cursorY])

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
              { name: 'The Hills', href: '#the-journey' },
              { name: 'Trek Routes', href: '#routes' },
              { name: 'Essentials', href: '#essentials' },
              { name: 'FAQ', href: '#faq' },
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

          <div className="flex items-center gap-4">
            <Button
              size="sm"
              onClick={scrollToBooking}
              className="hidden sm:flex bg-green-600 hover:bg-green-500 text-white rounded-full px-6 transition-transform hover:scale-105"
            >
              Book Now
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "p-2 rounded-xl transition-colors md:hidden",
                isScrolled ? "text-neutral-900 hover:bg-neutral-100" : "text-white hover:bg-white/10"
              )}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-neutral-100 overflow-hidden"
            >
              <nav className="flex flex-col gap-6 p-6">
                {[
                  { name: 'The Hills', href: '#the-journey' },
                  { name: 'Trek Routes', href: '#routes' },
                  { name: 'Essentials', href: '#essentials' },
                  { name: 'FAQ', href: '#faq' },
                  { name: 'Safety', href: '#safety' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      setIsMenuOpen(false)
                      if (item.href.startsWith('#')) {
                        e.preventDefault()
                        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="text-2xl font-black text-neutral-900 hover:text-green-600 transition-colors italic tracking-tighter"
                  >
                    {item.name}
                  </a>
                ))}
                <div className="h-px bg-neutral-100 my-4" />
                <Button
                  onClick={() => {
                    setIsMenuOpen(false)
                    scrollToBooking()
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl h-14 text-lg font-bold mt-4"
                >
                  Book My Visit Now
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cinematic Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Velligiri Hills Sacred Vista"
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
              Experience the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-200 to-green-300">
                Holy Journey
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium italic">
              "A peaceful climb up the seven mountains to find inner calm."
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="py-4 border-y border-white/10 w-fit"
            >
              <p className="text-[10px] font-black tracking-[0.6em] text-emerald-400 uppercase">ॐ नमः शिवाय</p>
            </motion.div>

            <p className="text-xl md:text-2xl text-neutral-200 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-xl opacity-90">
              Walk up the seven holy mountains. A simple trip that brings you closer to God.
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
            id="registration"
            ref={bookingRef}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl mx-auto lg:mr-0 relative"
          >
            <div className="absolute -inset-4 md:-inset-10 bg-gradient-to-tr from-green-500/10 to-emerald-500/10 rounded-[60px] blur-3xl" />
            <div className="relative bg-white/40 backdrop-blur-3xl p-2 md:p-3 rounded-[32px] md:rounded-[40px] border border-white/40 shadow-[-20px_40px_100px_rgba(0,0,0,0.2)]">
              <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] p-6 md:p-10 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('/trek_path.png')] opacity-10 grayscale mix-blend-overlay scale-110 group-hover:scale-125 transition-transform duration-[5s]" />
                  <div className="relative z-10 space-y-2 md:space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-300">
                      <ShieldCheck className="w-3 h-3" /> Secure Reservation
                    </div>
                    <h3 className="font-black text-3xl md:text-4xl text-white tracking-tighter italic">Reserve Your <span className="text-emerald-300">Slot</span></h3>
                    <p className="text-emerald-100/60 text-sm font-medium italic">Limited groups per day for peak safety & serenity.</p>
                  </div>
                </div>
                <div className="p-6 md:p-10">
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
                History
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-neutral-900 tracking-tighter italic leading-none">
                The History of <br /><span className="text-green-600">Velliangiri</span>
              </h2>
              <div className="space-y-6">
                <p className="text-xl text-neutral-600 font-medium leading-relaxed italic border-l-4 border-green-500 pl-8">
                  Known as the "Seven Hills" of the Western Ghats, this beautiful mountain range in Coimbatore, Tamil Nadu, is also called the <span className="text-emerald-700 font-black">“Little Kailash”</span>.
                </p>
                <p className="text-neutral-500 leading-relaxed font-bold">
                  The climb is more than just a walk; it’s a journey that tests your body and mind. Whether you come for the adventure or for Lord Shiva, the reward at the top is a view you will never forget.
                </p>
                <p className="text-neutral-400 text-sm italic">
                  Imagine green fields stretching forever, tiny villages like colorful pebbles, and a shiny river winding through the landscape, sparkling in the sunrise. This is the reward waiting for you.
                </p>
              </div>

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
                src="/adiyogi.png"
                alt="Sacred Legacy"
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

      {/* Trekking Routes Section - Detailed 4 Leg Guide */}
      <section id="routes" className="py-48 bg-white relative overflow-hidden">
        {/* Background Parallax Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-green-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Topographic Lines Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,200 Q250,150 500,200 T1000,200" fill="none" stroke="#10b981" strokeWidth="0.5" />
            <path d="M0,400 Q250,350 500,400 T1000,400" fill="none" stroke="#10b981" strokeWidth="0.5" />
            <path d="M0,600 Q250,550 500,600 T1000,600" fill="none" stroke="#10b981" strokeWidth="0.5" />
            <path d="M0,800 Q250,750 500,800 T1000,800" fill="none" stroke="#10b981" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="container px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-32 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.4em] text-emerald-800 uppercase">The Seven Peaks Journey</span>
            </motion.div>
            <h2 className="text-6xl md:text-[10rem] font-black text-neutral-900 tracking-tighter leading-[0.8] italic">
              Conquer the <br /><span className="text-green-600">Sacred Path</span>
            </h2>
            <p className="text-xl text-neutral-500 font-medium italic max-w-2xl leading-relaxed">
              "Every hill is a lesson, every step a prayer. Experience the transformative ascent of Velliangiri."
            </p>
          </div>

          <div className="relative">
            {/* The Path Graphic */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent -z-10 hidden lg:block" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  id: "01",
                  title: "1st Hill",
                  subtitle: "Vellai Vinayagar",
                  diff: "Moderate",
                  time: "1.5 Hours",
                  desc: "Start your ascent through stone-paved steps. A traditional tea shop awaits at the top to bless your beginning.",
                  image: "/trek_path.png",
                  accent: "emerald"
                },
                {
                  id: "02",
                  title: "2nd Hill",
                  subtitle: "Azhagar Kovil",
                  diff: "Challenging",
                  time: "1.5 Hours",
                  desc: "The terrain shifts to loose gravel and steeper tilts. Discover the Siddar caves hidden in the mist.",
                  image: "/steps_7th_hill.png",
                  accent: "green"
                },
                {
                  id: "03",
                  title: "3rd Hill",
                  subtitle: "Bamboo Forest",
                  diff: "Moderate",
                  time: "1.5 Hours",
                  desc: "Walk through whispering bamboo groves and dense shola forests. The air turns cold and sacred here.",
                  image: "/adiyogi.png",
                  accent: "blue"
                },
                {
                  id: "07",
                  title: "7th Hill",
                  subtitle: "Lord Shiva's Peak",
                  diff: "EXTREME",
                  time: "5-6 Hours",
                  desc: "The final push across the ridge. Reach the self-manifested lingams as the sun breaks over the peaks.",
                  image: "/temple_shrine.png",
                  accent: "amber"
                }
              ].map((route, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.8 }}
                  className="group relative h-[500px] flex flex-col justify-end p-10 rounded-[56px] overflow-hidden border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] cursor-default"
                >
                  {/* Background Image with Overlay */}
                  <Image
                    src={route.image}
                    alt={route.title}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Info Overlay */}
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-6xl font-black text-white/20 italic tracking-tighter">{route.id}</span>
                      <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{route.diff}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">{route.subtitle}</p>
                      <h3 className="text-4xl font-black text-white italic tracking-tighter leading-none">{route.title}</h3>
                    </div>

                    <p className="text-white/60 text-sm font-medium leading-relaxed italic line-clamp-2 md:line-clamp-none transition-all duration-700">
                      {route.desc}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-black text-white uppercase">{route.time}</span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:rotate-45 transition-all">
                        <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Getting There & Training Info */}
          <div className="mt-32 grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white p-12 rounded-[50px] shadow-2xl border border-emerald-100 space-y-8"
            >
              <h3 className="text-4xl font-black text-neutral-900 italic tracking-tighter flex items-center gap-4">
                <MapPin className="w-8 h-8 text-green-600" /> Getting There
              </h3>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase">By Bus</div>
                  <p className="text-sm font-bold text-neutral-600 leading-relaxed md:h-12 overflow-hidden">
                    3-4 hours from Coimbatore. Inquire for "Poondi (Velliangiri)" at the bus stand.
                  </p>
                  <p className="text-xs font-black text-emerald-600">Cost: ₹50 - ₹80</p>
                </div>
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase">By Car</div>
                  <p className="text-sm font-bold text-neutral-600 leading-relaxed md:h-12 overflow-hidden">
                    4-5 hours from Coimbatore. Search for "Poondi Village" in your GPS maps.
                  </p>
                  <p className="text-xs font-black text-emerald-600 italic">Download offline maps!</p>
                </div>
              </div>
              <div className="pt-6 border-t border-neutral-100">
                <p className="text-sm font-medium text-neutral-500 italic">
                  <strong>P.S.</strong> Poondi Village has guesthouses starting from ₹300 per night. You can also book cottages at the Isha Foundation.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white p-12 rounded-[50px] shadow-2xl border border-emerald-100 space-y-8"
            >
              <h3 className="text-4xl font-black text-neutral-900 italic tracking-tighter flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-green-600" /> Training & Fitness
              </h3>
              <p className="text-neutral-500 font-medium leading-relaxed italic">
                Think of your body like a car. Prepare it for the road so you can truly enjoy the scenery!
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-1">Stamina</h4>
                    <p className="text-[11px] font-bold text-neutral-500">Run regularly and hike small hills 4-6 weeks before.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                    <ListFilter className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-1">Strength</h4>
                    <p className="text-[11px] font-bold text-neutral-500">Focus on squats, lunges, and climbing stairs.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Bento Gallery - The "Next Level" UI */}
      <section id="gallery" className="py-40 bg-neutral-950 text-white relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container px-6 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
            <div className="max-w-2xl space-y-6">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-green-500 font-black tracking-[0.5em] text-[10px] uppercase"
              >
                Visual Devotion
              </motion.span>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">
                Photos of the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Journey</span>
              </h2>
            </div>
            <p className="text-neutral-400 text-xl font-medium max-w-sm border-l-2 border-white/10 pl-8 italic">
              Capturing the essence of the Western Ghats and the spirit of the trek.
            </p>
          </div>

          {/* Dynamic Gallery logic */}
          {(() => {
            const defaultImages = [
              { url: "/sunrise_view.png", caption: "Dawn at Velligiri", category: "The Peak", span: "md:col-span-2 md:row-span-2" },
              { url: "/trek_path.png", caption: "The Western Ghats", category: "Soul Trail", span: "md:col-span-1" },
              { url: "/steps_7th_hill.png", caption: "Divine Ascent", category: "Effort", span: "md:col-span-1" },
              { url: "/temple_shrine.png", caption: "Eternal Shrine", category: "Sanctum", span: "md:col-span-2" }
            ];

            const displayItems = galleryItems.length > 0 ? galleryItems.slice(0, 4).map((item: any, i: number) => ({
              url: item.url,
              caption: item.caption,
              category: item.category,
              span: i === 0 ? "md:col-span-2 md:row-span-2" : i === 3 ? "md:col-span-2" : "md:col-span-1"
            })) : defaultImages;

            return (
              <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[1000px] md:h-[700px]">
                {displayItems.map((item: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "relative rounded-[32px] overflow-hidden group border border-white/10",
                      item.span
                    )}
                  >
                    <Image
                      src={item.url}
                      alt={item.caption}
                      fill
                      className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-10 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-green-400 font-bold uppercase tracking-widest text-xs mb-2">{item.category}</span>
                      <h3 className="text-2xl font-black">{item.caption}</h3>
                    </div>
                    {/* Minimalist constant label for first item */}
                    {i === 0 && (
                      <div className="absolute top-8 left-8 bg-green-600/20 backdrop-blur-md border border-green-500/30 px-4 py-2 rounded-full">
                        <span className="text-green-400 font-bold uppercase tracking-widest text-[10px]">Featured View</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* NEW: Sacred Summit Section */}
      <section id="the-summit" className="py-32 bg-white relative overflow-hidden">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-8"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold tracking-widest uppercase">
                Reach the Top
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-neutral-900 leading-[1] tracking-tighter">
                The Seventh Hill:<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500 italic">
                  Swami Mudi
                </span>
              </h2>
              <p className="text-xl text-neutral-600 leading-relaxed font-medium">
                Reach the top of the seventh hill to see a beautiful natural place. Here, three big rocks form a holy cave where <span className="text-emerald-700 font-bold">Lord Shiva</span> stays. It is where you feel God's presence after your long walk.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "The Holy Cave",
                    desc: "A natural cave made of big rocks that has been a place of worship for ages.",
                    icon: MountainIcon
                  },
                  {
                    title: "The Five Lingams",
                    desc: "Lord Shiva is seen here as five natural stones that represent the world around us.",
                    icon: ShieldCheck
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 p-6 rounded-[32px] bg-neutral-50 border border-neutral-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="w-7 h-7 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-neutral-900 mb-1">{item.title}</h4>
                      <p className="text-neutral-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -inset-10 bg-emerald-500/5 blur-[120px] rounded-full" />

              {/* Creative Visual: The Divine Cave */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-neutral-900 aspect-video rounded-[36px] overflow-hidden shadow-2xl flex items-center justify-center group-hover:bg-black transition-colors duration-700">
                  {/* CSS Based Lingam Representation */}
                  <div className="absolute inset-0 opacity-40">
                    <Image src="/temple_shrine.png" alt="Cave" fill className="object-cover brightness-[0.3]" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      animate={{
                        boxShadow: ["0 0 20px #10b981", "0 0 60px #10b981", "0 0 20px #10b981"],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-16 h-28 bg-gradient-to-b from-neutral-800 to-black rounded-t-full rounded-b-md border border-emerald-500/30 relative flex items-center justify-center"
                    >
                      <div className="absolute top-1/4 w-full h-px bg-emerald-500/20 blur-sm" />
                      <div className="absolute top-1/2 w-full h-px bg-emerald-500/20 blur-sm" />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full blur-[2px] animate-pulse" />
                    </motion.div>
                    <div className="mt-6 text-center">
                      <p className="text-emerald-400 font-black text-xs tracking-[0.3em] uppercase opacity-70">Holy Presence</p>
                      <p className="text-white/40 text-[10px] uppercase font-bold mt-1">Five Natural Holy Lingams</p>
                    </div>
                  </div>
                  {/* Ambient Mist */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mt-8">
                <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-xl border-4 border-white">
                  <Image src="/steps_7th_hill.png" alt="Summit Path" fill className="object-cover" />
                  <div className="absolute inset-0 bg-neutral-900/10 hover:bg-transparent transition-colors duration-700" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* NEW: Sacred Map Section - Journey through the 7 Peaks */}
      <section id="map" className="py-24 bg-[#fcfdfd] relative overflow-hidden">
        <div className="container px-6 mx-auto">
          <div className="bg-neutral-900 rounded-[56px] p-12 md:p-24 relative overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-transparent" />
            <div className="relative z-10 text-center space-y-12">
              <div className="space-y-4">
                <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">The Seven Sacred Peaks</h3>
                <p className="text-emerald-400/60 font-medium tracking-[0.3em] uppercase text-xs">A topographic map of your transcendence</p>
              </div>
              <SevenPeaksMap className="w-full max-w-5xl mx-auto opacity-80" />
              <div className="grid grid-cols-2 md:grid-cols-7 gap-4 pt-12 border-t border-white/5">
                {["Kari Malai", "Velli Malai", "Nilgiri", "Sundara Malai", "Siddhar Malai", "Brahma Malai", "Swami Mudi"].map((name, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-white font-black text-[12px] italic">{name}</p>
                    <p className="text-neutral-500 font-bold text-[8px] uppercase tracking-widest leading-none">Peak {i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Essentials for the Ascent - Reimagined as a Gear Checklist */}
      <section id="essentials" className="py-48 bg-neutral-900 relative overflow-hidden">
        {/* Sacred Geometry / Tech Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.5" fill="#10b981" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
          </svg>
        </div>

        <div className="container px-6 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-3xl space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.5em] uppercase"
              >
                The Gear Protocol
              </motion.div>
              <h2 className="text-6xl md:text-[8rem] font-black text-white tracking-tighter leading-[0.8] italic">
                Pack Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Sacred Kit</span>
              </h2>
            </div>
            <p className="text-emerald-100/40 text-xl font-medium italic max-w-sm mb-6 border-l-2 border-emerald-500/30 pl-8">
              "Preparation is the first step of devotion. Carry only what your soul needs."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Sacred Attire",
                items: [
                  { name: "Quick-dry Breathable Mesh", note: "Stay cool during the forest climb" },
                  { name: "Pro Hiking Shoes", note: "Essential for the 7th hill ridge" },
                  { name: "Mist Protection Cape", note: "Sudden Shola rain protection" }
                ],
                icon: ShieldCheck,
                delay: 0.1
              },
              {
                title: "Ascension Tools",
                items: [
                  { name: "30L Ergonomic Pack", note: "Weight distribution is key" },
                  { name: "Lumen-Max Headlamp", note: "For 3 AM night starts" },
                  { name: "Solar Power Core", note: "Keep your connection alive" }
                ],
                icon: Zap,
                delay: 0.2
              },
              {
                title: "Vitals & Grace",
                items: [
                  { name: "Med-Kit Essentials", note: "Basic bandages & balms" },
                  { name: "Ultra-Guard SPF", note: "Summit sun is intense" },
                  { name: "Mineral Hydration", note: "2-3L water is mandatory" }
                ],
                icon: Heart,
                delay: 0.3
              }
            ].map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: group.delay, duration: 0.8 }}
                className="group relative bg-white/5 backdrop-blur-3xl p-12 rounded-[64px] border border-white/10 hover:border-emerald-500/30 transition-all duration-700 overflow-hidden"
              >
                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 rounded-3xl bg-neutral-800 flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-500 shadow-2xl overflow-hidden relative">
                    <group.icon className="w-8 h-8 text-white z-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-3xl font-black text-white italic tracking-tight">{group.title}</h3>
                </div>

                <div className="space-y-8">
                  {group.items.map((item, idx) => (
                    <div key={idx} className="relative pl-8 group/item">
                      <CheckCircle2 className="absolute left-0 top-1 w-5 h-5 text-emerald-500/30 group-hover/item:text-emerald-400 transition-colors" />
                      <p className="text-lg font-black text-white/90 italic leading-none">{item.name}</p>
                      <p className="text-[10px] font-bold text-emerald-400/40 uppercase tracking-widest mt-2">{item.note}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Hydration & Fuel Cards */}
          <div className="mt-24 grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[56px] bg-gradient-to-br from-emerald-500 to-green-700 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <CloudRain className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4 text-center md:text-left relative z-10">
                <h4 className="text-3xl font-black italic tracking-tighter">Stay Hydrated</h4>
                <p className="text-emerald-50/80 font-bold leading-relaxed">Pack at least 3 liters of water. Natural springs at Hill 3 & 5 are sacred and refillable.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[56px] bg-neutral-950 text-white border border-white/5 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="w-24 h-24 rounded-full bg-amber-500/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                <Zap className="w-10 h-10 text-amber-500" />
              </div>
              <div className="space-y-4 text-center md:text-left relative z-10">
                <h4 className="text-3xl font-black italic tracking-tighter">Peak Energy</h4>
                <p className="text-white/40 font-bold leading-relaxed">Pack high-density fuel: Almonds, dates, and organic granola bars keep your vibration high.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Sacred Questions Accordion */}
      <section id="faq" className="py-48 bg-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 right-[5%] w-64 h-64 border border-emerald-100 rounded-full animate-[spin_20s_linear_infinite]" />
        <div className="absolute bottom-20 left-[5%] w-96 h-96 border border-emerald-50 rounded-full animate-[spin_30s_linear_infinite]" />

        <div className="container px-6 mx-auto">
          <div className="flex flex-col lg:flex-row gap-24">
            <div className="lg:w-1/3 space-y-12 shrink-0">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black tracking-[0.4em] uppercase"
                >
                  Universal Wisdom
                </motion.div>
                <h2 className="text-6xl md:text-8xl font-black text-neutral-900 tracking-tighter leading-[0.8] italic uppercase">
                  Sacred <br /><span className="text-green-600">Questions</span>
                </h2>
                <p className="text-xl text-neutral-500 font-medium italic leading-relaxed max-w-sm">
                  Clarify your path with the wisdom of the hills. Everything you need to know before the ascent.
                </p>
              </div>

              <div className="relative p-10 rounded-[56px] bg-neutral-950 text-white overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-transparent" />
                <div className="relative z-10 space-y-6">
                  <Sun className="w-12 h-12 text-emerald-400 group-hover:rotate-90 transition-transform duration-1000" />
                  <h4 className="text-2xl font-black tracking-tight">Prime Trekking Season</h4>
                  <p className="text-white/60 font-medium italic">February to May offers the clearest skies and most divine sunrises.</p>
                  <div className="w-fit px-4 py-2 rounded-xl bg-white/10 text-[10px] font-black tracking-[0.2em] uppercase border border-white/10">
                    Registration Open
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-4">
              {[
                {
                  q: "How difficult is the spirit-walk?",
                  a: "Completing all 7 hills is a formidable test of will. It involves steep stone-paved steps and rugged forest trails. Beginners are advised to pace themselves and reach the limits of their comfort.",
                  icon: Users
                },
                {
                  q: "How long is the journey to the peak?",
                  a: "A round trip usually spans 12 to 14 hours. We recommend starting at midnight to reach the 7th hill for a sunrise that will transform your perspective forever.",
                  icon: Clock
                },
                {
                  q: "What are the essential carry-ons?",
                  a: "Pack breathable layers, sturdy hiking gear, a 300+ lumen headlamp, 3L water, and high-energy natural snacks. Travel light, as the mountain asks for focus, not weight.",
                  icon: Zap
                },
                {
                  q: "Staying near the foundation?",
                  a: "Poondi Village offers charming guesthouses. For a deeper spiritual immersion, we recommend booking a cottage at the Isha Foundation nearby.",
                  icon: MapPin
                }
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <button
                    className="w-full text-left p-12 rounded-[48px] bg-neutral-50 border border-neutral-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-500 flex items-start gap-8"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-emerald-900/5 transition-all">
                      <faq.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-2xl font-black text-neutral-900 tracking-tight italic group-hover:text-emerald-700 transition-colors uppercase">{faq.q}</h4>
                      <p className="text-neutral-500 font-bold leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-96 transition-all duration-700 italic border-l-2 border-emerald-200 pl-6">
                        {faq.a}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety: Guardian Protocols */}
      <section id="safety" className="py-48 bg-neutral-900 text-white relative overflow-hidden">
        {/* Abstract Safety Grid */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="container px-6 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-32 gap-12">
            <div className="max-w-2xl space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-emerald-500/30 text-emerald-400 text-[10px] font-black tracking-[0.5em] uppercase"
              >
                Guardian Shield
              </motion.div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8] italic uppercase">
                Divine <br /><span className="text-emerald-500">Protection</span>
              </h2>
            </div>
            <p className="text-neutral-400 font-bold max-w-sm italic border-l-2 border-emerald-500/20 pl-8">
              "We watch the mountain, so you can watch your breath. Your safety is our primary devotion."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Expert Pathfinders",
                desc: "Climb with locals who have ascended these peaks over 500 times. They know every stone and soul of the mountain.",
                status: "Live Tracking"
              },
              {
                icon: CloudRain,
                title: "Weather Wisdom",
                desc: "We monitor peak-altitude pressure & wind. Instant path closures ensure zero risk during unpredictable Shola mist.",
                status: "Real-time Ops"
              },
              {
                icon: Heart,
                title: "Ethical Ascent",
                desc: "100% Plastic-free mission. Our guardians ensure the mountain remains as pure as the prayers offered to it.",
                status: "Earth Guardian"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-12 rounded-[64px] bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-700 relative overflow-hidden"
              >
                <div className="w-20 h-20 rounded-3xl bg-neutral-800 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-2xl">
                  <f.icon className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter">{f.title}</h3>
                <p className="text-neutral-400 leading-relaxed font-bold opacity-80 mb-10 italic">{f.desc}</p>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">{f.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Symbols: Icons of Transcendence */}
      <section id="symbols" className="py-48 bg-white relative overflow-hidden">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-32">
            <div className="space-y-8">
              <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-none">
                The <span className="text-emerald-600">Sacred</span> <br />Geometry
              </h2>
              <p className="text-neutral-400 font-bold tracking-[1em] uppercase text-xs">Visions from the summit</p>
            </div>

            <div className="grid md:grid-cols-3 gap-24">
              {[
                {
                  icon: TrishulIcon,
                  name: "Trishula",
                  meaning: "Will • Know • Act",
                  color: "text-rose-600",
                  bg: "bg-rose-50"
                },
                {
                  icon: CrescentMoon,
                  name: "Chandra",
                  meaning: "Infinite Time",
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                {
                  icon: ThirdEye,
                  name: "Trinetra",
                  meaning: "Inner Sight",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50"
                }
              ].map((symbol, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center group"
                >
                  <div className={cn("w-36 h-36 rounded-[48px] flex items-center justify-center mb-10 transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 shadow-2xl shadow-transparent group-hover:shadow-emerald-900/10", symbol.bg)}>
                    <symbol.icon className={cn("w-16 h-16", symbol.color)} />
                  </div>
                  <h3 className="text-3xl font-black italic uppercase mb-2">{symbol.name}</h3>
                  <p className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">{symbol.meaning}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Sacred Call - Reimagined as a Cinematic Outro */}
      <section className="py-64 bg-neutral-950 relative overflow-hidden text-center">
        {/* Deep Field background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-neutral-950 to-black" />

        {/* Animated Energy Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.02, 0.1],
                rotate: i * 120
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-[600px] h-[600px] border border-emerald-500/20 rounded-full"
              style={{ padding: i * 40 }}
            />
          ))}
        </div>

        {/* Parallax Mountain Silhouette */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="absolute inset-x-0 bottom-0 h-[60%] z-0"
        >
          <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="w-full h-full fill-emerald-500/20">
            <path d="M0,400 L200,100 L400,300 L600,50 L800,250 L1000,100 L1000,400 Z" />
          </svg>
        </motion.div>

        <div className="container px-6 mx-auto relative z-10 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex justify-center mb-12">
              <motion.div
                animate={{
                  filter: ["drop-shadow(0 0 10px #10b981)", "drop-shadow(0 0 30px #10b981)", "drop-shadow(0 0 10px #10b981)"],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30"
              >
                <TrishulIcon className="w-12 h-12 text-emerald-400" />
              </motion.div>
            </div>

            <h2 className="text-7xl md:text-[10rem] font-black text-white tracking-tighter italic leading-[0.8] mb-8">
              The Mountain <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-200 to-emerald-600">is Calling</span>
            </h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              transition={{ delay: 0.5 }}
              className="text-emerald-100/60 text-2xl md:text-3xl font-medium italic max-w-3xl mx-auto leading-relaxed"
            >
              "Don't search for God, God is already looking for you on the seventh peak."
            </motion.p>
          </motion.div>

          <div className="pt-24 relative">
            <motion.div
              animate={{
                opacity: [0.2, 0.5, 0.2],
                y: [0, 10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex flex-col items-center gap-4"
            >
              <div className="w-px h-24 bg-gradient-to-b from-transparent via-emerald-500 to-transparent" />
              <p className="text-[10px] font-black tracking-[1.5em] text-emerald-500/50 uppercase">Satyam Shivam Sundaram</p>
            </motion.div>
          </div>
        </div>

        {/* Ambient Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: 0
              }}
              animate={{
                y: [null, "-20%"],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full"
            />
          ))}
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
              Helping people reach the seven mountains safely and with love for God.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-widest text-xs uppercase">Quick Links</h4>
            <ul className="space-y-4 font-medium italic">
              <li><a href="#safety" className="hover:text-green-500 transition-colors">Safety Protocols</a></li>
              <li><a href="#registration" className="hover:text-green-500 transition-colors">How to Book</a></li>
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
        <div className="container px-6 mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8 opacity-20 hover:opacity-100 transition-opacity duration-1000">
            <span className="text-xs font-black tracking-[0.5em] uppercase">SHIVA</span>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
            <span className="text-xs font-black tracking-[0.5em] uppercase">SHAKTI</span>
          </div>
          <p className="text-sm font-bold opacity-30 tracking-widest uppercase">Om Namah Shivaya</p>
          <p className="text-xs font-medium text-neutral-600 italic tracking-wide text-center md:text-right">© {new Date().getFullYear()} Velligiri Hills. Crafted for the human soul seeking the divine mountain.</p>
        </div>
      </footer>
    </main>
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

function SevenPeaksMap({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 1000 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
        <defs>
          <linearGradient id="mapGradient" x1="0" y1="0" x2="1000" y2="0">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Topographic Lines */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          d="M0,250 Q150,230 300,250 T600,250 T1000,250"
          stroke="url(#mapGradient)"
          strokeWidth="1"
          strokeOpacity="0.2"
        />
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
          d="M0,200 Q200,150 400,200 T800,200 T1000,200"
          stroke="url(#mapGradient)"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* The 7 Peaks Path */}
        <motion.path
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "anticipate" }}
          d="M50,250 L150,200 L300,220 L450,150 L600,180 L750,100 L950,50"
          stroke="url(#mapGradient)"
          strokeWidth="4"
          filter="url(#glow)"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Peak Markers */}
        {[
          { x: 50, y: 250, label: "1" },
          { x: 150, y: 200, label: "2" },
          { x: 300, y: 220, label: "3" },
          { x: 450, y: 150, label: "4" },
          { x: 600, y: 180, label: "5" },
          { x: 750, y: 100, label: "6" },
          { x: 950, y: 50, label: "7" }
        ].map((p, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2 + (i * 0.2), type: "spring" }}
          >
            <circle cx={p.x} cy={p.y} r="8" fill="#10b981" />
            <circle cx={p.x} cy={p.y} r="15" stroke="#10b981" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 4" />
            <text x={p.x} y={p.y - 20} fill="#10b981" fontSize="12" fontWeight="900" textAnchor="middle">{p.label}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  )
}
