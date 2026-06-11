import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { n: 15, label: "Chambres", suffix: "" },
  { n: 2, label: "Restaurants", suffix: "" },
  { n: 1, label: "Plage Privée", suffix: "" },
  { n: 8, label: "Aéroport", suffix: "km" },
];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export default function Highlights() {
  return (
    <section className="py-24 bg-ivory">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="text-xs uppercase tracking-[0.4em] text-coral mb-4">Notre histoire</div>
            <h2 className="font-display text-5xl text-navy text-balance">
              Une parenthèse <em className="font-accent text-ocean">tropicale</em> au bord de l'Atlantique
            </h2>
            <p className="mt-6 text-foreground/80 leading-relaxed">
              Au bord de l'Atlantique à Lomé, l'Hôtel Riviera Ramatou Plage vous offre une parenthèse tropicale entre océan et palmiers. Plage privée, piscine ouverte sur la mer, restaurants en bord de plage et service attentionné — tout est réuni pour faire de votre séjour un moment inoubliable.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <div className="font-display text-4xl text-ocean"><Counter to={s.n} suffix={s.suffix} /></div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-elegant">
              <img src="https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&w=1400&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-2xl overflow-hidden border-4 border-ivory shadow-soft hidden md:block">
              <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -right-4 px-5 py-3 rounded-2xl bg-sand text-navy shadow-soft animate-float">
              <div className="font-accent text-lg">Lomé, Togo</div>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-6">
          {[
            { title: "Détente", desc: "Piscine extérieure, plage privée, jardin tropical", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80" },
            { title: "Gastronomie", desc: "Cuisine locale & internationale, paillote vue mer", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80" },
            { title: "Événements", desc: "2 salles de réunion jusqu'à 250m², équipement AV", img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80" },
          ].map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group relative h-72 rounded-3xl overflow-hidden">
              <img src={c.img} alt={c.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-ivory">
                <h3 className="font-display text-2xl">{c.title}</h3>
                <p className="text-sm text-ivory/80 mt-1">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
