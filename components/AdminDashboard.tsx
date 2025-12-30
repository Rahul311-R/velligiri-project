"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { parse } from "date-fns"
import * as XLSX from 'xlsx'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'
import {
    LayoutDashboard, CalendarRange, ListFilter, LogOut, Check, X, Trash2,
    Search, RefreshCw, Users, TrendingUp, Filter, Clock, Cloud, MountainSnow, FileSpreadsheet,
    ShieldAlert, Zap, ArrowUpRight, MessageSquare, BadgeCheck, AlertCircle, Eye
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
            if (Array.isArray(data)) {
                setBookings(data)
            } else {
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
            const res = await fetch(`/api/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            if (res.ok) {
                setBookings(prev => prev.map(b => b._id === id ? { ...b, status: status as any } : b))
                setIsDialogOpen(false)
            }
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
            setBookings(prev => prev.filter(b => b._id !== id))
            setIsDialogOpen(false)
        } catch (error) {
            console.error("Failed to delete", error)
        }
    }

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
    }

    const safeBookings = Array.isArray(bookings) ? bookings : []

    const statusData = [
        { name: 'Pending', value: safeBookings.filter(b => b.status === 'pending').length, color: '#f59e0b' },
        { name: 'Approved', value: safeBookings.filter(b => b.status === 'approved').length, color: '#10b981' },
        { name: 'Rejected', value: safeBookings.filter(b => b.status === 'rejected').length, color: '#f43f5e' },
    ]

    const bookingsByDate: Record<string, number> = {}
    safeBookings.forEach(b => {
        const date = new Date(b.date).toLocaleDateString();
        bookingsByDate[date] = (bookingsByDate[date] || 0) + b.persons
    })

    const peakDate = Object.entries(bookingsByDate).sort((a, b) => b[1] - a[1])[0]?.[0] || "No Data"

    const timelineData = Object.keys(bookingsByDate).map(date => ({
        date,
        trekkers: bookingsByDate[date]
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 10)

    const filteredBookings = safeBookings.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.phone.includes(searchQuery)
        const matchesStatus = statusFilter === "all" || b.status === statusFilter
        return matchesSearch && matchesStatus
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const events = safeBookings.map(booking => {
        const dateStr = new Date(booking.date).toISOString().split('T')[0]
        let startDateTime = new Date(`${dateStr}T00:00:00`)
        try {
            const timeParts = parse(booking.timeSlot, 'hh:mm aa', new Date())
            const hours = timeParts.getHours()
            const minutes = timeParts.getMinutes()
            startDateTime.setHours(hours, minutes, 0)
        } catch (e) { }

        let color = '#3b82f6'
        if (booking.status === 'approved') color = '#10b981'
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
        XLSX.writeFile(workbook, `Velligiri_Hills_Bookings_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    function openWhatsApp(phone: string, name: string) {
        const message = `Namaskaram ${name}, this is regarding your Velligiri Hills Trek booking. `
        window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
    }

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-neutral-900 selection:bg-green-100">
            {/* Soft Spiritual Background elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-100/50 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-orange-50/60 blur-[100px] rounded-full" />
            </div>

            {/* Navigation - Light Reflection */}
            <header className="sticky top-0 z-50 h-20 border-b border-neutral-200/50 bg-white/70 backdrop-blur-2xl px-8 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-5">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/10"
                    >
                        <LayoutDashboard className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                        <h1 className="font-black text-2xl tracking-tighter text-neutral-900 leading-none">Velligiri<span className="text-green-600">Hills</span></h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[10px] text-neutral-500 font-black tracking-widest uppercase">Safe & Spiritual Journey</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex flex-col items-end">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">Velligiri Standard Time</span>
                        <div className="text-lg font-mono font-bold text-neutral-700">{currentTime}</div>
                    </div>
                    <div className="h-10 w-px bg-neutral-200" />
                    <Button variant="ghost" size="icon" onClick={fetchBookings} disabled={loading} className="text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-xl">
                        <RefreshCw className={cn("h-5 w-5", loading && "animate-spin")} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="border-rose-200 bg-rose-50/50 text-rose-600 hover:bg-rose-600 hover:text-white group transition-all rounded-xl h-10 px-4">
                        <LogOut className="h-4 w-4 mr-2" />
                        <span className="font-bold">Exit Portal</span>
                    </Button>
                </div>
            </header>

            <main className="p-8 md:p-12 max-w-[1800px] mx-auto space-y-12 relative z-10">

                {/* Metric Grid - Clean & Elegant */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Total Pilgrims", value: safeBookings.reduce((a, b) => a + b.persons, 0), detail: "Cumulative soul count", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                        { title: "Peak Demand", value: peakDate, detail: "High energy date", icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
                        { title: "Approval Rate", value: `${Math.round((statusData[1].value / (safeBookings.length || 1)) * 100)}%`, detail: "Verified groups", icon: BadgeCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { title: "Pending Actions", value: statusData[0].value, detail: "Requires attention", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="bg-white border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className={cn("p-4 rounded-2xl", stat.bg)}>
                                            <stat.icon className={cn("h-6 w-6", stat.color)} />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-neutral-50 border border-neutral-100 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                            Insight
                                        </div>
                                    </div>
                                    <div className="text-3xl font-black text-neutral-900 mb-2 tracking-tighter">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{stat.title}</p>
                                    <p className="text-[11px] text-neutral-500 mt-1 italic font-medium">{stat.detail}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <Tabs defaultValue="list" className="space-y-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <TabsList className="bg-white border border-neutral-200 p-1.5 rounded-[24px] h-16 w-fit shadow-sm">
                            <TabsTrigger value="list" className="h-full rounded-2xl px-10 data-[state=active]:bg-green-600 data-[state=active]:text-white font-black transition-all text-neutral-500">
                                <ListFilter className="w-4 h-4 mr-2" /> Bookings
                            </TabsTrigger>
                            <TabsTrigger value="overview" className="h-full rounded-2xl px-10 data-[state=active]:bg-green-600 data-[state=active]:text-white font-black transition-all text-neutral-500">
                                <TrendingUp className="w-4 h-4 mr-2" /> Analytics
                            </TabsTrigger>
                            <TabsTrigger value="calendar" className="h-full rounded-2xl px-10 data-[state=active]:bg-green-600 data-[state=active]:text-white font-black transition-all text-neutral-500">
                                <CalendarRange className="w-4 h-4 mr-2" /> Schedule
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <div className="relative grow lg:grow-0">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <Input
                                    placeholder="Search pilgrim records..."
                                    className="pl-12 bg-white border-neutral-200 h-14 rounded-2xl w-full lg:w-96 focus:ring-green-100 transition-all font-bold text-neutral-900 placeholder:text-neutral-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button onClick={downloadExcel} className="bg-white text-green-700 border border-green-200 hover:bg-green-50 rounded-2xl px-8 font-black h-14 shadow-sm transition-all active:scale-95">
                                <FileSpreadsheet className="mr-2 h-5 w-5" /> Export Data
                            </Button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <TabsContent value="list" className="mt-0 outline-none">
                            <Card className="bg-white border-neutral-100 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-stone-50/50 border-b border-neutral-100">
                                                <TableRow className="hover:bg-transparent border-none">
                                                    <TableHead className="px-10 h-20 text-[10px] font-black uppercase tracking-widest text-neutral-400">Arrival Profile</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Pilgrim info</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Batch Size</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Verification</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right px-10">Control</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredBookings.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="h-64 text-center">
                                                            <div className="flex flex-col items-center gap-4 opacity-20 translate-y-4">
                                                                <MountainSnow className="w-16 h-16" />
                                                                <p className="font-bold">The hills are quiet. No pilgrims found.</p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredBookings.map((b, i) => (
                                                        <motion.tr
                                                            key={b._id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.02 }}
                                                            className="border-neutral-50 hover:bg-green-50/20 transition-all group relative animate-in fade-in duration-500"
                                                        >
                                                            <TableCell className="px-10 py-8">
                                                                <div className="font-bold text-lg text-neutral-900">{new Date(b.date).toLocaleDateString()}</div>
                                                                <div className="text-[11px] font-black text-neutral-400 uppercase mt-1 flex items-center gap-2">
                                                                    <Clock className="w-3.5 h-3.5 text-green-500" />
                                                                    {b.timeSlot}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="font-bold text-neutral-800">{b.name}</div>
                                                                <div className="text-xs font-mono text-neutral-500 mt-1 flex items-center gap-2">
                                                                    {b.phone}
                                                                    <button onClick={(e) => { e.stopPropagation(); openWhatsApp(b.phone, b.name); }} className="text-green-600/0 group-hover:text-green-600 transition-all font-black text-[10px] tracking-widest">WHATSAPP</button>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100/50 border border-neutral-100 text-xs font-bold text-neutral-700">
                                                                    <Users className="w-3.5 h-3.5" />
                                                                    {b.persons} Persons
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className={cn(
                                                                    "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                                                                    b.status === 'approved' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                                        b.status === 'rejected' ? "bg-rose-50 text-rose-700 border-rose-100" :
                                                                            "bg-amber-50 text-amber-700 border-amber-100"
                                                                )}>
                                                                    {b.status}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right px-10">
                                                                <div className="flex justify-end gap-2">
                                                                    {b.status === 'pending' && (
                                                                        <div className="flex gap-2">
                                                                            <Button
                                                                                size="icon"
                                                                                variant="ghost"
                                                                                onClick={() => updateStatus(b._id, 'rejected')}
                                                                                className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </Button>
                                                                            <Button
                                                                                size="icon"
                                                                                variant="ghost"
                                                                                onClick={() => updateStatus(b._id, 'approved')}
                                                                                className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                                            >
                                                                                <Check className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => { setSelectedBooking(b); setIsDialogOpen(true); }}
                                                                        className="h-10 w-10 rounded-xl bg-neutral-50 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 transition-all border border-neutral-100"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </motion.tr>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="overview" className="mt-0 space-y-8 outline-none">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <Card className="lg:col-span-2 bg-white border-neutral-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-green-50/50 blur-[80px] rounded-full group-hover:bg-green-100/50 transition-colors duration-1000" />
                                    <CardHeader className="p-0 mb-10 relative z-10">
                                        <CardTitle className="text-2xl font-black text-neutral-800">Trekker Inflow</CardTitle>
                                        <CardDescription className="italic font-medium text-neutral-500">Soul mapping for the current sacred season</CardDescription>
                                    </CardHeader>
                                    <div className="h-[450px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={timelineData}>
                                                <defs>
                                                    <linearGradient id="lightGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                                                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} stroke="#a3a3a3" tick={{ fontWeight: 800 }} />
                                                <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#a3a3a3" tick={{ fontWeight: 800 }} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', padding: '20px' }}
                                                />
                                                <Area type="monotone" dataKey="trekkers" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#lightGradient)" animationDuration={1500} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card className="bg-white border-neutral-100 rounded-[40px] p-10 shadow-sm flex flex-col justify-center items-center text-center">
                                    <div className="space-y-2 mb-8 self-start text-left">
                                        <h3 className="text-xl font-black text-neutral-800">Capacity Ratio</h3>
                                        <p className="text-xs text-neutral-500 font-bold italic">Verification Split</p>
                                    </div>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={90}
                                                    outerRadius={130}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                    stroke="none"
                                                    cornerRadius={40}
                                                >
                                                    {statusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.1em', paddingTop: '20px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-8 w-full space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-neutral-400">
                                            <span>Guide Availability</span>
                                            <span className="text-green-600">Stable</span>
                                        </div>
                                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                                            <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} className="h-full bg-green-500 rounded-full" />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="calendar" className="mt-0 outline-none">
                            <Card className="bg-white border-neutral-100 rounded-[40px] p-8 h-[800px] shadow-sm">
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
                                    initialView="dayGridMonth"
                                    events={events}
                                    height="100%"
                                    slotMinTime="05:00:00"
                                    slotMaxTime="22:00:00"
                                    eventClick={(info) => {
                                        const b = info.event.extendedProps as Booking;
                                        setSelectedBooking({ ...b, _id: info.event.id });
                                        setIsDialogOpen(true);
                                    }}
                                />
                            </Card>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </main>

            {/* Sacred Records Dialog - Elegant Light Theme */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {selectedBooking && (
                    <DialogContent className="max-w-2xl bg-white border border-neutral-200 shadow-[0_40px_100px_rgba(0,0,0,0.05)] rounded-[48px] p-0 overflow-hidden outline-none">
                        <div className="relative h-48 w-full bg-gradient-to-br from-green-600 to-emerald-900 p-12 flex flex-col justify-end">
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/20 blur-[100px] rounded-full" />
                            <div className="flex items-center gap-4 mb-3 relative z-10">
                                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest border border-white/30 backdrop-blur-md">
                                    Official Pilgrim Profile
                                </span>
                                <span className="text-white/60 text-[10px] font-black tracking-widest">#{selectedBooking._id.slice(-8)}</span>
                            </div>
                            <h2 className="text-4xl font-black text-white relative z-10 tracking-tighter italic">Velligiri <span className="text-emerald-200">Hill Guard</span></h2>
                        </div>

                        <div className="p-12 space-y-10 bg-white">
                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Pilgrim Name</p>
                                    <p className="text-2xl font-black text-neutral-900">{selectedBooking.name}</p>
                                </div>
                                <div className="space-y-1.5 text-right">
                                    <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Contact Digit</p>
                                    <p className="text-2xl font-mono font-bold text-neutral-600">{selectedBooking.phone}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Sacred Date</p>
                                    <p className="text-2xl font-black text-neutral-900">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                                    <p className="text-xs font-bold text-green-600 italic">{selectedBooking.timeSlot}</p>
                                </div>
                                <div className="space-y-1.5 text-right">
                                    <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Entourage Size</p>
                                    <p className="text-2xl font-black text-neutral-900">{selectedBooking.persons} Souls</p>
                                </div>
                            </div>

                            <div className="bg-stone-50 p-8 rounded-[32px] border border-neutral-100 flex items-center justify-between shadow-inner">
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "w-4 h-4 rounded-full",
                                        selectedBooking.status === 'approved' ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" :
                                            selectedBooking.status === 'rejected' ? "bg-rose-500" : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                                    )} />
                                    <div>
                                        <p className="font-black uppercase text-xs tracking-widest text-neutral-900">Current Status</p>
                                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Pilgrim Verification Status</p>
                                    </div>
                                </div>
                                <span className={cn("font-black text-lg",
                                    selectedBooking.status === 'approved' ? "text-emerald-600" :
                                        selectedBooking.status === 'rejected' ? "text-rose-600" : "text-amber-600"
                                )}>{selectedBooking.status.toUpperCase()}</span>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => deleteBooking(selectedBooking._id)}
                                    className="h-16 w-16 min-w-16 rounded-2xl border-stone-100 bg-stone-50 text-stone-400 hover:bg-rose-600 hover:text-white transition-all duration-300"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </Button>

                                {selectedBooking.status === 'pending' ? (
                                    <div className="flex gap-4 grow">
                                        <Button
                                            variant="outline"
                                            onClick={() => updateStatus(selectedBooking._id, 'rejected')}
                                            className="h-16 rounded-3xl border-stone-100 bg-stone-50 p-6 font-black text-stone-500 hover:bg-neutral-900 hover:text-white grow transition-all"
                                        >
                                            <X className="mr-3 w-5 h-5" /> REJECT
                                        </Button>
                                        <Button
                                            onClick={() => updateStatus(selectedBooking._id, 'approved')}
                                            className="h-16 rounded-3xl bg-green-600 hover:bg-green-700 text-white font-black p-6 grow-[2] shadow-lg shadow-green-900/10 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Check className="w-6 h-6" /> APPROVE BATCH
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setIsDialogOpen(false)}
                                        className="h-16 rounded-3xl bg-neutral-900 text-white font-black p-6 grow transition-all shadow-xl"
                                    >
                                        DONE & CLOSE
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
}
