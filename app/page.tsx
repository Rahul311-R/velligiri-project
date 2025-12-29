import Image from "next/image";
import { BookingForm } from "@/components/BookingForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white selection:bg-green-500/30">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden">
        {/* Background with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Velliangiri Hills"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-neutral-900" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-8 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-green-300 text-sm font-medium tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Next Trek: This Weekend
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                Ascend the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                  Seven Hills
                </span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-200/90 font-light max-w-lg mx-auto md:mx-0 leading-relaxed">
                Embark on a divine journey to the Kailash of the South. Book expert guides for a safe, spiritual, and unforgettable trekking experience.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-4 w-full max-w-sm mx-auto md:mx-0 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold text-white">7</p>
                <p className="text-sm text-neutral-400 font-medium uppercase tracking-wider">Hills</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">6k+</p>
                <p className="text-sm text-neutral-400 font-medium uppercase tracking-wider">Steps</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-sm text-neutral-400 font-medium uppercase tracking-wider">Divine</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="w-full max-w-md mx-auto md:ml-auto animate-in scale-in-95 fade-in duration-1000 delay-200">
            <BookingForm />
          </div>

        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block opacity-50">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* Gallery / Experience Section */}
      <section className="py-24 bg-neutral-900 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Witness the Divine <span className="text-green-500">Velliangiri</span></h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
              Every step on the Velliangiri Mountains is a prayer, every breath is grace. Experience the intense spiritual energy of the Kailash of the South.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {/* Image 1: Path */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-800 shadow-2xl">
              <Image
                src="/trek_path.png"
                alt="Velliangiri Trekking Path"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 p-6 translate-y-4 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-bold text-white">The Sacred Path</h3>
                <p className="text-sm text-neutral-300">A journey of endurance through the Velliangiri forest.</p>
              </div>
            </div>

            {/* Image 2: Shrine/Temple */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-800 md:-translate-y-12 shadow-2xl ring-1 ring-white/10">
              <Image
                src="/temple_shrine.png"
                alt="Velliangiri Peak Temple"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 p-6 translate-y-4 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-bold text-white">The 7th Hill Summit</h3>
                <p className="text-sm text-neutral-300">Where the divine Lord Shiva resides.</p>
              </div>
            </div>

            {/* Image 3: View */}
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-800 shadow-2xl">
              <Image
                src="/sunrise_view.png"
                alt="Velliangiri Sunrise"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 p-6 translate-y-4 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-bold text-white">Divine Sunrise</h3>
                <p className="text-sm text-neutral-300">Golden rays touching the Velliangiri peaks.</p>
              </div>
            </div>
          </div>

          {/* New Extensive Section */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                The Legend of <span className="text-green-400">South Kailash</span>
              </h3>
              <p className="text-neutral-400 text-lg leading-relaxed">
                The Velliangiri Mountains, situated at the foothills of the Nilgiris, are known as the "Kailash of the South". These mountains are held sacred as a space where Lord Shiva spent time in meditation.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-green-900/50 flex items-center justify-center border border-green-500/30 text-green-400 font-bold">1</div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">7 Hills Challenge</h4>
                    <p className="text-neutral-500 mt-1">A test of devotion and physical endurance across seven varying altitudes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-green-900/50 flex items-center justify-center border border-green-500/30 text-green-400 font-bold">2</div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">Adiyogi Foothills</h4>
                    <p className="text-neutral-500 mt-1">Start your journey near the magnificent Adiyogi statue, absorbing the spiritual aura.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
              <Image
                src="/steps_7th_hill.png"
                alt="Steps to 7th Hill Velliangiri"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-green-400 font-medium tracking-wide uppercase text-sm mb-2">The Ascent</p>
                <h4 className="text-3xl font-bold text-white mb-2">The Stairway to Grace</h4>
                <p className="text-neutral-300">The treacherous yet fulfilling climb to the final abode.</p>
              </div>
            </div>
          </div>

          {/* Adiyogi Section */}
          <div className="mt-32 relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 w-full group">
            <Image
              src="/adiyogi.png"
              alt="Adiyogi at Velliangiri Foothills"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tighter">OM NAMAH SHIVAYA</h2>
              <p className="text-white/80 text-xl md:text-2xl mt-4 font-light max-w-2xl drop-shadow-lg">
                Begin your Velliangiri pilgrimage with the blessings of the First Yogi.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Velliangiri Guide Booking. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-60">Made with devotion.</p>
      </footer>
    </div>
  );
}
