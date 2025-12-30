"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, MountainIcon, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLogin() {
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            })

            if (res.ok) {
                router.push("/admin")
            } else {
                setError("Invalid spiritual key")
            }
        } catch (err) {
            setError("Connection failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] overflow-hidden relative">
            {/* Spiritual background glows */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-100/50 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-50/50 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <Card className="border-none shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-[40px] bg-white/80 backdrop-blur-xl overflow-hidden px-2">
                    <CardHeader className="space-y-4 pt-12 pb-8">
                        <div className="flex justify-center mb-2">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="h-20 w-20 bg-gradient-to-br from-green-600 to-emerald-800 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-900/20"
                            >
                                <MountainIcon className="h-10 w-10 text-white" />
                            </motion.div>
                        </div>
                        <div className="text-center space-y-1">
                            <CardTitle className="text-3xl font-black text-neutral-900 italic tracking-tighter">
                                Velligiri<span className="text-green-600 font-bold not-italic">Hills</span>
                            </CardTitle>
                            <CardDescription className="text-neutral-500 font-bold text-xs uppercase tracking-[0.2em]">
                                Admin Command Access
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-12 px-10">
                        <form onSubmit={handleLogin} className="space-y-8">
                            <div className="space-y-3">
                                <Label htmlFor="password" title="Access Key" className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">Guardian Key</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-14 rounded-2xl border-neutral-100 bg-white/50 focus:ring-green-100 transition-all font-mono"
                                    required
                                />
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <Button
                                className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-lg transition-all shadow-xl shadow-green-900/10"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Verifying...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span>Authorize Entry</span>
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center mt-10 text-[10px] text-neutral-400 font-black uppercase tracking-[0.4em]">
                    Sacred Security Protocol v2.4
                </p>
            </motion.div>
        </div>
    )
}
