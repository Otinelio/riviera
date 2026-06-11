import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  LayoutDashboard, CalendarCheck, BedDouble, UtensilsCrossed, ChefHat,
  Sparkles, Wrench, ThumbsUp, Image as ImageIcon, QrCode as QrCodeIcon, Settings as SettingsIcon,
  LogOut, Star, Trash2, Plus, Printer,
} from "lucide-react";
import {
  useRiviera, type Order, type RoomStatus, type MenuItem,
} from "@/store/riviera";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Ramatou Plage" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Mod = "dash" | "res" | "rooms" | "rs" | "menu" | "house" | "maint" | "fb" | "gal" | "qr" | "set";

const nav: { k: Mod; l: string; I: typeof LayoutDashboard }[] = [
  { k: "dash", l: "Dashboard", I: LayoutDashboard },
  { k: "res", l: "Réservations", I: CalendarCheck },
  { k: "rooms", l: "Chambres", I: BedDouble },
  { k: "rs", l: "Room Service", I: UtensilsCrossed },
  { k: "menu", l: "Menu", I: ChefHat },
  { k: "house", l: "Entretien", I: Sparkles },
  { k: "maint", l: "Maintenance", I: Wrench },
  { k: "fb", l: "Avis", I: ThumbsUp },
  { k: "gal", l: "Galerie", I: ImageIcon },
  { k: "qr", l: "QR Codes", I: QrCodeIcon },
  { k: "set", l: "Paramètres", I: SettingsIcon },
];

