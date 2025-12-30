"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar as CalendarIcon, Loader2, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const bookingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    persons: z.coerce.number().min(1, "At least 1 person required"),
    date: z.string().refine((val) => new Date(val) > new Date(), {
        message: "Date must be in the future",
    }),
    timeSlot: z.string().min(1, "Please select a time slot"),
})

type BookingFormValues = z.infer<typeof bookingSchema>

const timeSlots = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
    "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
]

export default function BookingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
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

    async function onSubmit(data: BookingFormValues) {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to submit booking")
            }

            setIsSuccess(true)
        } catch (error) {
            console.error(error)
            alert("Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <Card className="w-full max-w-md mx-auto border-none shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-800">Booking Confirmed!</h2>
                    <p className="text-muted-foreground">
                        Thank you for booking your Velliangiri Hills guide. We will contact you shortly to confirm the details.
                    </p>
                    <Button
                        className="mt-4 bg-green-700 hover:bg-green-800"
                        onClick={() => {
                            setIsSuccess(false)
                            window.location.reload()
                        }}
                    >
                        Book Another
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto border-none shadow-xl bg-white/90 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-2xl text-center text-green-900">Book Your Guide</CardTitle>
                <CardDescription className="text-center text-green-700/80">
                    Plan your spiritual journey to Velliangiri Hills
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-green-900">Full Name</Label>
                        <Input id="name" placeholder="John Doe" {...register("name")} className="border-green-200 focus-visible:ring-green-500" />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-green-900">Phone Number</Label>
                        <Input id="phone" placeholder="+91 98765 43210" {...register("phone")} className="border-green-200 focus-visible:ring-green-500" />
                        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="persons" className="text-green-900">Number of Persons</Label>
                        <Input
                            id="persons"
                            type="number"
                            min={1}
                            {...register("persons")}
                            className="border-green-200 focus-visible:ring-green-500"
                        />
                        {errors.persons && <p className="text-red-500 text-xs">{errors.persons.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-green-900">Date</Label>
                            <div className="relative">
                                <Input
                                    id="date"
                                    type="date"
                                    {...register("date")}
                                    className="border-green-200 focus-visible:ring-green-500 w-full"
                                />
                            </div>
                            {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timeSlot" className="text-green-900">Time Slot</Label>
                            <Select onValueChange={(val) => {
                                setValue("timeSlot", val)
                                trigger("timeSlot")
                            }}>
                                <SelectTrigger className="border-green-200 focus:ring-green-500">
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                            {slot}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Hidden input to register Select with hook-form since select doesn't use native input ref directly the same way */}
                            <input type="hidden" {...register("timeSlot")} />

                            {errors.timeSlot && <p className="text-red-500 text-xs">{errors.timeSlot.message}</p>}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 mt-4 transition-all duration-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Confirm Booking"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
