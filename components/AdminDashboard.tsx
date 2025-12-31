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
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line
} from 'recharts'
import {
    LayoutDashboard, CalendarRange, ListFilter, LogOut, Check, X, Trash2,
    Search, RefreshCw, Users, TrendingUp, Filter, Clock, Cloud, MountainSnow, FileSpreadsheet,
    ShieldAlert, Zap, ArrowUpRight, MessageSquare, BadgeCheck, AlertCircle, Eye, Image as ImageIcon, Upload, Plus,
    LayoutGrid, List, CheckCircle2, MoreHorizontal, Calendar as CalendarIcon, MapPin, Activity, ChevronRight
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
import Image from "next/image"

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

interface GalleryItem {
    _id: string
    url: string
    caption: string
    category: string
    isActive: boolean
}

export default function AdminDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [galleryLoading, setGalleryLoading] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [mounted, setMounted] = useState(false)
    const [currentTime, setCurrentTime] = useState<string>("")

    const [viewMode, setViewMode] = useState<'list' | 'board'>('list')
    const [uploading, setUploading] = useState(false)
    const [newImage, setNewImage] = useState({
        url: "",
        caption: "",
        category: "Ascent"
    })

    const router = useRouter()

    useEffect(() => {
        setMounted(true)
        fetchBookings()
        fetchGallery()
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

    async function fetchGallery() {
        setGalleryLoading(true)
        try {
            const res = await fetch("/api/gallery")
            const data = await res.json()
            if (Array.isArray(data)) {
                setGalleryItems(data)
            }
        } catch (error) {
            console.error("Failed to fetch gallery", error)
        } finally {
            setGalleryLoading(false)
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const reader = new FileReader()
        reader.onloadend = () => {
            setNewImage(prev => ({ ...prev, url: reader.result as string }))
            setUploading(false)
        }
        reader.readAsDataURL(file)
    }

    async function addGalleryImage() {
        if (!newImage.url || !newImage.caption) return

        try {
            const res = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newImage),
            })
            if (res.ok) {
                fetchGallery()
                setIsGalleryDialogOpen(false)
                setNewImage({ url: "", caption: "", category: "other" })
            }
        } catch (error) {
            console.error("Failed to add image", error)
        }
    }

    async function deleteGalleryImage(id: string) {
        if (!confirm("Remove this image from the sacred gallery?")) return
        try {
            const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" })
            if (res.ok) {
                setGalleryItems(prev => prev.filter(item => item._id !== id))
            }
        } catch (error) {
            console.error("Failed to delete image", error)
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
        <div className="h-screen flex flex-col bg-[#f8fafc] font-sans text-neutral-900 selection:bg-green-100 overflow-hidden">
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-100/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-orange-100/10 blur-[100px] rounded-full" />
            </div>

            <header className="shrink-0 h-16 border-b border-neutral-200/50 bg-white/70 backdrop-blur-2xl px-6 flex items-center justify-between shadow-sm relative z-50">
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-800 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/10"
                    >
                        <LayoutDashboard className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                        <h1 className="font-extrabold text-xl tracking-tighter text-neutral-900 leading-none">Velligiri<span className="text-green-600">Hills</span></h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-[8px] text-neutral-500 font-black tracking-[0.2em] uppercase">Hill Guard Portal</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-tighter">Standard Time</span>
                        <div className="text-sm font-mono font-bold text-neutral-700">{currentTime}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={fetchBookings} disabled={loading} className="h-9 w-9 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded-lg shrink-0">
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="border-rose-200 bg-rose-50/50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all rounded-lg h-9 px-3 text-xs font-bold shrink-0">
                        <LogOut className="h-3.5 w-3.5 mr-2" />
                        Exit
                    </Button>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto relative z-10 p-4 md:p-6 lg:px-8 space-y-6 scrollbar-hide">
                <div className="max-w-[1400px] mx-auto space-y-8">
                    {/* Atmospheric Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative h-48 md:h-64 rounded-[40px] overflow-hidden shadow-2xl border border-white"
                    >
                        <Image
                            src="/trek_path.png"
                            alt="The Path"
                            fill
                            className="object-cover brightness-[0.7] contrast-[1.1]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-center px-12 space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                    <MountainSnow className="w-6 h-6 text-emerald-400" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.4em]">Guardian Perspective</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">The Holy <span className="text-emerald-400">Seven Hills</span></h2>
                            <p className="text-emerald-50/60 text-sm font-medium italic max-w-sm">"Watch over those who seek the peak, for the mountain remembers every step."</p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { title: "Total Pilgrims", value: safeBookings.reduce((a, b) => a + b.persons, 0), detail: "Cumulative soul count", icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
                            { title: "Peak Demand", value: peakDate, detail: "High energy date", icon: Zap, color: "text-orange-600", bg: "bg-orange-50", trend: "Stable" },
                            { title: "Approval Rate", value: `${Math.round((statusData[1].value / (safeBookings.length || 1)) * 100)}%`, detail: "Verified groups", icon: BadgeCheck, color: "text-emerald-600", bg: "bg-emerald-50", trend: "High" },
                            { title: "System Vibe", value: "SACRED", detail: "Operational status", icon: ShieldAlert, color: "text-indigo-600", bg: "bg-indigo-50", trend: "99.9%" }
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <Card className="bg-white border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[32px] overflow-hidden group hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-700 relative">
                                    <div className={cn("absolute top-0 right-0 w-24 h-24 blur-[40px] rounded-full opacity-10 transition-all duration-700 group-hover:scale-150", stat.bg)} />
                                    <CardContent className="p-7 relative z-10">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className={cn("p-4 rounded-2xl shadow-sm transition-transform duration-500 group-hover:rotate-12", stat.bg)}>
                                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">Status</div>
                                                <div className={cn("text-[10px] font-black uppercase tracking-tighter", stat.color)}>{stat.trend}</div>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-black text-neutral-900 mb-1 tracking-tighter">
                                            {stat.value}
                                        </div>
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-2">{stat.title}</p>
                                        <p className="text-xs text-neutral-400 italic font-medium opacity-60">{stat.detail}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Divine Flow Ticker */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-neutral-950 rounded-[40px] p-4 flex items-center gap-6 overflow-hidden border border-white/5 shadow-2xl relative"
                    >
                        <div className="shrink-0 flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Divine Flow</span>
                        </div>
                        <div className="flex-grow whitespace-nowrap overflow-hidden italic text-white/40 text-sm font-medium">
                            <motion.div
                                animate={{ x: ["100%", "-100%"] }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="flex gap-20"
                            >
                                <span>Om Namah Shivaya – The mountain is clear and welcoming.</span>
                                <span>Batch of {safeBookings[0]?.persons || 4} souls arriving on {new Date(safeBookings[0]?.date || Date.now()).toLocaleDateString()}.</span>
                                <span>Current summit temperature: 14°C – Perfect for ascension.</span>
                                <span>May the grace of the seven hills guide every step.</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    <Tabs defaultValue="list" className="space-y-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <TabsList className="bg-white border border-neutral-200 p-1.5 rounded-[24px] h-16 w-fit shadow-xl shadow-neutral-200/20">
                                <TabsTrigger value="list" className="h-full rounded-2xl px-10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-600 data-[state=active]:to-green-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/10 font-black transition-all text-neutral-500 text-sm">
                                    <Activity className="w-4 h-4 mr-2" /> Bookings
                                </TabsTrigger>
                                <TabsTrigger value="gallery" className="h-full rounded-2xl px-10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-600 data-[state=active]:to-green-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/10 font-black transition-all text-neutral-500 text-sm">
                                    <ImageIcon className="w-4 h-4 mr-2" /> Gallery
                                </TabsTrigger>
                                <TabsTrigger value="overview" className="h-full rounded-2xl px-10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-600 data-[state=active]:to-green-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/10 font-black transition-all text-neutral-500 text-sm">
                                    <TrendingUp className="w-4 h-4 mr-2" /> Analytics
                                </TabsTrigger>
                                <TabsTrigger value="calendar" className="h-full rounded-2xl px-10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-600 data-[state=active]:to-green-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-900/10 font-black transition-all text-neutral-500 text-sm">
                                    <CalendarRange className="w-4 h-4 mr-2" /> Schedule
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                <div className="flex items-center bg-white border border-neutral-200 p-1.5 rounded-2xl shadow-sm h-14">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className={cn("h-full px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all", viewMode === 'list' ? "bg-neutral-100 text-emerald-700 shadow-inner" : "text-neutral-400 hover:text-neutral-600")}
                                    >
                                        <List className="w-4 h-4 mr-2" /> List
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setViewMode('board')}
                                        className={cn("h-full px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all", viewMode === 'board' ? "bg-neutral-100 text-emerald-700 shadow-inner" : "text-neutral-400 hover:text-neutral-600")}
                                    >
                                        <LayoutGrid className="w-4 h-4 mr-2" /> Board
                                    </Button>
                                </div>

                                <div className="relative grow lg:grow-0 group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <Input
                                        placeholder="Search pilgrims..."
                                        className="pl-12 bg-white border-neutral-200 h-14 rounded-2xl w-full lg:w-72 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-neutral-900 placeholder:text-neutral-400 text-sm shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button onClick={downloadExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white border-none rounded-2xl px-8 font-black h-14 shadow-lg shadow-emerald-900/10 transition-all active:scale-95 text-xs uppercase tracking-widest">
                                    <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Data
                                </Button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <TabsContent value="list" className="mt-0 outline-none">
                                {viewMode === 'list' ? (
                                    <Card className="bg-white border-neutral-100 rounded-[40px] shadow-2xl shadow-neutral-200/40 overflow-hidden">
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader className="bg-neutral-50/50 border-b border-neutral-100">
                                                        <TableRow className="hover:bg-transparent border-none">
                                                            <TableHead className="px-10 h-24 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Divine Timing</TableHead>
                                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Pilgrim Essence</TableHead>
                                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Assembly</TableHead>
                                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Guardian Status</TableHead>
                                                            <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 text-right px-10">Ascension Control</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {filteredBookings.length === 0 ? (
                                                            <TableRow><TableCell colSpan={5} className="h-96 text-center"><div className="flex flex-col items-center gap-6 opacity-30"><MountainSnow className="w-24 h-24 text-neutral-200" /><p className="font-bold text-xl tracking-tighter italic">The hills are quiet. No souls matching your search.</p></div></TableCell></TableRow>
                                                        ) : (
                                                            filteredBookings.map((b, i) => (
                                                                <motion.tr key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="border-neutral-50 hover:bg-emerald-50/30 transition-all group relative animate-in fade-in duration-500 cursor-pointer" onClick={() => { setSelectedBooking(b); setIsDialogOpen(true); }}>
                                                                    <TableCell className="px-10 py-10">
                                                                        <div className="font-extrabold text-xl text-neutral-900 tracking-tighter">{new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                                        <div className="text-[10px] font-black text-emerald-600 uppercase mt-2 flex items-center gap-2 bg-emerald-50 w-fit px-2 py-1 rounded-lg"><Clock className="w-3 h-3" />{b.timeSlot}</div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="font-black text-neutral-900 text-lg tracking-tight">{b.name}</div>
                                                                        <div className="text-xs font-bold text-neutral-400 mt-1 flex items-center gap-2 group-hover:text-emerald-700 transition-colors">
                                                                            {b.phone}
                                                                            <button onClick={(e) => { e.stopPropagation(); openWhatsApp(b.phone, b.name); }} className="opacity-0 group-hover:opacity-100 transition-all font-black text-[9px] tracking-[0.2em] bg-green-600 text-white px-3 py-1 rounded-full uppercase ml-2">WhatsApp</button>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell><div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-neutral-100/50 border border-neutral-100 text-sm font-black text-neutral-800"><Users className="w-4 h-4 text-emerald-600" />{b.persons} Souls</div></TableCell>
                                                                    <TableCell>
                                                                        <div className={cn(
                                                                            "inline-flex items-center px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                                                            b.status === 'approved' ? "bg-emerald-500 text-white border-emerald-400" :
                                                                                b.status === 'rejected' ? "bg-rose-500 text-white border-rose-400" :
                                                                                    "bg-amber-500 text-white border-amber-400 animate-pulse"
                                                                        )}>
                                                                            {b.status}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-right px-10">
                                                                        <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                                                            {b.status === 'pending' && (<div className="flex gap-2">
                                                                                <Button size="icon" variant="ghost" onClick={() => updateStatus(b._id, 'rejected')} className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-md"><X className="w-5 h-5" /></Button>
                                                                                <Button size="icon" variant="ghost" onClick={() => updateStatus(b._id, 'approved')} className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-md"><Check className="w-5 h-5" /></Button>
                                                                            </div>)}
                                                                            <Button variant="ghost" size="icon" onClick={() => { setSelectedBooking(b); setIsDialogOpen(true); }} className="h-12 w-12 rounded-2xl bg-white text-neutral-400 hover:bg-emerald-950 hover:text-white transition-all border border-neutral-100 shadow-sm"><Eye className="w-5 h-5" /></Button>
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
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 h-[75vh]">
                                        {['pending', 'approved', 'rejected'].map((status) => (
                                            <div key={status} className="flex flex-col gap-8">
                                                <div className="flex items-center justify-between px-8 py-5 bg-white border border-neutral-100 rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-4 h-4 rounded-full shadow-lg relative",
                                                            status === 'approved' ? 'bg-emerald-500 shadow-emerald-500/20' :
                                                                status === 'rejected' ? 'bg-rose-500 shadow-rose-500/20' :
                                                                    'bg-amber-500 shadow-amber-500/20'
                                                        )}>
                                                            <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20", status === 'approved' ? 'bg-emerald-500' : status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500')} />
                                                        </div>
                                                        <h3 className="font-black uppercase tracking-[0.4em] text-[10px] text-neutral-800">{status} Queue</h3>
                                                    </div>
                                                    <span className="text-[10px] font-black text-neutral-400 bg-neutral-50 px-4 py-1.5 rounded-2xl border border-neutral-100 transition-all">
                                                        {filteredBookings.filter(b => b.status === status).length} Souls
                                                    </span>
                                                </div>
                                                <div className="flex-grow space-y-6 overflow-y-auto pr-4 scrollbar-hide pb-24">
                                                    <AnimatePresence>
                                                        {filteredBookings.filter(b => b.status === status).map((b, idx) => (
                                                            <motion.div
                                                                key={b._id}
                                                                layout
                                                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.95 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                whileHover={{ y: -8, scale: 1.02 }}
                                                                onClick={() => { setSelectedBooking(b); setIsDialogOpen(true); }}
                                                                className="p-10 rounded-[48px] bg-white border border-neutral-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] cursor-pointer group hover:border-emerald-200 transition-all relative overflow-hidden active:scale-95"
                                                            >
                                                                {/* Dynamic Aura Background */}
                                                                <div className={cn(
                                                                    "absolute -top-20 -right-20 w-48 h-48 blur-[80px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-1000",
                                                                    status === 'approved' ? 'bg-emerald-500' : status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                                                                )} />

                                                                <div className="relative z-10 space-y-8">
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="p-4 rounded-[24px] bg-neutral-50 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-500 shadow-inner">
                                                                            <Users className="w-6 h-6 text-neutral-300 group-hover:text-emerald-500" />
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-[11px] font-extrabold text-neutral-300 uppercase tracking-widest">{new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                                                            <p className="text-sm font-black text-emerald-600 italic mt-1">{b.timeSlot}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-2">Lead Pilgrim</div>
                                                                        <h4 className="text-2xl font-black text-neutral-900 tracking-tighter italic">{b.name}</h4>
                                                                        <div className="flex items-center gap-3 mt-4">
                                                                            <div className="px-5 py-2 rounded-2xl bg-neutral-50 border border-neutral-100 text-[10px] font-black text-neutral-600">
                                                                                {b.persons} PERSONS
                                                                            </div>
                                                                            <div className="w-2 h-2 rounded-full bg-neutral-200 group-hover:bg-green-500 transition-colors" />
                                                                            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest group-hover:text-neutral-900 transition-colors">READY</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-3 pt-6 border-t border-neutral-50" onClick={e => e.stopPropagation()}>
                                                                        {status === 'pending' ? (
                                                                            <>
                                                                                <Button size="sm" onClick={() => updateStatus(b._id, 'approved')} className="bg-emerald-600 hover:bg-green-700 text-white rounded-2xl h-14 grow font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/10">Approve</Button>
                                                                                <Button variant="outline" size="sm" onClick={() => updateStatus(b._id, 'rejected')} className="border-rose-100 text-rose-600 hover:bg-rose-50 rounded-2xl h-14 w-14 p-0 transition-all group-hover:scale-110 active:scale-95"><X className="w-5 h-5" /></Button>
                                                                            </>
                                                                        ) : (
                                                                            <div className="w-full h-14 flex items-center justify-center border-2 border-dashed border-neutral-100 rounded-[28px] text-[10px] font-black text-neutral-300 uppercase tracking-[0.4em] italic group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all">
                                                                                {status === 'approved' ? 'Journey Verified' : 'Access Denied'}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="gallery" className="mt-0 outline-none">
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Sacred Gallery Management</h2>
                                            <p className="text-sm text-neutral-500 font-medium">Control the visual journey of the pilgrims.</p>
                                        </div>
                                        <Button onClick={() => setIsGalleryDialogOpen(true)} className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-6 h-12 font-black shadow-lg shadow-green-900/10">
                                            <Plus className="mr-2 h-5 w-5" /> Add New Moment
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                                        {galleryLoading ? (
                                            [1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-[3/4] rounded-[56px] bg-neutral-100 animate-pulse" />)
                                        ) : galleryItems.length === 0 ? (
                                            <div className="col-span-full h-96 flex flex-col items-center justify-center bg-white border-2 border-dashed border-neutral-100 rounded-[64px] shadow-inner opacity-60">
                                                <div className="w-32 h-32 bg-neutral-50 rounded-full flex items-center justify-center mb-10 shadow-xl border border-white">
                                                    <ImageIcon className="w-12 h-12 text-neutral-200" />
                                                </div>
                                                <p className="font-black text-3xl tracking-tighter text-neutral-900 italic">The collection is currently empty.</p>
                                                <p className="text-sm font-black text-neutral-300 mt-4 uppercase tracking-[0.5em]">Capture the eternal presence of the seven peaks</p>
                                            </div>
                                        ) : (
                                            galleryItems.map((item, i) => (
                                                <motion.div
                                                    key={item._id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
                                                    className={cn(
                                                        "group relative rounded-[56px] overflow-hidden bg-white border border-neutral-100 shadow-2xl hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] transition-all duration-[1s] hover:-translate-y-4",
                                                        i % 3 === 0 ? "aspect-[4/5] md:col-span-1" : "aspect-[3/4] md:col-span-1"
                                                    )}
                                                >
                                                    <Image src={item.url} alt={item.caption} fill className="object-cover transition-transform duration-[4s] group-hover:scale-125 group-hover:rotate-2" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-12 flex flex-col justify-between backdrop-blur-[2px] group-hover:backdrop-blur-0">
                                                        <div className="flex justify-between items-center">
                                                            <div className="px-5 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-[8px] font-black text-white uppercase tracking-[0.4em] shadow-xl">
                                                                {item.category}
                                                            </div>
                                                            <Button variant="ghost" size="icon" onClick={() => deleteGalleryImage(item._id)} className="h-14 w-14 rounded-3xl bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white backdrop-blur-3xl border border-rose-500/20 transition-all scale-75 group-hover:scale-100 duration-500 shadow-2xl">
                                                                <Trash2 className="w-6 h-6" />
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-6 transform translate-y-12 group-hover:translate-y-0 transition-transform duration-1000 ease-out">
                                                            <div className="space-y-2">
                                                                <div className="w-12 h-1 bg-green-500 rounded-full" />
                                                                <p className="text-3xl font-black text-white italic tracking-tighter leading-none group-hover:scale-105 transition-transform duration-1000 origin-left">{item.caption}</p>
                                                            </div>
                                                            <div className="flex items-center gap-6 text-white/40 text-[9px] font-black uppercase tracking-widest">
                                                                <span className="flex items-center gap-2 pr-4 border-r border-white/10"><Activity className="w-3 h-3 text-green-500" /> LIVE</span>
                                                                <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-green-500" /> PEAK REGION</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="overview" className="mt-0 space-y-10 outline-none">
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                    <Card className="lg:col-span-3 bg-white border-neutral-100 rounded-[56px] p-12 shadow-2xl shadow-neutral-200/40 relative overflow-hidden group border-none">
                                        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-50/50 blur-[120px] rounded-full group-hover:bg-emerald-100/50 transition-all duration-1000" />
                                        <CardHeader className="p-0 mb-12 relative z-10 flex flex-row justify-between items-end">
                                            <div>
                                                <CardTitle className="text-4xl font-black text-neutral-900 tracking-tighter italic">Echoes of the <span className="text-emerald-600">Peaks</span></CardTitle>
                                                <CardDescription className="italic font-bold text-[10px] text-neutral-400 uppercase tracking-[0.4em] mt-3">Spiritual influx throughout the seasonal cycle</CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="px-6 py-2 rounded-2xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Live Telemetry</div>
                                            </div>
                                        </CardHeader>
                                        <div className="h-[400px] relative z-10">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={timelineData}>
                                                    <defs>
                                                        <linearGradient id="divineGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="rgba(0,0,0,0.03)" />
                                                    <XAxis
                                                        dataKey="date"
                                                        fontSize={9}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        stroke="#a3a3a3"
                                                        tick={{ fontWeight: 900 }}
                                                        dy={15}
                                                    />
                                                    <YAxis
                                                        fontSize={10}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        stroke="#a3a3a3"
                                                        tick={{ fontWeight: 900 }}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                                            backdropFilter: 'blur(20px)',
                                                            border: '1px solid #f1f5f9',
                                                            borderRadius: '32px',
                                                            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                                                            padding: '24px',
                                                            fontWeight: '900'
                                                        }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="trekkers"
                                                        stroke="#059669"
                                                        strokeWidth={6}
                                                        fillOpacity={1}
                                                        fill="url(#divineGradient)"
                                                        animationDuration={2500}
                                                        animationEasing="ease-in-out"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>

                                    <div className="space-y-8">
                                        <Card className="bg-emerald-950 border-none rounded-[56px] p-12 shadow-2xl relative overflow-hidden h-full flex flex-col items-center justify-between text-center group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative z-10 w-full text-left space-y-2">
                                                <h3 className="text-xl font-black text-white italic">Soul Split</h3>
                                                <p className="text-[10px] text-emerald-400/60 font-black uppercase tracking-[0.2em]">Current Batch Ratio</p>
                                            </div>
                                            <div className="h-[280px] w-full relative z-10">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={statusData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={80}
                                                            outerRadius={110}
                                                            paddingAngle={15}
                                                            dataKey="value"
                                                            stroke="none"
                                                            cornerRadius={20}
                                                        >
                                                            {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', fontWeight: '900' }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-4xl font-black text-white tracking-tighter">{safeBookings.length}</span>
                                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Global Souls</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full space-y-6 relative z-10">
                                                <div className="flex justify-between items-center text-[9px] font-black uppercase text-emerald-400 group-hover:text-white transition-colors">
                                                    <span>Guardian Efficiency</span>
                                                    <span className="text-emerald-500">98.4%</span>
                                                </div>
                                                <div className="h-2 w-full bg-emerald-900 rounded-full overflow-hidden shadow-inner">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: '98.4%' }} className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" />
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="relative h-64 rounded-[40px] overflow-hidden group shadow-xl">
                                        <Image src="/steps_7th_hill.png" alt="Steps" fill className="object-cover transition-all duration-1000 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-8 left-8 text-white">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Current View</p>
                                            <h4 className="text-2xl font-black italic">The 7th Hill Ascent</h4>
                                        </div>
                                    </div>
                                    <div className="relative h-64 rounded-[40px] overflow-hidden group shadow-xl">
                                        <Image src="/temple_shrine.png" alt="Shrine" fill className="object-cover transition-all duration-1000 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-8 left-8 text-white">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Sacred Goal</p>
                                            <h4 className="text-2xl font-black italic">The Divine Cave Presence</h4>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="calendar" className="mt-0 outline-none">
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                    <div className="lg:col-span-3">
                                        <Card className="bg-white border-none rounded-[56px] p-10 h-[700px] shadow-2xl shadow-neutral-200/40 relative overflow-hidden admin-calendar-container">
                                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600" />
                                            <FullCalendar
                                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                                headerToolbar={{
                                                    left: 'prev,next today',
                                                    center: 'title',
                                                    right: 'dayGridMonth,timeGridWeek'
                                                }}
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
                                    </div>
                                    <div className="space-y-8">
                                        <Card className="bg-white border-none rounded-[56px] p-12 shadow-2xl relative overflow-hidden group border border-neutral-100">
                                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                            <div className="space-y-2 mb-10 border-l-[6px] border-emerald-600 pl-8">
                                                <h3 className="text-3xl font-black text-neutral-900 tracking-tighter italic leading-none">The Daily <span className="text-emerald-600 font-black">Agenda</span></h3>
                                                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.4em] mt-2">Sacred Flow Tracking</p>
                                            </div>
                                            <div className="space-y-6">
                                                {safeBookings.filter(b => {
                                                    const today = new Date().toISOString().split('T')[0];
                                                    return b.date === today;
                                                }).length === 0 ? (
                                                    <div className="text-center py-20 flex flex-col items-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000">
                                                        <div className="p-6 bg-neutral-50 rounded-full shadow-inner"><CalendarIcon className="w-12 h-12 text-neutral-200" /></div>
                                                        <p className="italic font-black text-neutral-400 tracking-tight text-xl">The hills rest today. <br /><span className="text-sm font-medium">No pilgrimages scheduled.</span></p>
                                                    </div>
                                                ) : (
                                                    safeBookings.filter(b => {
                                                        const today = new Date().toISOString().split('T')[0];
                                                        return b.date === today;
                                                    }).slice(0, 4).map((b, i) => (
                                                        <motion.div
                                                            key={b._id}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="p-8 rounded-[36px] bg-neutral-50 border border-neutral-100 flex items-center justify-between group/item hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-900/5"
                                                            onClick={() => { setSelectedBooking(b); setIsDialogOpen(true); }}
                                                        >
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center font-black text-emerald-600 shadow-sm border border-neutral-100 group-hover/item:scale-110 transition-transform">
                                                                    {b.persons}
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-black text-neutral-900 tracking-tight italic leading-none group-hover/item:text-emerald-700 transition-colors uppercase">{b.name}</p>
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{b.timeSlot}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                <ChevronRight className="w-5 h-5 text-neutral-300" />
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-neutral-100">
                                                <Button className="w-full bg-gradient-to-r from-neutral-950 to-neutral-800 text-white rounded-2xl h-14 font-bold shadow-lg hover:from-emerald-900 hover:to-emerald-800 transition-all text-sm flex items-center justify-center gap-3 group">
                                                    <MoreHorizontal className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                                                    <span>View All Bookings</span>
                                                </Button>
                                            </div>
                                        </Card>

                                        <div className="p-12 rounded-[56px] bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-900 text-white shadow-[0_30px_70px_-10px_rgba(5,150,105,0.4)] relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-[url('/steps_7th_hill.png')] opacity-10 grayscale mix-blend-overlay scale-110 group-hover:scale-125 transition-transform duration-[3s]" />
                                            <CalendarIcon className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform duration-1000 rotate-12" />
                                            <div className="relative z-10 space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                                                        <Activity className="w-6 h-6 text-emerald-300" />
                                                    </div>
                                                    <h4 className="text-2xl font-black italic tracking-tighter">Divine Sync Status</h4>
                                                </div>
                                                <p className="text-sm font-bold text-emerald-100/70 leading-relaxed font-sans italic border-l-2 border-white/20 pl-6">
                                                    The energy field at the base camp peaks on <span className="text-white font-black">{peakDate}</span>. Pilgrim resonance is expected to be high. Stay divine.
                                                </p>
                                                <div className="pt-6 flex items-center gap-4">
                                                    <div className="flex -space-x-3">
                                                        {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-emerald-700 bg-emerald-500/20 backdrop-blur-md" />)}
                                                    </div>
                                                    <span className="font-black text-[10px] tracking-[0.2em] uppercase text-emerald-300">Resonant Flow Power</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </AnimatePresence>
                    </Tabs>
                </div>
            </main>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {selectedBooking && (
                    <DialogContent className="max-w-2xl bg-white border border-neutral-200 shadow-[0_40px_100px_rgba(0,0,0,0.05)] rounded-[48px] p-0 overflow-hidden outline-none">
                        <div className="relative h-48 w-full bg-gradient-to-br from-green-600 to-emerald-900 p-12 flex flex-col justify-end">
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/20 blur-[100px] rounded-full" />
                            <div className="flex items-center gap-4 mb-3 relative z-10">
                                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest border border-white/30 backdrop-blur-md">Official Pilgrim Profile</span>
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
                                    <div className={cn("w-4 h-4 rounded-full", selectedBooking.status === 'approved' ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : selectedBooking.status === 'rejected' ? "bg-rose-500" : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]")} />
                                    <div>
                                        <p className="font-black uppercase text-xs tracking-widest text-neutral-900">Current Status</p>
                                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Pilgrim Verification Status</p>
                                    </div>
                                </div>
                                <span className={cn("font-black text-lg", selectedBooking.status === 'approved' ? "text-emerald-600" : selectedBooking.status === 'rejected' ? "text-rose-600" : "text-amber-600")}>{selectedBooking.status.toUpperCase()}</span>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button variant="outline" onClick={() => deleteBooking(selectedBooking._id)} className="h-16 w-16 min-w-16 rounded-2xl border-stone-100 bg-stone-50 text-stone-400 hover:bg-rose-600 hover:text-white transition-all duration-300">
                                    <Trash2 className="w-6 h-6" />
                                </Button>
                                {selectedBooking.status === 'pending' ? (
                                    <div className="flex gap-4 grow">
                                        <Button variant="outline" onClick={() => updateStatus(selectedBooking._id, 'rejected')} className="h-16 rounded-3xl border-stone-100 bg-stone-50 p-6 font-black text-stone-500 hover:bg-neutral-900 hover:text-white grow transition-all">
                                            <X className="mr-3 w-5 h-5" /> REJECT
                                        </Button>
                                        <Button onClick={() => updateStatus(selectedBooking._id, 'approved')} className="h-16 rounded-3xl bg-green-600 hover:bg-green-700 text-white font-black p-6 grow-[2] shadow-lg shadow-green-900/10 transition-all flex items-center justify-center gap-3">
                                            <Check className="w-6 h-6" /> APPROVE BATCH
                                        </Button>
                                    </div>
                                ) : (
                                    <Button onClick={() => setIsDialogOpen(false)} className="h-16 rounded-3xl bg-neutral-900 text-white font-black p-6 grow transition-all shadow-xl">DONE & CLOSE</Button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
                <DialogContent className="max-w-xl bg-white rounded-[40px] p-10 border-none shadow-2xl">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-3xl font-black italic tracking-tighter">Add Sacred <span className="text-green-600">Moment</span></DialogTitle>
                        <DialogDescription className="font-medium text-neutral-500 italic">Upload an image to show in the pilgrirm's gallery.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-2">Visual Source</label>
                            <div className="relative group">
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-300 rounded-[32px] bg-neutral-50 hover:bg-neutral-100 transition-all cursor-pointer overflow-hidden">
                                    {newImage.url ? (
                                        <Image src={newImage.url} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <div className="p-4 bg-white rounded-2xl shadow-sm mb-3">
                                                <Upload className="w-6 h-6 text-green-600" />
                                            </div>
                                            <p className="text-sm font-bold text-neutral-700">Click to upload image</p>
                                            <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1 tracking-widest">SVG, PNG, JPG (MAX. 2MB)</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-2">Caption Header</label>
                            <Input
                                placeholder="E.g. The First Hill Sunrise"
                                value={newImage.caption}
                                onChange={(e) => setNewImage(prev => ({ ...prev, caption: e.target.value }))}
                                className="h-14 rounded-2xl border-neutral-100 bg-neutral-50/50 focus:ring-green-100 font-bold"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-2">Context Category</label>
                            <Select value={newImage.category} onValueChange={(val) => setNewImage(prev => ({ ...prev, category: val }))}>
                                <SelectTrigger className="h-14 rounded-2xl border-neutral-100 bg-neutral-50/50">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="path">The Sacred Path</SelectItem>
                                    <SelectItem value="summit">The Peak Summit</SelectItem>
                                    <SelectItem value="valley">Lush Valleys</SelectItem>
                                    <SelectItem value="temple">Divine Shrines</SelectItem>
                                    <SelectItem value="other">General Journey</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="mt-12 gap-4">
                        <Button variant="outline" onClick={() => setIsGalleryDialogOpen(false)} className="h-14 px-8 rounded-2xl font-bold border-neutral-100 hover:bg-neutral-50">Cancel</Button>
                        <Button onClick={addGalleryImage} disabled={!newImage.url || !newImage.caption || uploading} className="h-14 px-8 rounded-2xl font-black bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/10 grow">
                            {uploading ? "Uploading..." : "Publish to Gallery"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
