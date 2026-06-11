import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { heroSlides } from "@/data/hotel";

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6 }}
          className="absolute inset-0"
        >
          <img src={heroSlides[i]} alt="" className="w-full h-full object-cover animate-ken-burns" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/30 to-navy/80" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-ivory">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs tracking-wider uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
          Plage privée • Piscine • 2 Restaurants
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl text-shadow-hero leading-[1.05] max-w-5xl text-balance"
        >
          Hotel Riviera <em className="font-accent text-sand">Ramatou</em> Plage
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-6 text-lg md:text-xl max-w-xl text-ivory/90 text-shadow-hero"
        >
          L'Atlantique à vos pieds — une parenthèse tropicale au cœur de Lomé, Togo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#booking"
            className="px-8 py-4 rounded-full bg-coral text-ivory font-medium hover:scale-105 transition-transform shadow-elegant"
          >
            Réserver ma chambre
          </a>
          <a
            href="#chambres"
            className="px-8 py-4 rounded-full border border-ivory/40 text-ivory font-medium hover:bg-ivory/10 backdrop-blur-md transition-colors"
          >
            Découvrir l'hôtel
          </a>
        </motion.div>

        {/* slide dots */}
        <div className="absolute bottom-28 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1 rounded-full transition-all ${idx === i ? "w-10 bg-coral" : "w-5 bg-ivory/40"}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 text-ivory/70"
        >
          <ChevronDown size={28} />
        </motion.div>
      </div>
    </section>
  );
}
