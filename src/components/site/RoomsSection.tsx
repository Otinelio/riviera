import { motion } from "framer-motion";
import { useState } from "react";
import { rooms, type Room } from "@/data/hotel";
import { Check, ArrowRight, X } from "lucide-react";
import { waLink } from "@/lib/hotel";

export default function RoomsSection() {
  const [open, setOpen] = useState<Room | null>(null);
  return (
    <section id="chambres" className="py-24 bg-ivory">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Hébergements"
          title="Nos Chambres & Suites"
          desc="15 chambres pensées pour votre bien-être, face à l'océan ou nichées dans notre jardin tropical."
        />

        <div className="mt-16 space-y-8">
          {rooms.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group grid md:grid-cols-5 gap-0 bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-elegant transition-shadow"
            >
              <div className="md:col-span-3 relative overflow-hidden h-72 md:h-auto">
                <img
                  src={r.images[0]}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ivory/90 backdrop-blur text-xs font-medium text-ocean">
                  {r.view}
                </div>
              </div>
              <div className="md:col-span-2 p-8 flex flex-col">
                <h3 className="font-display text-3xl text-navy">{r.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.bed}</p>
                <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{r.description}</p>
                <ul className="mt-5 grid grid-cols-2 gap-2">
                  {r.amenities.slice(0, 6).map((a) => (
                    <li key={a} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check size={12} className="text-tropical" /> {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6 flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-display text-ocean">{r.price}€</div>
                    <div className="text-xs text-muted-foreground">/ nuit</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpen(r)}
                      className="px-4 py-2.5 rounded-full text-sm border border-border hover:border-ocean transition-colors"
                    >
                      Détails
                    </button>
                    <a
                      href={waLink(`🏨 *RÉSERVATION*\n*${r.name}* — ${r.price}€/nuit\n\nBonjour, je souhaite réserver cette chambre.`)}
                      target="_blank" rel="noreferrer"
                      className="px-4 py-2.5 rounded-full text-sm bg-coral text-ivory hover:scale-105 transition-transform inline-flex items-center gap-1"
                    >
                      Réserver <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {open && <RoomModal room={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

function RoomModal({ room, onClose }: { room: Room; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="fixed inset-0 z-[100] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-ivory rounded-2xl max-w-4xl w-full overflow-hidden my-8" onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-80">
          <img src={room.images[idx]} alt="" className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ivory/90 flex items-center justify-center">
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {room.images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full ${i === idx ? "bg-ivory" : "bg-ivory/40"}`} />
            ))}
          </div>
        </div>
        <div className="p-8">
          <h3 className="font-display text-3xl text-navy">{room.name}</h3>
          <p className="text-muted-foreground mt-2">{room.description}</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
            {room.amenities.map((a) => (
              <div key={a} className="flex items-center gap-2 text-sm">
                <Check size={14} className="text-tropical" /> {a}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <div>
              <div className="text-3xl font-display text-ocean">{room.price}€<span className="text-sm text-muted-foreground"> / nuit</span></div>
            </div>
            <a
              href={waLink(`🏨 *RÉSERVATION*\n*${room.name}* — ${room.price}€/nuit\n\nBonjour, je souhaite réserver cette chambre.`)}
              target="_blank" rel="noreferrer"
              className="px-6 py-3 rounded-full bg-coral text-ivory font-medium"
            >
              Réserver via WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, desc, light }: { eyebrow: string; title: string; desc?: string; light?: boolean }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className={`text-xs uppercase tracking-[0.4em] ${light ? "text-sand" : "text-coral"} mb-4`}>{eyebrow}</div>
      <h2 className={`font-display text-4xl md:text-5xl ${light ? "text-ivory" : "text-navy"} text-balance`}>{title}</h2>
      {desc && <p className={`mt-4 ${light ? "text-ivory/70" : "text-muted-foreground"} text-balance`}>{desc}</p>}
    </div>
  );
}
