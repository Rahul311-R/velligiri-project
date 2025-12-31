"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar as CalendarIcon, Loader2, CheckCircle2, Clock, Users, User, Phone, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const bookingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    persons: z.coerce.number().min(1, "At least 1 person required").max(20, "Max 20 persons per group"),
    date: z.string().refine((val) => {
        const selected = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
    }, {
        message: "Date cannot be in the past",
    }),
    timeSlot: z.string().min(1, "Please select a time slot"),
})

type BookingFormValues = z.infer<typeof bookingSchema>

export default function BookingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [timeHour, setTimeHour] = useState("")
    const [timePeriod, setTimePeriod] = useState("AM")

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            persons: 1,
            name: "",
            phone: "",
            date: "",
            timeSlot: "",
        },
    })

    const router = useRouter()
    const watchDate = watch("date")

    async function onSubmit(data: BookingFormValues) {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error("Failed to submit booking")

            const params = new URLSearchParams({
                name: data.name,
                date: new Date(data.date).toLocaleDateString(),
                persons: data.persons.toString(),
                timeSlot: data.timeSlot
            })
            router.push(`/confirmation?${params.toString()}`)
        } catch (error) {
            console.error(error)
            alert("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Full Name</Label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-emerald-500 transition-colors" />
                            <Input
                                id="name"
                                placeholder="Enter your full name"
                                {...register("name")}
                                className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                            />
                        </div>
                        {errors.name && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Phone Number</Label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-emerald-500 transition-colors" />
                            <Input
                                id="phone"
                                placeholder="Enter phone number"
                                {...register("phone")}
                                className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                            />
                        </div>
                        {errors.phone && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.phone.message}</p>}
                    </div>
                </div>

                {/* Date & Persons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Date of Journey</Label>
                        <div className="relative group">
                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-emerald-500 transition-colors" />
                            <Input
                                id="date"
                                type="date"
                                {...register("date")}
                                className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold cursor-pointer"
                            />
                        </div>
                        {errors.date && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.date.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="persons" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Number of Persons</Label>
                        <div className="relative group">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-emerald-500 transition-colors" />
                            <Input
                                id="persons"
                                type="number"
                                min={1}
                                max={20}
                                {...register("persons")}
                                className="h-14 pl-12 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                            />
                        </div>
                        {errors.persons && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.persons.message}</p>}
                    </div>
                </div>

                {/* Time Selection - 12 Hour Format */}
                <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Preferred Trek Time</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative group">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-emerald-500 transition-colors z-10" />
                            <select
                                value={timeHour}
                                onChange={(e) => {
                                    setTimeHour(e.target.value)
                                    const fullTime = e.target.value ? `${e.target.value} ${timePeriod}` : ""
                                    setValue("timeSlot", fullTime, { shouldValidate: true })
                                }}
                                className="h-14 pl-12 pr-4 w-full rounded-2xl border-2 border-neutral-100 bg-neutral-50/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold cursor-pointer appearance-none text-neutral-900"
                            >
                                <option value="">Hour</option>
                                {Array.from({ length: 12 }, (_, i) => {
                                    const hour = i + 1
                                    return <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>
                                })}
                            </select>
                        </div>
                        <div className="relative group">
                            <select
                                value={timePeriod}
                                onChange={(e) => {
                                    setTimePeriod(e.target.value)
                                    const fullTime = timeHour ? `${timeHour} ${e.target.value}` : ""
                                    setValue("timeSlot", fullTime, { shouldValidate: true })
                                }}
                                className="h-14 px-4 w-full rounded-2xl border-2 border-neutral-100 bg-neutral-50/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold cursor-pointer appearance-none text-neutral-900"
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    </div>
                    <input type="hidden" {...register("timeSlot")} />
                    {errors.timeSlot && <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.timeSlot.message}</p>}
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest ml-1">Select hour (1-12) and AM/PM for your arrival</p>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 rounded-[24px] bg-gradient-to-r from-green-900 to-emerald-900 hover:from-black hover:to-neutral-900 text-white font-black text-lg transition-all shadow-2xl shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing Your Booking...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span>CONFIRM MY BOOKING</span>
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                        )}
                    </Button>
                    <p className="text-center mt-6 text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Om Namah Shivaya</p>
                </div>
            </form>
        </div>
    )
}
