import { createFileRoute } from "@tanstack/react-router";
import { useRiviera, waLinkFromStore } from "@/store/riviera";
import { Waves, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/menu/$menuType")({
  head: () => ({
    meta: [
      { title: "Menu Digital — Ramatou Plage" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MenuPage,
});

const labels: Record<string, { title: string; cats: string[] }> = {
  restaurant: { title: "Menu Restaurant", cats: ["Petit-Déjeuner", "Plats", "Boissons", "Snacks", "Desserts"] },
  bar: { title: "Menu Bar", cats: ["Boissons", "Snacks", "Menu Bar"] },
  "petit-dejeuner": { title: "Carte Petit-Déjeuner", cats: ["Petit-Déjeuner"] },
  "room-service": { title: "Room Service", cats: ["Petit-Déjeuner", "Plats", "Boissons", "Snacks", "Desserts"] },
};

function MenuPage() {
  const { menuType } = Route.useParams();
  const menu = useRiviera((s) => s.menu);
  const settings = useRiviera((s) => s.settings);
  const conf = labels[menuType] ?? labels.restaurant;
  const items = menu.filter((m) => m.available && conf.cats.includes(m.category));

  return (
    <div className="min-h-screen bg-ivory">
      <header className="bg-ocean text-ivory">
        <div className="container mx-auto px-6 py-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-ivory/10 flex items-center justify-center"><Waves /></div>
          <div>
            <div className="text-sand text-xs uppercase tracking-[0.4em]">Riviera Ramatou Plage</div>
            <h1 className="font-display text-4xl">{conf.title}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 pb-28 max-w-3xl">
        {conf.cats.map((c) => {
          const list = items.filter((m) => m.category === c);
          if (!list.length) return null;
          return (
            <section key={c} className="mb-10">
              <h2 className="font-display text-3xl text-ocean border-b border-ocean/20 pb-3 mb-5">{c}</h2>
              <div className="divide-y divide-border">
                {list.map((m) => (
                  <div key={m.id} className="py-4 flex items-baseline gap-4">
                    <div className="flex-1">
                      <div className="font-medium text-navy">{m.name}</div>
                      {m.description && <div className="text-sm text-muted-foreground">{m.description}</div>}
                      {m.tags?.length ? (
                        <div className="mt-1 flex gap-1.5">
                          {m.tags.map((t) => <span key={t} className="text-[10px] uppercase tracking-widest text-tropical">{t}</span>)}
                        </div>
                      ) : null}
                    </div>
                    <div className="font-display text-xl text-sand whitespace-nowrap">{m.price.toFixed(2)}€</div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <a href={waLinkFromStore(`Bonjour, je souhaite commander depuis le ${conf.title}.`, settings.whatsapp)}
        target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 px-5 py-4 rounded-full bg-coral text-ivory shadow-elegant flex items-center gap-2">
        <MessageCircle size={18} /> Commander via WhatsApp
      </a>
    </div>
  );
}
