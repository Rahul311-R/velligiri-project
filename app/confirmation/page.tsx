"use client"

import { motion } from "framer-motion"
import { CheckCircle2, ChevronRight, MountainIcon, Calendar, Users, Clock, ShieldCheck, Heart, MapPin, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

import Image from "next/image"

// Reusable Sacred SVGs
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

function ConfirmationContent() {
    const searchParams = useSearchParams()
    const [bookingDetails, setBookingDetails] = useState({
        name: "",
        date: "",
        persons: "",
        timeSlot: ""
    })

    useEffect(() => {
        setBookingDetails({
            name: searchParams.get("name") || "Pilgrim",
            date: searchParams.get("date") || "Scheduled",
            persons: searchParams.get("persons") || "0",
            timeSlot: searchParams.get("timeSlot") || "Morning"
        })
    }, [searchParams])

    return (
        <div className="min-h-screen bg-[#fcfdfd] font-sans text-neutral-900 selection:bg-emerald-100 relative overflow-hidden flex flex-col items-center py-12 px-6">
            {/* Spiritual Background elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-50/40 blur-[140px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-50/50 blur-[120px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" fill="currentColor" />
                    </svg>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-4xl space-y-8"
            >
                {/* Main Confirmation Card */}
                <div className="bg-white border border-emerald-100 rounded-[48px] shadow-[0_40px_100px_rgba(0,120,80,0.06)] overflow-hidden">
                    <div className="min-h-[300px] relative flex flex-col items-center justify-center p-12 text-center overflow-hidden">
                        {/* Dramatic Image Background */}
                        <Image
                            src="/sunrise_view.png"
                            alt="Sacred Sunrise"
                            fill
                            className="object-cover brightness-[0.4]"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent" />

                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                                className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mb-8 shadow-2xl"
                            >
                                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                            </motion.div>
                            <h1 className="text-5xl font-black text-white tracking-tighter mb-3 italic">
                                Booking <span className="text-emerald-300 not-italic uppercase font-bold text-4xl ml-2">Confirmed</span>
                            </h1>
                            <p className="text-emerald-100/90 text-lg font-medium max-w-md mx-auto">
                                Your visit to the holy seven mountains is now booked. We are waiting to see you.
                            </p>
                        </div>
                    </div>

                    <div className="p-12 space-y-12">
                        {/* Booking Summary Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Name", value: bookingDetails.name, icon: Heart },
                                { label: "Persons", value: `${bookingDetails.persons} People`, icon: Users },
                                { label: "Date", value: bookingDetails.date, icon: Calendar },
                                { label: "Time", value: bookingDetails.timeSlot, icon: Clock },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <p className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em]">{item.label}</p>
                                    <div className="flex items-center gap-2">
                                        <item.icon className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <p className="text-xl font-black text-neutral-900 truncate">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-emerald-50 w-full" />

                        {/* Spiritual & Safety Guidelines */}
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-neutral-900 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-emerald-700" />
                                    </div>
                                    Simple Rules for You
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { t: "Eat light food", d: "Eating simple food will help you climb the mountain easily." },
                                        { t: "Keep Quiet", d: "Try to walk quietly to enjoy the peace of the mountain." },
                                        { t: "Carry Camphor (Karpuram)", d: "To use for prayer at each of the seven holy peaks." }
                                    ].map((p, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                            <div>
                                                <p className="font-bold text-neutral-900 text-sm">{p.t}</p>
                                                <p className="text-xs text-neutral-500 font-medium">{p.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 bg-stone-50 p-8 rounded-[32px] border border-stone-100 relative overflow-hidden group">
                                <MapPin className="absolute -right-4 -bottom-4 w-32 h-32 text-stone-200/50 group-hover:scale-110 transition-transform duration-700" />
                                <h3 className="text-xl font-black text-neutral-900 flex items-center gap-3 relative z-10">
                                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                    Climb Details
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-100">
                                        <span className="text-sm font-bold text-neutral-500">Total Distance</span>
                                        <span className="font-black text-emerald-700">17 km (Full Trip)</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-100">
                                        <span className="text-sm font-bold text-neutral-500">Height</span>
                                        <span className="font-black text-emerald-700">4,200 ft high</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-100">
                                        <span className="text-sm font-bold text-neutral-500">Estimated Trek</span>
                                        <span className="font-black text-emerald-700">8 - 10 Hours</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 relative">
                            <Link href="/">
                                <Button className="w-full h-20 rounded-[28px] bg-neutral-950 hover:bg-black text-white font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-4 group">
                                    Go Back Home
                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <p className="text-center mt-6 text-xs text-neutral-400 font-bold italic">
                                "When your heart is pure, you can find God anywhere."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative Footer Graphics - Replaced with Sacred SVGs */}
                <div className="flex justify-center items-center gap-12 opacity-40 group transition-all duration-700">
                    <TrishulIcon className="w-12 h-12 text-neutral-900 group-hover:rotate-12 transition-transform" />
                    <div className="h-px bg-neutral-300 grow" />
                    <div className="flex flex-col items-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-900 whitespace-nowrap">OM NAMAH SHIVAYA</p>
                        <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Sacred Seven Hills</p>
                    </div>
                    <div className="h-px bg-neutral-300 grow" />
                    <CrescentMoon className="w-12 h-12 text-neutral-900 group-hover:-rotate-12 transition-transform" />
                </div>
            </motion.div>
        </div>
    )
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="animate-pulse text-green-600 font-black tracking-widest uppercase text-2xl italic">
                    Loading your details...
                </div>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    )
}
