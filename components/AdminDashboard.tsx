"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { parse } from "date-fns"
import * as XLSX from 'xlsx'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
    LayoutDashboard, CalendarRange, ListFilter, LogOut, Check, X, Trash2,
    Search, RefreshCw, Users, TrendingUp, Filter, Clock, Cloud, MountainSnow, FileSpreadsheet
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    CardDescription
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Booking {
    _id: string
    name: string
    phone: string
    persons: number
    date: string
    timeSlot: string
    status: 'pending' | 'approved' | 'rejected' | 'completed'
    createdAt: string
}

export default function AdminDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [mounted, setMounted] = useState(false)
    const [currentTime, setCurrentTime] = useState<string>("")
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
        fetchBookings()
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    async function fetchBookings() {
        setLoading(true)
        try {
            const res = await fetch("/api/bookings")
            if (res.status === 401) {
                router.push("/admin/login")
                return
            }
            const data = await res.json()
            // Fix: Ensure data is an array before setting
            if (Array.isArray(data)) {
                setBookings(data)
            } else {
                console.error("API returned non-array:", data)
                setBookings([])
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error)
            setBookings([])
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
            fetchBookings()
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

    // Prevent hydration mismatch by returning null until mounted if needed,
    // but simpler to just ensure safe data access.
    // We will animate entry which handles visual loading.

    // --- Process Data for Charts ---
    const safeBookings = Array.isArray(bookings) ? bookings : []

    // 1. Status Distribution
    const statusData = [
        { name: 'Pending', value: safeBookings.filter(b => b.status === 'pending').length, color: '#fbbf24' },
        { name: 'Approved', value: safeBookings.filter(b => b.status === 'approved').length, color: '#22c55e' },
        { name: 'Rejected', value: safeBookings.filter(b => b.status === 'rejected').length, color: '#ef4444' },
    ]

    // 2. Bookings Timeline (Last 7 days or simply by date)
    // Group by date
    const bookingsByDate: Record<string, number> = {}
    safeBookings.forEach(b => {
        const date = new Date(b.date).toLocaleDateString();
        bookingsByDate[date] = (bookingsByDate[date] || 0) + b.persons
    })
    const timelineData = Object.keys(bookingsByDate).map(date => ({
        date,
        trekkers: bookingsByDate[date]
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 7) // Last 7 unique dates

    // --- Process Data for Table (Filtering) ---
    const filteredBookings = safeBookings.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.phone.includes(searchQuery)
        const matchesStatus = statusFilter === "all" || b.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // --- Process Data for Calendar ---
    const events = safeBookings.map(booking => {
        const dateStr = new Date(booking.date).toISOString().split('T')[0]
        let startDateTime = new Date(`${dateStr}T00:00:00`)
        try {
            const timeParts = parse(booking.timeSlot, 'hh:mm aa', new Date())
            const hours = timeParts.getHours()
            const minutes = timeParts.getMinutes()
            startDateTime = new Date(booking.date)
            startDateTime.setHours(hours, minutes, 0)
        } catch (e) { }

        let color = '#3b82f6'
        if (booking.status === 'approved') color = '#22c55e'
        if (booking.status === 'rejected') color = '#ef4444'
        if (booking.status === 'completed') color = '#6b7280'

        return {
            id: booking._id,
            title: `${booking.name} (${booking.persons})`,
            start: startDateTime,
            extendedProps: { ...booking },
            backgroundColor: color,
            borderColor: color,
        }
    })

    // --- Features ---
    function downloadCSV() {
        const headers = ["Date", "Time", "Name", "Phone", "Persons", "Status"]
        const csvContent = [
            headers.join(","),
            ...bookings.map(b => [
                new Date(b.date).toLocaleDateString(),
                b.timeSlot,
                `"${b.name}"`,
                b.phone,
                b.persons,
                b.status
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `velligiri_bookings_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    function downloadExcel() {
        const data = bookings.map(b => ({
            Date: new Date(b.date).toLocaleDateString(),
            Time: b.timeSlot,
            Name: b.name,
            Phone: b.phone,
            Persons: b.persons,
            Status: b.status,
            Created_At: new Date(b.createdAt).toLocaleString()
        }))

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
        XLSX.writeFile(workbook, `Velliangiri_Bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    function openWhatsApp(phone: string, name: string) {
        const message = `Namaskaram ${name}, this is regarding your Velliangiri Trek booking. `
        window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
    }

    // --- Animations ---
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    // Prevent hydration errors
    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[url('/trek_path.png')] bg-cover bg-fixed bg-center relative font-sans text-neutral-900">
            {/* Dark Overlay with Gradient */}
            <div className="absolute inset-0 bg-neutral-900/40 bg-gradient-to-b from-neutral-900/70 via-neutral-900/50 to-neutral-900/70 backdrop-blur-[4px] z-0" />

            {/* Top Navigation / Command Bar */}
            <header className="sticky top-0 z-30 h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl px-6 shadow-xl text-white relative flex items-center justify-between">

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <div className="p-2 bg-green-600/20 rounded-lg backdrop-blur-md border border-green-500/30">
                        <LayoutDashboard className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight text-white leading-none">Velliangiri<span className="text-green-400">Control</span></h1>
                        <span className="text-[10px] text-green-300/80 font-mono tracking-wider uppercase">Official Admin Portal</span>
                    </div>
                </motion.div>

                {/* Center Stats (Hidden on mobile) */}
                <div className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                        <span className="font-mono">{currentTime || "--:--"}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <MountainSnow className="h-3.5 w-3.5 text-green-400" />
                        <span>Status: <span className="text-green-400 font-semibold">Open</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={fetchBookings} disabled={loading} className="text-neutral-300 hover:text-white hover:bg-white/10 transition-colors">
                        <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-all">
                        <LogOut className="h-4 w-4 mr-2" />
                    </Button>
                </div>
            </header>

            <main className="p-6 md:p-8 max-w-[1700px] mx-auto space-y-8 relative z-10">

                {/* Expanded Stats Grid with Staggered Animation */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
                >
                    {[
                        { title: "Total Bookings", value: safeBookings.length, sub: "Lifetime count", color: "border-l-primary", icon: Users },
                        { title: "Pending", value: statusData[0].value, sub: "Action needed", color: "border-l-yellow-400 text-yellow-600", icon: Clock },
                        { title: "Confirmed", value: safeBookings.filter(b => b.status === 'approved').reduce((acc, curr) => acc + curr.persons, 0), sub: "Ready for trek", color: "border-l-green-500 text-green-600", icon: Check },
                        { title: "Today's Groups", value: safeBookings.filter(b => new Date(b.date).toDateString() === new Date().toDateString()).length, sub: "Arriving today", color: "border-l-blue-500 text-blue-600", icon: CalendarRange },
                        { title: "Conditions", value: "18°C", sub: "Mist / Light Wind", color: "border-l-purple-500 text-purple-600", icon: Cloud }
                    ].map((stat, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className={cn("backdrop-blur-xl bg-white/85 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block h-full", stat.color.split(' ')[0])}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
                                    <stat.icon className="h-4 w-4 text-muted-foreground opacity-50" />
                                </CardHeader>
                                <CardContent>
                                    <div className={cn("text-3xl font-black tracking-tight", stat.color.split(' ').length > 1 ? stat.color.split(' ')[1] : "")}>
                                        {stat.value}
                                    </div>
                                    <p className="text-xs font-medium text-muted-foreground/80 mt-1">{stat.sub}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Modern Pill Tabs */}
                        <TabsList className="bg-white/10 backdrop-blur-md border border-white/20 p-1 h-12 rounded-full">
                            <TabsTrigger value="overview" className="rounded-full px-6 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"><TrendingUp className="h-4 w-4 mr-2" /> Overview</TabsTrigger>
                            <TabsTrigger value="list" className="rounded-full px-6 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"><ListFilter className="h-4 w-4 mr-2" /> Database</TabsTrigger>
                            <TabsTrigger value="calendar" className="rounded-full px-6 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"><CalendarRange className="h-4 w-4 mr-2" /> Calendar</TabsTrigger>
                        </TabsList>

                        {/* Global Actions */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button onClick={downloadExcel} className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20 border-0 rounded-full px-6">
                                <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
                            </Button>
                        </motion.div>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* TAB: OVERVIEW (Charts) */}
                        <TabsContent value="overview" className="space-y-6">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <motion.div variants={itemVariants}>
                                    <Card className="bg-white/80 backdrop-blur-xl border-white/40 shadow-xl">
                                        <CardHeader>
                                            <CardTitle>Upcoming Trekkers Volume</CardTitle>
                                            <CardDescription>Number of people booked per day</CardDescription>
                                        </CardHeader>
                                        <CardContent className="h-[350px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={timelineData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
                                                    <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                                    <Tooltip
                                                        cursor={{ fill: '#22c55e10' }}
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.2)', backgroundColor: 'white' }}
                                                    />
                                                    <Bar dataKey="trekkers" fill="#166534" radius={[6, 6, 0, 0]} barSize={50} animationDuration={1500} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Card className="bg-white/80 backdrop-blur-xl border-white/40 shadow-xl">
                                        <CardHeader>
                                            <CardTitle>Booking Status Distribution</CardTitle>
                                            <CardDescription>Current state of all received booking requests</CardDescription>
                                        </CardHeader>
                                        <CardContent className="h-[350px] flex items-center justify-center">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={statusData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={80}
                                                        outerRadius={110}
                                                        paddingAngle={4}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {statusData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.2)' }} />
                                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        </TabsContent>

                        {/* TAB: LIST (Table) */}
                        <TabsContent value="list">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-2xl overflow-hidden">
                                    <CardHeader>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <CardTitle className="text-xl">Booking Database</CardTitle>
                                                <CardDescription>Live search and filtering of all records.</CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="relative w-full md:w-64">
                                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Search name/phone..."
                                                        className="pl-9 bg-white/50 border-neutral-200 focus:bg-white transition-all"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </div>
                                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                    <SelectTrigger className="w-[140px] bg-white/50">
                                                        <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All</SelectItem>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="approved">Approved</SelectItem>
                                                        <SelectItem value="rejected">Rejected</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="border-t border-neutral-100">
                                            <Table>
                                                <TableHeader className="bg-neutral-50/50">
                                                    <TableRow>
                                                        <TableHead className="w-[150px]">Date</TableHead>
                                                        <TableHead>Guest Name</TableHead>
                                                        <TableHead>Contact</TableHead>
                                                        <TableHead>Size</TableHead>
                                                        <TableHead>Status</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredBookings.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                                                No bookings found matching your criteria.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filteredBookings.map((booking, index) => (
                                                            <motion.tr
                                                                key={booking._id}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.05 }}
                                                                className="hover:bg-green-50/40 cursor-pointer transition-colors border-b border-neutral-50 last:border-0 group"
                                                                onClick={() => {
                                                                    setSelectedBooking(booking)
                                                                    setIsDialogOpen(true)
                                                                }}
                                                            >
                                                                <TableCell className="font-medium text-neutral-900">
                                                                    {new Date(booking.date).toLocaleDateString()}
                                                                    <span className="block text-[11px] text-muted-foreground uppercase tracking-wide font-medium mt-0.5">{booking.timeSlot}</span>
                                                                </TableCell>
                                                                <TableCell className="font-semibold text-neutral-700">{booking.name}</TableCell>
                                                                <TableCell className="font-mono text-sm text-neutral-600">{booking.phone}</TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-1.5 bg-neutral-100 w-fit px-2 py-1 rounded-md text-xs font-semibold">
                                                                        <Users className="h-3 w-3 text-neutral-500" />
                                                                        {booking.persons}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className={cn(
                                                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider shadow-sm",
                                                                        booking.status === 'approved' ? "bg-green-500 text-white" :
                                                                            booking.status === 'rejected' ? "bg-red-500 text-white" :
                                                                                "bg-yellow-400 text-black"
                                                                    )}>
                                                                        {booking.status}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                                    <Button size="sm" variant="outline" onClick={() => openWhatsApp(booking.phone, booking.name)} className="h-8 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 opacity-60 group-hover:opacity-100 transition-opacity">
                                                                        Chat
                                                                    </Button>
                                                                </TableCell>
                                                            </motion.tr>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        {/* TAB: CALENDAR */}
                        <TabsContent value="calendar">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Card className="overflow-hidden bg-white/90 backdrop-blur-xl shadow-2xl border-0">
                                    <CardHeader>
                                        <CardTitle>Pilgrimage Schedule</CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[750px] p-0 calendar-custom">
                                        <FullCalendar
                                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                            headerToolbar={{
                                                left: 'prev,next today',
                                                center: 'title',
                                                right: 'dayGridMonth,timeGridWeek'
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
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>

            </main>

            {/* Booking Details Dialog (Reused for all views) */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {selectedBooking && (
                    <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl">Booking #{selectedBooking._id.slice(-6)}</DialogTitle>
                            <DialogDescription>
                                Full details for this reservation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-neutral-500">Guest Name</span>
                                    <span className="font-bold text-neutral-800 text-lg">{selectedBooking.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-neutral-500">Phone Number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-neutral-700">{selectedBooking.phone}</span>
                                        <Button size="icon" variant="outline" className="h-6 w-6 rounded-full border-green-200 text-green-600 bg-green-50" onClick={() => openWhatsApp(selectedBooking.phone, selectedBooking.name)}>
                                            <span className="sr-only">WhatsApp</span>
                                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487 2.082.899 2.859.721 3.355.674.556-.053 1.733-.708 1.98-1.39.248-.684.248-1.27.174-1.399z" /></svg>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-neutral-500">Date & Time</span>
                                    <span className="font-medium text-neutral-800">
                                        {new Date(selectedBooking.date).toLocaleDateString()} @ {selectedBooking.timeSlot}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-neutral-500">Group Size</span>
                                    <span className="font-medium text-neutral-800">{selectedBooking.persons} Pilgrims</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-2">
                                <span className="text-sm text-gray-500">Current Status:</span>
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                                    selectedBooking.status === 'approved' ? "bg-green-50 text-green-700 border-green-200" :
                                        selectedBooking.status === 'rejected' ? "bg-red-50 text-red-700 border-red-200" :
                                            "bg-yellow-50 text-yellow-800 border-yellow-200"
                                )}>
                                    {selectedBooking.status}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between pt-2 border-t border-neutral-100">
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => deleteBooking(selectedBooking._id)}
                                title="Delete Booking Permanently"
                                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="flex gap-2 w-full sm:w-auto justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => updateStatus(selectedBooking._id, 'rejected')}
                                    className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <X className="mr-2 h-4 w-4" /> Reject
                                </Button>
                                <Button
                                    onClick={() => updateStatus(selectedBooking._id, 'approved')}
                                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                                >
                                    <Check className="mr-2 h-4 w-4" /> Approve
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
}
