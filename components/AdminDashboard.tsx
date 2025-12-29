"use client"

import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { parse, addHours } from "date-fns"
import { Loader2, LogOut, Check, X, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { cn } from "@/lib/utils"

interface Booking {
    _id: string
    name: string
    phone: string
    persons: number
    date: string
    timeSlot: string
    status: 'pending' | 'approved' | 'rejected' | 'completed'
}

export default function AdminDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchBookings()
    }, [])

    async function fetchBookings() {
        try {
            const res = await fetch("/api/bookings")
            if (res.status === 401) {
                router.push("/admin/login")
                return
            }
            const data = await res.json()
            setBookings(data)
        } catch (error) {
            console.error("Failed to fetch bookings", error)
        } finally {
            setLoading(false)
        }
    }

    async function updateStatus(id: string, status: string) {
        try {
            await fetch(`/api/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            setIsDialogOpen(false)
            fetchBookings() // Refresh
        } catch (error) {
            console.error("Failed to update status", error)
        }
    }

    async function deleteBooking(id: string) {
        if (!confirm("Are you sure you want to delete this booking?")) return;
        try {
            await fetch(`/api/bookings/${id}`, {
                method: "DELETE",
            })
            setIsDialogOpen(false)
            fetchBookings()
        } catch (error) {
            console.error("Failed to delete", error)
        }
    }

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
    }

    const events = bookings.map(booking => {
        // Parse date and time for FullCalendar
        // timeSlot example: "06:00 AM"
        const dateStr = new Date(booking.date).toISOString().split('T')[0]
        let startDateTime = new Date(`${dateStr}T00:00:00`)

        try {
            const timeParts = parse(booking.timeSlot, 'hh:mm aa', new Date())
            const hours = timeParts.getHours()
            const minutes = timeParts.getMinutes()
            startDateTime = new Date(booking.date)
            startDateTime.setHours(hours, minutes, 0)
        } catch (e) {
            // Fallback if parsing fails
        }

        // Color coding
        let color = '#3b82f6' // blue pending
        if (booking.status === 'approved') color = '#22c55e' // green
        if (booking.status === 'rejected') color = '#ef4444' // red
        if (booking.status === 'completed') color = '#6b7280' // gray

        return {
            id: booking._id,
            title: `${booking.name} (${booking.persons})`,
            start: startDateTime,
            // end: addHours(startDateTime, 4), // Assume 4 hour trek? Not specified, default 1h
            extendedProps: { ...booking },
            backgroundColor: color,
            borderColor: color,
        }
    })

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <Button variant="outline" onClick={handleLogout} className="gap-2">
                        <LogOut className="h-4 w-4" /> Logout
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Stats Cards */}
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Bookings</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{bookings.length}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{bookings.filter(b => b.status === 'pending').length}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-600">Approved</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{bookings.filter(b => b.status === 'approved').length}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-600">Today's Treks</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {bookings.filter(b => new Date(b.date).toDateString() === new Date().toDateString()).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Calendar View</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[700px]">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                initialView="dayGridMonth"
                                events={events}
                                eventClick={(info) => {
                                    // @ts-ignore
                                    const booking = info.event.extendedProps as Booking
                                    setSelectedBooking({ ...booking, _id: info.event.id })
                                    setIsDialogOpen(true)
                                }}
                                height="100%"
                                slotMinTime="05:00:00"
                                slotMaxTime="22:00:00"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {selectedBooking && (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                                Review booking information for <b>{selectedBooking.name}</b>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Status:</span>
                                <span className={cn(
                                    "col-span-3 capitalize font-medium",
                                    selectedBooking.status === 'approved' ? "text-green-600" :
                                        selectedBooking.status === 'rejected' ? "text-red-600" :
                                            "text-yellow-600"
                                )}>
                                    {selectedBooking.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Date:</span>
                                <span className="col-span-3">{new Date(selectedBooking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Time:</span>
                                <span className="col-span-3">{selectedBooking.timeSlot}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Persons:</span>
                                <span className="col-span-3">{selectedBooking.persons}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-bold text-right col-span-1">Phone:</span>
                                <span className="col-span-3">{selectedBooking.phone}</span>
                            </div>
                        </div>
                        <DialogFooter className="flex gap-2 sm:justify-start">
                            <div className="flex w-full justify-between">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => deleteBooking(selectedBooking._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => updateStatus(selectedBooking._id, 'rejected')}
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                    <Button
                                        onClick={() => updateStatus(selectedBooking._id, 'approved')}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
}
