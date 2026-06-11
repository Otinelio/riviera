import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed, Sparkles, AlertCircle, Headphones, AlarmClock, ThumbsUp,
  ArrowLeft, Plus, Minus, Trash2, Send, X, Star, Phone, MessageCircle, Car, Plane,
  Zap, Wind, Droplets, Wifi, KeyRound, Settings as SettingsIcon, Waves,
} from "lucide-react";
import { useRiviera, waLinkFromStore, type MenuItem } from "@/store/riviera";

export const Route = createFileRoute("/chambre/$roomNumber")({
  head: () => ({
    meta: [
      { title: "Service en chambre — Ramatou Plage" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChambrePage,
});

type View = "hub" | "service" | "house" | "maint" | "help" | "wake" | "review";

function ChambrePage() {
  const { roomNumber } = Route.useParams();
  const [name, setName] = useState("");
  const [askName, setAskName] = useState(true);
  const [view, setView] = useState<View>("hub");
  const settings = useRiviera((s) => s.settings);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const k = `guest_${roomNumber}`;
    const stored = sessionStorage.getItem(k);
    if (stored) { setName(stored); setAskName(false); }
  }, [roomNumber]);

  const saveName = () => {
    if (!name.trim()) return;
    sessionStorage.setItem(`guest_${roomNumber}`, name);
    setAskName(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.52_0.07_200)] to-[oklch(0.28_0.07_250)] text-ivory">
      <AnimatePresence>
        {askName && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-ocean/95 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-ivory text-foreground rounded-3xl p-8 max-w-md w-full text-center shadow-elegant">
              <Waves className="mx-auto text-coral" size={40} />
              <div className="font-accent italic text-coral text-lg mt-2">Bienvenue</div>
              <h1 className="font-display text-4xl text-navy mt-2">Chambre {roomNumber}</h1>
              <p className="text-muted-foreground mt-4 text-sm">Votre prénom pour ce séjour :</p>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre prénom"
                className="mt-6 w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-ocean text-center text-lg" />
              <button onClick={saveName} className="mt-4 w-full py-3.5 rounded-full bg-coral text-ivory font-medium">Continuer</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="container mx-auto px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {view !== "hub" && (
            <button onClick={() => setView("hub")} className="w-10 h-10 rounded-full bg-ivory/10 flex items-center justify-center">
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="w-10 h-10 rounded-full bg-ivory/10 flex items-center justify-center"><Waves size={18} /></div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-sand">Ramatou Plage</div>
            <div className="font-display text-xl leading-none">Chambre {roomNumber}</div>
          </div>
        </div>
        <div className="text-sm text-ivory/80">Bonjour, {name || "—"}</div>
      </header>

      <main className="container mx-auto px-5 pb-24">
        {view === "hub" && <ActionHub onPick={setView} />}
        {view === "service" && <RoomServiceView room={roomNumber} guest={name} whatsapp={settings.whatsapp} />}
        {view === "house" && <HousekeepingView room={roomNumber} guest={name} />}
        {view === "maint" && <MaintenanceView room={roomNumber} guest={name} />}
        {view === "help" && <HelpView whatsapp={settings.whatsapp} phone={settings.phone} />}
        {view === "wake" && <WakeView room={roomNumber} guest={name} />}
        {view === "review" && <ReviewView room={roomNumber} guest={name} whatsapp={settings.whatsapp} />}
      </main>
    </div>
  );
}

function ActionHub({ onPick }: { onPick: (v: View) => void }) {
  const tiles = [
    { v: "service" as View, i: UtensilsCrossed, t: "Room Service", d: "Commander un repas ou une boisson" },
    { v: "house" as View, i: Sparkles, t: "Demande d'Entretien", d: "Serviettes, literie, nettoyage" },
    { v: "maint" as View, i: AlertCircle, t: "Signaler un Problème", d: "Panne ou problème technique" },
    { v: "help" as View, i: Headphones, t: "Assistance & Aide", d: "Contacter la réception" },
    { v: "wake" as View, i: AlarmClock, t: "Réveil Programmé", d: "Programmer votre réveil" },
    { v: "review" as View, i: ThumbsUp, t: "Recommandations", d: "Partager votre avis" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {tiles.map(({ v, i: I, t, d }) => (
        <button key={v} onClick={() => onPick(v)}
          className="aspect-square rounded-3xl bg-ivory/10 backdrop-blur border border-ivory/15 p-5 flex flex-col items-start text-left hover:bg-ivory/15 hover:scale-[1.02] transition">
          <div className="w-12 h-12 rounded-2xl bg-coral/90 flex items-center justify-center"><I size={22} /></div>
          <div className="mt-auto">
            <div className="font-display text-xl">{t}</div>
            <div className="text-xs text-ivory/70 mt-1">{d}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 bg-ivory text-foreground rounded-3xl p-6">
      <h2 className="font-display text-2xl text-navy mb-4">{title}</h2>
      {children}
    </div>
  );
}

function RoomServiceView({ room, guest, whatsapp }: { room: string; guest: string; whatsapp: string }) {
  const menu = useRiviera((s) => s.menu);
  const addOrder = useRiviera((s) => s.addOrder);
  const categories = Array.from(new Set(menu.filter((m) => m.available).map((m) => m.category)));
  const [cat, setCat] = useState(categories[0] ?? "Plats");
  const [cart, setCart] = useState<{ item: MenuItem; qty: number }[]>([]);
  const [instr, setInstr] = useState("");
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const add = (i: MenuItem) =>
    setCart((c) => {
      const e = c.find((x) => x.item.id === i.id);
      return e ? c.map((x) => (x.item.id === i.id ? { ...x, qty: x.qty + 1 } : x)) : [...c, { item: i, qty: 1 }];
    });
  const inc = (id: string, d: number) =>
    setCart((c) => c.flatMap((x) => (x.item.id === id ? (x.qty + d <= 0 ? [] : [{ ...x, qty: x.qty + d }]) : [x])));

  const total = cart.reduce((s, x) => s + x.item.price * x.qty, 0);

  const send = () => {
    if (!cart.length) return;
    addOrder({
      room, guest,
      items: cart.map((x) => ({ id: x.item.id, name: x.item.name, qty: x.qty, price: x.item.price })),
      total,
      instructions: instr,
    });
    const lines = cart.map((x) => `• ${x.qty}x ${x.item.name} — ${(x.item.price * x.qty).toFixed(2)}€`);
    const msg = `ROOM SERVICE — Ramatou Plage\nChambre ${room} · ${guest}\n${lines.join("\n")}\nTotal : ${total.toFixed(2)}€\n${instr ? "Notes : " + instr : ""}`;
    window.open(waLinkFromStore(msg, whatsapp), "_blank");
    setSent(true);
    setCart([]); setInstr(""); setOpen(false);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <Panel title="Room Service">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm ${cat === c ? "bg-navy text-ivory" : "bg-muted text-navy"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {menu.filter((m) => m.available && m.category === cat).map((m) => (
          <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-muted">
            <div className="flex-1">
              <div className="font-medium text-navy">{m.name}</div>
              {m.description && <div className="text-xs text-muted-foreground">{m.description}</div>}
              <div className="text-sand font-medium mt-1">{m.price.toFixed(2)}€</div>
            </div>
            <button onClick={() => add(m)} className="w-10 h-10 rounded-full bg-ocean text-ivory flex items-center justify-center"><Plus size={18} /></button>
          </div>
        ))}
      </div>

      <button onClick={() => setOpen(true)} disabled={!cart.length}
        className="fixed bottom-6 left-5 right-5 mx-auto max-w-md py-4 rounded-full bg-coral text-ivory font-medium disabled:opacity-50 shadow-elegant">
        Voir le panier ({cart.reduce((s, x) => s + x.qty, 0)}) — {total.toFixed(2)}€
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy/60" onClick={() => setOpen(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="absolute bottom-0 inset-x-0 bg-ivory text-foreground rounded-t-3xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="font-display text-2xl text-navy">Votre commande</h3>
                <button onClick={() => setOpen(false)}><X /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {cart.map((x) => (
                  <div key={x.item.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                    <div className="flex-1">
                      <div className="font-medium text-navy">{x.item.name}</div>
                      <div className="text-xs text-muted-foreground">{x.item.price.toFixed(2)}€</div>
                    </div>
                    <button onClick={() => inc(x.item.id, -1)} className="w-8 h-8 rounded-full bg-ivory border border-border flex items-center justify-center"><Minus size={14} /></button>
                    <span className="w-6 text-center">{x.qty}</span>
                    <button onClick={() => inc(x.item.id, 1)} className="w-8 h-8 rounded-full bg-ivory border border-border flex items-center justify-center"><Plus size={14} /></button>
                    <button onClick={() => inc(x.item.id, -x.qty)} className="text-coral"><Trash2 size={16} /></button>
                  </div>
                ))}
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Instructions spéciales</label>
                  <textarea value={instr} onChange={(e) => setInstr(e.target.value)}
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-border min-h-20 outline-none focus:border-ocean" />
                </div>
                <div className="text-sm text-muted-foreground">Livraison estimée : 20–30 min</div>
              </div>
              <div className="p-6 border-t border-border">
                <div className="flex justify-between mb-3 font-display text-xl text-navy">
                  <span>Total</span><span className="text-coral">{total.toFixed(2)}€</span>
                </div>
                <button onClick={send} className="w-full py-4 rounded-full bg-coral text-ivory font-medium flex items-center justify-center gap-2">
                  <Send size={18} /> Envoyer ma commande
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {sent && (
        <div className="fixed bottom-24 left-5 right-5 mx-auto max-w-md p-4 rounded-2xl bg-tropical text-ivory text-center shadow-elegant">
          Commande reçue ! Livraison estimée : 20–30 min
        </div>
      )}
    </Panel>
  );
}

function HousekeepingView({ room, guest }: { room: string; guest: string }) {
  const add = useRiviera((s) => s.addHousekeeping);
  const opts = ["Serviettes supplémentaires", "Changement de draps", "Nettoyage de la chambre", "Recharge produits de toilette", "Sacs poubelle", "Plateau de bienvenue (eau, fruits)"];
  const [sel, setSel] = useState<string[]>([]);
  const [time, setTime] = useState("Maintenant");
  const [ok, setOk] = useState(false);
  const submit = () => {
    if (!sel.length) return;
    add({ room, guest, items: sel, preferredTime: time });
    setSel([]); setOk(true); setTimeout(() => setOk(false), 3000);
  };
  return (
    <Panel title="Demande d'Entretien">
      <div className="space-y-2">
        {opts.map((o) => {
          const checked = sel.includes(o);
          return (
            <label key={o} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border ${checked ? "bg-ocean/10 border-ocean" : "bg-muted border-transparent"}`}>
              <input type="checkbox" checked={checked} onChange={() => setSel((s) => checked ? s.filter((x) => x !== o) : [...s, o])} />
              <span className="text-navy">{o}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-5">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Préférence horaire</div>
        <div className="flex flex-wrap gap-2">
          {["Maintenant", "Dans 1h", "Ce soir", "Demain matin"].map((t) => (
            <button key={t} onClick={() => setTime(t)}
              className={`px-4 py-2 rounded-full text-sm ${time === t ? "bg-navy text-ivory" : "bg-muted text-navy"}`}>{t}</button>
          ))}
        </div>
      </div>
      <button onClick={submit} className="mt-6 w-full py-3.5 rounded-full bg-coral text-ivory">Envoyer ma demande</button>
      {ok && <div className="mt-3 text-center text-tropical">Demande transmise.</div>}
    </Panel>
  );
}

function MaintenanceView({ room, guest }: { room: string; guest: string }) {
  const add = useRiviera((s) => s.addMaintenance);
  const cats = [
    { l: "Problème électrique", i: Zap }, { l: "Climatisation", i: Wind },
    { l: "Plomberie / Eau", i: Droplets }, { l: "Internet / TV", i: Wifi },
    { l: "Serrure / Clé", i: KeyRound }, { l: "Autre", i: SettingsIcon },
  ];
  const [cat, setCat] = useState(cats[0].l);
  const [desc, setDesc] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [ok, setOk] = useState(false);
  const submit = () => {
    add({ room, guest, category: cat, description: desc, urgent });
    setDesc(""); setOk(true); setTimeout(() => setOk(false), 3000);
  };
  return (
    <Panel title="Signaler un Problème">
      <div className="grid grid-cols-2 gap-2">
        {cats.map(({ l, i: I }) => (
          <button key={l} onClick={() => setCat(l)}
            className={`p-4 rounded-2xl flex flex-col items-start gap-2 border ${cat === l ? "bg-ocean/10 border-ocean" : "bg-muted border-transparent"}`}>
            <I size={20} className="text-ocean" />
            <span className="text-sm text-navy">{l}</span>
          </button>
        ))}
      </div>
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optionnel)"
        className="mt-4 w-full px-4 py-3 rounded-xl border border-border min-h-24 outline-none focus:border-ocean" />
      <div className="mt-4 flex gap-2">
        <button onClick={() => setUrgent(false)} className={`flex-1 py-2 rounded-full ${!urgent ? "bg-sand text-navy" : "bg-muted text-navy"}`}>Normal</button>
        <button onClick={() => setUrgent(true)} className={`flex-1 py-2 rounded-full ${urgent ? "bg-destructive text-ivory" : "bg-muted text-navy"}`}>Urgent</button>
      </div>
      <button onClick={submit} className="mt-6 w-full py-3.5 rounded-full bg-coral text-ivory">Signaler</button>
      {ok && <div className="mt-3 text-center text-tropical">Notre équipe maintenance est informée. Intervention sous 30 min.</div>}
    </Panel>
  );
}

function HelpView({ whatsapp, phone }: { whatsapp: string; phone: string }) {
  const cards = [
    { i: Phone, l: "Appeler la réception", href: `tel:${phone}` },
    { i: MessageCircle, l: "WhatsApp réception", href: waLinkFromStore("Bonjour réception, ", whatsapp) },
    { i: Car, l: "Commander un taxi", href: waLinkFromStore("Bonjour, je souhaite commander un taxi.", whatsapp) },
    { i: Plane, l: "Informations vol", href: "https://flightaware.com" },
  ];
  return (
    <Panel title="Assistance & Aide">
      <div className="grid grid-cols-2 gap-3">
        {cards.map(({ i: I, l, href }) => (
          <a key={l} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            className="p-4 rounded-2xl bg-muted flex flex-col items-start gap-2">
            <I className="text-ocean" />
            <span className="text-sm text-navy">{l}</span>
          </a>
        ))}
      </div>
      <div className="mt-6">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Bon à savoir</div>
        <ul className="text-sm text-navy space-y-1">
          <li>• Petit-déjeuner : 7h30 – 11h00 au restaurant</li>
          <li>• Piscine : 08h00 – 18h00</li>
          <li>• Navette aéroport : 20€ — demander à la réception</li>
          <li>• Check-out : avant 12h00</li>
        </ul>
      </div>
    </Panel>
  );
}

function WakeView({ room, guest }: { room: string; guest: string }) {
  const add = useRiviera((s) => s.addHousekeeping);
  const [time, setTime] = useState("07:00");
  const [note, setNote] = useState("");
  const [ok, setOk] = useState(false);
  const submit = () => {
    add({ room, guest, items: [`Réveil ${time}${note ? " — " + note : ""}`], preferredTime: time });
    setOk(true); setTimeout(() => setOk(false), 3000);
  };
  return (
    <Panel title="Réveil Programmé">
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
        className="w-full px-4 py-4 rounded-xl border border-border text-3xl text-center outline-none focus:border-ocean" />
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Message optionnel (ex: Vol à 9h)"
        className="mt-4 w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-ocean" />
      <button onClick={submit} className="mt-6 w-full py-3.5 rounded-full bg-coral text-ivory flex items-center justify-center gap-2">
        <AlarmClock size={18} /> Programmer le réveil
      </button>
      {ok && <div className="mt-3 text-center text-tropical">Réveil programmé pour {time}.</div>}
    </Panel>
  );
}

function ReviewView({ room, guest, whatsapp }: { room: string; guest: string; whatsapp: string }) {
  const add = useRiviera((s) => s.addFeedback);
  const [r, setR] = useState({ overall: 0, cleanliness: 0, food: 0, staff: 0, value: 0 });
  const [c, setC] = useState("");
  const [wantsCallback, setWantsCallback] = useState(false);
  const [callback, setCallback] = useState("");
  const [done, setDone] = useState(false);
  const cats: [keyof typeof r, string][] = [
    ["overall", "Séjour global"], ["cleanliness", "Propreté"], ["food", "Restauration"], ["staff", "Personnel"], ["value", "Valeur"],
  ];
  const submit = () => {
    add({ room, guest, ratings: r, comment: c, callback: wantsCallback ? callback : undefined });
    if (r.overall > 0 && r.overall < 3) {
      window.open(waLinkFromStore(`ALERTE QUALITE — Chambre ${room} · ${guest}\nNote : ${r.overall}/5\n${c}`, whatsapp), "_blank");
    }
    setDone(true);
  };
  if (done) {
    return (
      <Panel title="Merci !">
        <div className="text-center py-8">
          <ThumbsUp size={48} className="mx-auto text-tropical" />
          <div className="mt-4 font-display text-xl text-navy">Votre avis a été transmis.</div>
        </div>
      </Panel>
    );
  }
  return (
    <Panel title="Recommandations & Avis">
      <div className="space-y-4">
        {cats.map(([k, l]) => (
          <div key={k}>
            <div className="text-sm text-navy mb-1">{l}</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setR({ ...r, [k]: n })}>
                  <Star size={28} className={n <= r[k] ? "fill-sand text-sand" : "text-muted-foreground"} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <textarea value={c} onChange={(e) => setC(e.target.value)} placeholder="Partagez votre expérience"
        className="mt-5 w-full px-4 py-3 rounded-xl border border-border min-h-24 outline-none focus:border-ocean" />
      <label className="mt-4 flex items-center gap-2 text-sm text-navy">
        <input type="checkbox" checked={wantsCallback} onChange={(e) => setWantsCallback(e.target.checked)} />
        Souhaite être recontacté
      </label>
      {wantsCallback && (
        <input value={callback} onChange={(e) => setCallback(e.target.value)} placeholder="Téléphone"
          className="mt-2 w-full px-4 py-3 rounded-xl border border-border" />
      )}
      <button onClick={submit} className="mt-6 w-full py-3.5 rounded-full bg-coral text-ivory">Envoyer mon avis</button>
    </Panel>
  );
}