function AdminPage() {
  const settings = useRiviera((s) => s.settings);
  const [auth, setAuth] = useState(false);
  const [mod, setMod] = useState<Mod>("dash");
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("admin_ok") === "1") setAuth(true);
  }, []);

  // Auto-lock
  useEffect(() => {
    if (!auth) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { sessionStorage.removeItem("admin_ok"); setAuth(false); }, settings.autoLockMin * 60 * 1000);
    };
    reset();
    ["click", "keydown", "mousemove"].forEach((e) => window.addEventListener(e, reset));
    return () => {
      clearTimeout(timer);
      ["click", "keydown", "mousemove"].forEach((e) => window.removeEventListener(e, reset));
    };
  }, [auth, settings.autoLockMin]);

  if (!auth) {
    const submit = () => {
      const enc = typeof btoa !== "undefined" ? btoa(pin) : "";
      if (enc === settings.pin || enc === settings.receptionPin) {
        sessionStorage.setItem("admin_ok", "1");
        setAuth(true);
      } else {
        alert("Code incorrect");
        setPin("");
      }
    };
    return (
      <div className="min-h-screen bg-navy text-ivory flex items-center justify-center p-6">
        <div className="bg-ivory text-foreground rounded-3xl p-8 max-w-sm w-full text-center">
          <div className="font-display text-3xl text-navy">Administration</div>
          <div className="text-xs text-muted-foreground mt-1">Riviera Ramatou Plage</div>
          <div className="mt-6 text-3xl tracking-[0.6em] font-mono h-12">{pin.padEnd(4, "·")}</div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[1,2,3,4,5,6,7,8,9].map((n) => (
              <button key={n} onClick={() => setPin((p) => (p + n).slice(0, 4))}
                className="aspect-square rounded-2xl bg-muted text-2xl font-display">{n}</button>
            ))}
            <button onClick={() => setPin("")} className="aspect-square rounded-2xl bg-muted text-sm">C</button>
            <button onClick={() => setPin((p) => (p + "0").slice(0, 4))} className="aspect-square rounded-2xl bg-muted text-2xl font-display">0</button>
            <button onClick={submit} disabled={pin.length !== 4} className="aspect-square rounded-2xl bg-coral text-ivory disabled:opacity-50">OK</button>
          </div>
          <div className="text-[10px] text-muted-foreground mt-4">PIN par défaut : 1234</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      <aside className="w-60 bg-navy text-ivory flex flex-col">
        <div className="p-5 border-b border-ivory/10">
          <div className="font-display text-xl">Ramatou Plage</div>
          <div className="text-[10px] uppercase tracking-widest text-sand">Administration</div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map(({ k, l, I }) => (
            <button key={k} onClick={() => setMod(k)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition ${
                mod === k ? "bg-ivory/10 border-l-2 border-coral" : "hover:bg-ivory/5"
              }`}>
              <I size={16} /> {l}
            </button>
          ))}
        </nav>
        <button onClick={() => { sessionStorage.removeItem("admin_ok"); setAuth(false); }}
          className="m-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-ivory/5 text-sm hover:bg-ivory/10">
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {mod === "dash" && <Dashboard />}
          {mod === "res" && <Reservations />}
          {mod === "rooms" && <Rooms />}
          {mod === "rs" && <RoomServiceLive />}
          {mod === "menu" && <MenuManager />}
          {mod === "house" && <HousekeepingMod />}
          {mod === "maint" && <MaintenanceMod />}
          {mod === "fb" && <Feedback />}
          {mod === "gal" && <Gallery />}
          {mod === "qr" && <QrModule />}
          {mod === "set" && <Params />}
        </div>
      </main>
    </div>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h1 className="font-display text-4xl text-navy mb-6">{children}</h1>;
}
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-card rounded-2xl border border-border p-5 ${className}`}>{children}</div>;
}

function Dashboard() {
  const rooms = useRiviera((s) => s.rooms);
  const orders = useRiviera((s) => s.orders);
  const house = useRiviera((s) => s.housekeeping);
  const maint = useRiviera((s) => s.maintenance);
  const fb = useRiviera((s) => s.feedback);
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);

  const feed = [
    ...orders.slice(0, 5).map((o) => ({ t: o.createdAt, l: `Commande chambre ${o.room} (${o.total.toFixed(2)}€)` })),
    ...house.slice(0, 5).map((h) => ({ t: h.createdAt, l: `Entretien chambre ${h.room}` })),
    ...maint.slice(0, 5).map((m) => ({ t: m.createdAt, l: `Maintenance chambre ${m.room} — ${m.category}` })),
  ].sort((a, b) => +new Date(b.t) - +new Date(a.t)).slice(0, 10);

  return (
    <>
      <H>Vue d'ensemble</H>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI l="Chambres occupées" v={rooms.filter((r) => r.status === "Occupée").length} />
        <KPI l="Commandes aujourd'hui" v={todayOrders.length} />
        <KPI l="Demandes en attente" v={house.filter((h) => h.status === "En attente").length + maint.filter((m) => m.status === "Nouveau").length} />
        <KPI l="Avis reçus" v={fb.length} />
      </div>
      <Card className="mt-6">
        <div className="font-display text-xl text-navy mb-4">Activité récente</div>
        {feed.length === 0 && <div className="text-sm text-muted-foreground">Aucune activité.</div>}
        <ul className="divide-y divide-border">
          {feed.map((f, i) => (
            <li key={i} className="py-2 text-sm flex justify-between">
              <span className="text-navy">{f.l}</span>
              <span className="text-muted-foreground">{new Date(f.t).toLocaleString("fr-FR")}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
function KPI({ l, v }: { l: string; v: number }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
      <div className="font-display text-4xl text-coral mt-2">{v}</div>
    </Card>
  );
}

function Reservations() {
  const list = useRiviera((s) => s.reservations);
  const add = useRiviera((s) => s.addReservation);
  const upd = useRiviera((s) => s.updateReservation);
  const rm = useRiviera((s) => s.removeReservation);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ client: "", room: "101", arrival: "", departure: "", type: "Standard", status: "Confirmé" as const });

  const csv = () => {
    const text = "Client,Chambre,Arrivée,Départ,Type,Statut\n" +
      list.map((r) => `${r.client},${r.room},${r.arrival},${r.departure},${r.type},${r.status}`).join("\n");
    navigator.clipboard.writeText(text); alert("Copié.");
  };

  return (
    <>
      <H>Réservations</H>
      <div className="flex justify-between mb-4">
        <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-full bg-coral text-ivory">+ Nouvelle</button>
        <button onClick={csv} className="px-4 py-2 rounded-full border border-border">Copier CSV</button>
      </div>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-navy">
            <tr><th className="text-left p-3">Client</th><th className="p-3">Chambre</th><th className="p-3">Arrivée</th><th className="p-3">Départ</th><th className="p-3">Statut</th><th /></tr>
          </thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={6} className="text-center text-muted-foreground py-6">Aucune réservation</td></tr>}
            {list.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3">{r.client}</td>
                <td className="p-3 text-center">{r.room}</td>
                <td className="p-3 text-center">{r.arrival}</td>
                <td className="p-3 text-center">{r.departure}</td>
                <td className="p-3 text-center">
                  <select value={r.status} onChange={(e) => upd(r.id, { status: e.target.value as typeof r.status })}
                    className="px-2 py-1 rounded border border-border bg-card">
                    {["Confirmé","En attente","Annulé","Check-in"].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </td>
                <td className="p-3"><button onClick={() => rm(r.id)} className="text-coral"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {open && (
        <div className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-ivory rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="font-display text-2xl mb-4">Nouvelle réservation</div>
            {[
              ["Client", "client"], ["Chambre", "room"], ["Arrivée", "arrival", "date"], ["Départ", "departure", "date"], ["Type", "type"],
            ].map(([l, k, t]) => (
              <div key={k} className="mb-3">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{l}</label>
                <input type={t ?? "text"} value={(f as Record<string, string>)[k as string]} onChange={(e) => setF({ ...f, [k as string]: e.target.value })}
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-border" />
              </div>
            ))}
            <button onClick={() => { add(f); setOpen(false); }} className="w-full py-3 rounded-full bg-coral text-ivory mt-2">Créer</button>
          </div>
        </div>
      )}
    </>
  );
}

function Rooms() {
  const rooms = useRiviera((s) => s.rooms);
  const set = useRiviera((s) => s.setRoomStatus);
  const colors: Record<RoomStatus, string> = {
    Libre: "bg-tropical", "Occupée": "bg-coral", Maintenance: "bg-sand", "Nettoyage": "bg-ocean",
  };
  return (
    <>
      <H>Chambres</H>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {rooms.map((r) => (
          <Card key={r.number}>
            <div className="flex justify-between items-start">
              <div className="font-display text-3xl text-navy">{r.number}</div>
              <span className={`w-3 h-3 rounded-full ${colors[r.status]}`} />
            </div>
            <div className="text-xs text-muted-foreground mt-1 capitalize">{r.type.replace(/-/g, " ")}</div>
            <div className="text-sm mt-2">{r.status}</div>
            {r.guestName && <div className="text-xs text-muted-foreground">{r.guestName}</div>}
            <select value={r.status} onChange={(e) => set(r.number, e.target.value as RoomStatus)}
              className="mt-3 w-full px-2 py-1.5 rounded-lg border border-border text-sm bg-card">
              {(["Libre","Occupée","Maintenance","Nettoyage"] as RoomStatus[]).map((s) => <option key={s}>{s}</option>)}
            </select>
          </Card>
        ))}
      </div>
    </>
  );
}

function RoomServiceLive() {
  const orders = useRiviera((s) => s.orders);
  const upd = useRiviera((s) => s.updateOrderStatus);
  const sound = useRiviera((s) => s.settings.notifSound);
  const lastCount = useRef(orders.length);

  useEffect(() => {
    if (orders.length > lastCount.current && sound) {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = 880; g.gain.value = 0.1;
        o.start(); setTimeout(() => { o.stop(); ctx.close(); }, 200);
      } catch { /* noop */ }
    }
    lastCount.current = orders.length;
  }, [orders.length, sound]);

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const revenue = todayOrders.reduce((s, o) => s + o.total, 0);

  const flow: Order["status"][] = ["Nouveau", "En préparation", "En livraison", "Livré"];
  const next = (s: Order["status"]) => flow[Math.min(flow.indexOf(s) + 1, flow.length - 1)];
  const dot: Record<Order["status"], string> = {
    Nouveau: "bg-destructive", "En préparation": "bg-sand", "En livraison": "bg-ocean", Livré: "bg-tropical",
  };

  return (
    <>
      <H>Room Service en direct</H>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <KPI l="Commandes aujourd'hui" v={todayOrders.length} />
        <KPI l="Revenu jour (€)" v={Math.round(revenue)} />
        <KPI l="Actives" v={orders.filter((o) => o.status !== "Livré").length} />
      </div>
      <div className="space-y-3">
        {orders.length === 0 && <Card><div className="text-center text-muted-foreground py-6">Aucune commande</div></Card>}
        {orders.map((o) => (
          <Card key={o.id} className="flex items-start gap-4">
            <div className="text-3xl font-display text-navy w-16">{o.room}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${dot[o.status]}`} />
                <span className="font-medium">{o.guest}</span>
                <span className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleTimeString("fr-FR")}</span>
              </div>
              <ul className="mt-2 text-sm space-y-1">
                {o.items.map((it) => <li key={it.id}>{it.qty}× {it.name} — {(it.qty * it.price).toFixed(2)}€</li>)}
              </ul>
              <div className="mt-2 font-display text-coral">{o.total.toFixed(2)}€</div>
              {o.instructions && <div className="text-xs italic text-muted-foreground mt-1">"{o.instructions}"</div>}
            </div>
            {o.status !== "Livré" && (
              <button onClick={() => upd(o.id, next(o.status))} className="px-4 py-2 rounded-full bg-navy text-ivory text-sm">
                → {next(o.status)}
              </button>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

function MenuManager() {
  const menu = useRiviera((s) => s.menu);
  const cats = useRiviera((s) => s.categories);
  const add = useRiviera((s) => s.addMenuItem);
  const upd = useRiviera((s) => s.updateMenuItem);
  const rm = useRiviera((s) => s.removeMenuItem);
  const addCat = useRiviera((s) => s.addCategory);
  const settings = useRiviera((s) => s.settings);
  const updSettings = useRiviera((s) => s.updateSettings);
  const [newCat, setNewCat] = useState("");
  const [edit, setEdit] = useState<Partial<MenuItem> | null>(null);

  return (
    <>
      <H>Gestion du Menu</H>
      <Card className="mb-6">
        <div className="font-display text-lg text-navy mb-3">Prix spéciaux</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {([
            ["breakfastAdult", "Petit-déj adulte"],
            ["breakfastChild", "Petit-déj enfant"],
            ["extraBed", "Lit d'appoint"],
            ["shuttle", "Navette aéroport"],
          ] as const).map(([k, l]) => (
            <div key={k}>
              <label className="text-xs text-muted-foreground">{l}</label>
              <input type="number" value={settings.tarifs[k]}
                onChange={(e) => updSettings({ tarifs: { ...settings.tarifs, [k]: Number(e.target.value) } })}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-border" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="font-display text-lg text-navy">Catégories</div>
          <div className="flex gap-2">
            <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Nouvelle catégorie"
              className="px-3 py-1.5 rounded-lg border border-border text-sm" />
            <button onClick={() => { if (newCat) { addCat(newCat); setNewCat(""); } }}
              className="px-3 py-1.5 rounded-lg bg-navy text-ivory text-sm">+</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => <span key={c} className="px-3 py-1 rounded-full bg-muted text-sm">{c}</span>)}
        </div>
      </Card>

      <div className="flex justify-between mb-3">
        <div className="font-display text-xl text-navy">Articles ({menu.length})</div>
        <button onClick={() => setEdit({ name: "", price: 0, category: cats[0], available: true })}
          className="px-4 py-2 rounded-full bg-coral text-ivory flex items-center gap-1"><Plus size={16} /> Ajouter</button>
      </div>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left p-3">Nom</th><th className="p-3">Catégorie</th><th className="p-3">Prix</th><th className="p-3">Dispo</th><th /></tr></thead>
          <tbody>
            {menu.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="p-3 font-medium text-navy">{m.name}</td>
                <td className="p-3 text-center text-muted-foreground">{m.category}</td>
                <td className="p-3 text-center text-coral">{m.price.toFixed(2)}€</td>
                <td className="p-3 text-center">
                  <input type="checkbox" checked={m.available} onChange={(e) => upd(m.id, { available: e.target.checked })} />
                </td>
                <td className="p-3 flex gap-2 justify-end">
                  <button onClick={() => setEdit(m)} className="text-ocean text-sm">Éditer</button>
                  <button onClick={() => rm(m.id)} className="text-coral"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {edit && (
        <div className="fixed inset-0 z-50 bg-navy/60 flex items-center justify-center p-4" onClick={() => setEdit(null)}>
          <div className="bg-ivory rounded-2xl p-6 w-full max-w-md space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="font-display text-2xl">{edit.id ? "Éditer" : "Nouvel"} article</div>
            <input value={edit.name ?? ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="Nom" className="w-full px-3 py-2 rounded-xl border border-border" />
            <textarea value={edit.description ?? ""} maxLength={80} onChange={(e) => setEdit({ ...edit, description: e.target.value })} placeholder="Description (max 80)" className="w-full px-3 py-2 rounded-xl border border-border" />
            <input type="number" step="0.5" value={edit.price ?? 0} onChange={(e) => setEdit({ ...edit, price: Number(e.target.value) })} placeholder="Prix" className="w-full px-3 py-2 rounded-xl border border-border" />
            <select value={edit.category ?? cats[0]} onChange={(e) => setEdit({ ...edit, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border">
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
            <label className="flex items-center gap-2"><input type="checkbox" checked={edit.available ?? true} onChange={(e) => setEdit({ ...edit, available: e.target.checked })} /> Disponible</label>
            <button onClick={() => {
              if (!edit.name) return;
              if (edit.id) upd(edit.id, edit); else add({ name: edit.name, price: edit.price ?? 0, category: edit.category ?? cats[0], available: edit.available ?? true, description: edit.description });
              setEdit(null);
            }} className="w-full py-3 rounded-full bg-coral text-ivory">Enregistrer</button>
          </div>
        </div>
      )}
    </>
  );
}

function HousekeepingMod() {
  const list = useRiviera((s) => s.housekeeping);
  const upd = useRiviera((s) => s.updateHousekeeping);
  return (
    <>
      <H>Demandes d'entretien</H>
      <div className="space-y-3">
        {list.length === 0 && <Card><div className="text-center text-muted-foreground py-6">Aucune demande</div></Card>}
        {list.map((h) => (
          <Card key={h.id} className="flex gap-4">
            <div className="text-2xl font-display text-navy w-14">{h.room}</div>
            <div className="flex-1">
              <div className="font-medium">{h.guest} <span className="text-xs text-muted-foreground">— {new Date(h.createdAt).toLocaleString("fr-FR")}</span></div>
              <ul className="mt-1 text-sm text-muted-foreground">{h.items.map((x) => <li key={x}>• {x}</li>)}</ul>
              <div className="text-xs mt-1">Préférence : {h.preferredTime}</div>
            </div>
            <select value={h.status} onChange={(e) => upd(h.id, { status: e.target.value as typeof h.status })}
              className="px-2 py-1 rounded border border-border h-fit">
              {["En attente","En cours","Terminé"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </Card>
        ))}
      </div>
    </>
  );
}

function MaintenanceMod() {
  const list = useRiviera((s) => s.maintenance);
  const upd = useRiviera((s) => s.updateMaintenance);
  return (
    <>
      <H>Suivi Maintenance</H>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="p-3">Chambre</th><th className="p-3">Catégorie</th><th className="p-3 text-left">Description</th><th className="p-3">Urgence</th><th className="p-3">Statut</th></tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan={5} className="text-center text-muted-foreground py-6">Aucune intervention</td></tr>}
            {list.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="p-3 text-center font-medium">{m.room}</td>
                <td className="p-3 text-center">{m.category}</td>
                <td className="p-3 text-sm">{m.description || "—"}</td>
                <td className="p-3 text-center">
                  {m.urgent ? <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />Urgent</span> : "Normal"}
                </td>
                <td className="p-3 text-center">
                  <select value={m.status} onChange={(e) => upd(m.id, { status: e.target.value as typeof m.status })}
                    className="px-2 py-1 rounded border border-border">
                    {["Nouveau","En intervention","Résolu"].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function Feedback() {
  const list = useRiviera((s) => s.feedback);
  const avg = (k: "overall" | "cleanliness" | "food" | "staff" | "value") =>
    list.length ? list.reduce((s, f) => s + f.ratings[k], 0) / list.length : 0;
  return (
    <>
      <H>Avis & Recommandations</H>
      <div className="grid grid-cols-5 gap-3 mb-6">
        {([
          ["overall", "Global"], ["cleanliness", "Propreté"], ["food", "Restauration"], ["staff", "Personnel"], ["value", "Valeur"],
        ] as const).map(([k, l]) => (
          <Card key={k}>
            <div className="text-xs text-muted-foreground">{l}</div>
            <div className="flex items-center gap-1 mt-2 text-coral">
              <span className="font-display text-3xl">{avg(k).toFixed(1)}</span>
              <Star className="fill-sand text-sand" size={20} />
            </div>
          </Card>
        ))}
      </div>
      <div className="space-y-3">
        {list.length === 0 && <Card><div className="text-center text-muted-foreground py-6">Aucun avis</div></Card>}
        {list.map((f) => (
          <Card key={f.id}>
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{f.guest} <span className="text-xs text-muted-foreground">— Ch. {f.room}</span></div>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < f.ratings.overall ? "fill-sand text-sand" : "text-muted-foreground"} />)}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(f.createdAt).toLocaleDateString("fr-FR")}</div>
            </div>
            {f.comment && <p className="mt-3 italic text-sm text-foreground/80">"{f.comment}"</p>}
            {f.callback && <div className="mt-2 text-xs text-coral">Recontacter : {f.callback}</div>}
          </Card>
        ))}
      </div>
    </>
  );
}

function Gallery() {
  const list = useRiviera((s) => s.gallery);
  const add = useRiviera((s) => s.addGalleryItem);
  const rm = useRiviera((s) => s.removeGalleryItem);
  const [f, setF] = useState({ src: "", caption: "", category: "Chambres" });
  return (
    <>
      <H>Galerie</H>
      <Card className="mb-6 grid md:grid-cols-4 gap-3 items-end">
        <input value={f.src} onChange={(e) => setF({ ...f, src: e.target.value })} placeholder="URL de l'image" className="px-3 py-2 rounded-xl border border-border md:col-span-2" />
        <input value={f.caption} onChange={(e) => setF({ ...f, caption: e.target.value })} placeholder="Légende" className="px-3 py-2 rounded-xl border border-border" />
        <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="px-3 py-2 rounded-xl border border-border">
          {["Chambres","Piscine","Plage","Restaurants","Événements"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => { if (f.src) { add(f); setF({ src: "", caption: "", category: "Chambres" }); } }}
          className="md:col-span-4 px-4 py-2 rounded-full bg-coral text-ivory">Ajouter</button>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {list.map((g) => (
          <div key={g.id} className="relative rounded-2xl overflow-hidden">
            <img src={g.src} alt="" className="w-full h-40 object-cover" />
            <button onClick={() => rm(g.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-ivory/90 flex items-center justify-center text-coral"><Trash2 size={14} /></button>
            <div className="absolute bottom-0 inset-x-0 bg-navy/70 text-ivory text-xs p-2">{g.category}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function QrModule() {
  const rooms = useRiviera((s) => s.rooms);
  const settings = useRiviera((s) => s.settings);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const print = () => window.print();
  return (
    <>
      <div className="flex justify-between items-center mb-6 print:hidden">
        <H>QR Codes</H>
        <button onClick={print} className="px-4 py-2 rounded-full bg-navy text-ivory flex items-center gap-2"><Printer size={16} /> Imprimer</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {rooms.map((r) => (
          <div key={r.number} className="bg-white border border-border rounded-2xl p-4 text-center">
            <div className="text-xs uppercase tracking-widest text-ocean">{settings.hotelName}</div>
            <QRCode value={`${origin}/chambre/${r.number}`} size={128} className="mx-auto my-3" />
            <div className="font-display text-lg text-navy">Chambre {r.number}</div>
          </div>
        ))}
        {[
          ["restaurant", "Menu Restaurant"], ["bar", "Menu Bar"],
          ["petit-dejeuner", "Petit-Déjeuner"], ["room-service", "Room Service"],
        ].map(([k, l]) => (
          <div key={k} className="bg-white border border-border rounded-2xl p-4 text-center">
            <div className="text-xs uppercase tracking-widest text-ocean">{settings.hotelName}</div>
            <QRCode value={`${origin}/menu/${k}`} size={128} className="mx-auto my-3" />
            <div className="font-display text-lg text-navy">{l}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function Params() {
  const s = useRiviera((x) => x.settings);
  const upd = useRiviera((x) => x.updateSettings);
  const reset = useRiviera((x) => x.resetAll);
  const [pin, setPin] = useState("");
  const [orders, gallery] = [useRiviera((x) => x.orders), useRiviera((x) => x.gallery)];

  return (
    <>
      <H>Paramètres</H>
      <Card className="mb-6">
        <div className="font-display text-lg mb-4">Informations hôtel</div>
        <div className="grid md:grid-cols-2 gap-3">
          {([
            ["hotelName", "Nom"], ["address", "Adresse"], ["phone", "Téléphone"],
            ["email", "Email"], ["whatsapp", "WhatsApp (sans +)"], ["instagram", "Instagram"],
          ] as const).map(([k, l]) => (
            <div key={k}>
              <label className="text-xs text-muted-foreground">{l}</label>
              <input value={s[k]} onChange={(e) => upd({ [k]: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-xl border border-border" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <div className="font-display text-lg mb-4">Sécurité</div>
        <div className="grid md:grid-cols-2 gap-3 items-end">
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Nouveau PIN (4 chiffres)" className="px-3 py-2 rounded-xl border border-border" />
          <button onClick={() => { if (/^\d{4}$/.test(pin)) { upd({ pin: btoa(pin) }); setPin(""); alert("PIN modifié"); } }}
            className="px-4 py-2 rounded-full bg-navy text-ivory">Mettre à jour</button>
          <div>
            <label className="text-xs text-muted-foreground">Auto-lock (minutes)</label>
            <select value={s.autoLockMin} onChange={(e) => upd({ autoLockMin: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-border">
              {[5,15,30].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 mt-4">
            <input type="checkbox" checked={s.notifSound} onChange={(e) => upd({ notifSound: e.target.checked })} />
            Son de notification (room service)
          </label>
        </div>
      </Card>

      <Card>
        <div className="font-display text-lg mb-3">Données</div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => {
            const blob = new Blob([JSON.stringify({ orders, gallery, settings: s }, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = `ramatou-export-${Date.now()}.json`; a.click();
          }} className="px-4 py-2 rounded-full bg-tropical text-ivory">Exporter JSON</button>
          <button onClick={() => { if (confirm("Tout réinitialiser ?")) reset(); }}
            className="px-4 py-2 rounded-full bg-destructive text-ivory">Réinitialiser</button>
        </div>
      </Card>
    </>
  );
}
