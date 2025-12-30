"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShieldCheck, Users, Heart, Star } from "lucide-react"

import BookingForm from "@/components/BookingForm"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen font-sans text-neutral-900 bg-neutral-50 selection:bg-green-200 selection:text-green-900">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with optimized loading */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/velliangiri_hills_3.jpg"
            alt="Velliangiri Hills"
            fill
            priority
            className="object-cover object-center brightness-[0.85]"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-neutral-900/90" />
        </div>

        <div className="container relative z-10 px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 text-white text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-green-300">
              <Star className="h-4 w-4 fill-green-300 text-green-300" />
              <span>Trusted by 10,000+ Pilgrims</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] drop-shadow-2xl">
              Sacred Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">Kailash of the South</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-md">
              Experience the divine energy of Velliangiri Hills. We facilitate your pilgrimage with safe, guided, and organized trekking packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-500 text-white rounded-full px-8 h-12 text-base font-semibold shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105">
                View Packages
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 rounded-full px-8 h-12 text-base backdrop-blur-sm">
                Plan Your Trip
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-md mx-auto lg:mr-0 bg-white/10 backdrop-blur-md p-2 rounded-3xl border border-white/20 shadow-2xl"
          >
            <div className="bg-white/95 rounded-2xl shadow-inner overflow-hidden">
              <div className="bg-green-50 p-4 border-b border-green-100 text-center">
                <h3 className="font-bold text-lg text-green-900">Start Your Pilgrimage</h3>
                <p className="text-sm text-green-700/80">Book your slot for the upcoming season</p>
              </div>
              <div className="p-4">
                <BookingForm />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 animate-bounce"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900">The Seventh Hill Awaits</h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Known as the <span className="font-semibold text-green-700">Thenkailayam</span> (Kailash of the South), the Velliangiri Mountains are one of the most sacred places in India. The trek involves navigating through seven hills with varying terrains, offering a test of endurance and a profound spiritual experience.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-neutral-100 mt-8">
              {[
                { label: "Altitude", value: "6000 ft" },
                { label: "Trek Distance", value: "8 km" },
                { label: "Difficulty", value: "Hard" },
                { label: "Steps", value: "~5000" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl md:text-3xl font-bold text-green-700">{stat.value}</div>
                  <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced Cards */}
      <section className="py-24 bg-neutral-900 text-white relative">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Trek With Us?</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">We ensure your journey is safe, organized, and spiritually fulfilling.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Safety First", desc: "Expert guides and medical assistance support throughout the trail." },
              { icon: Users, title: "Small Groups", desc: "Limited batch sizes to ensure personal attention and a peaceful trek." },
              { icon: Heart, title: "Holistic Experience", desc: "We focus on the spiritual significance of the journey, not just the physical trek." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-neutral-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-green-500/50 transition-colors group"
              >
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-neutral-50">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">Glimpses of the Divine</h2>
            <p className="text-neutral-600">Moments captured by pilgrims on the path.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px] md:h-[500px]">
            {[
              "/velliangiri_1.jpg",
              "/velliangiri_2.png",
              "/velliangiri_hills_3.jpg",
              "/trek_path.png"
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-2xl overflow-hidden shadow-lg group ${i === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
              >
                <Image
                  src={src}
                  alt={`Gallery ${i}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Process Steps */}
      <section className="py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold">Simple 3-Step Process</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-neutral-200 -z-0" />

            {[
              { step: "01", title: "Fill Details", desc: "Enter your personal and group information in the form above." },
              { step: "02", title: "Confirmation", desc: "Wait for admin approval. You will receive a WhatsApp message." },
              { step: "03", title: "Trek Day", desc: "Report to the base camp with your ID proof and essentials." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-6 relative z-10 text-center group"
              >
                <div className="w-24 h-24 mx-auto bg-green-50 rounded-full flex items-center justify-center text-3xl font-black text-green-600 mb-6 border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-neutral-500 text-sm max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-white/10">
        <div className="container px-4 mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Velliangiri Trekking Services. All rights reserved.</p>
          <p className="text-sm mt-2 opacity-50">Om Namah Shivaya</p>
        </div>
      </footer>
    </main>
  )
}
