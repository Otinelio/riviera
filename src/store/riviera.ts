import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number; // EUR
  category: string;
  available: boolean;
  tags?: string[];
  image?: string;
};

export type RoomStatus = "Libre" | "Occupée" | "Maintenance" | "Nettoyage";
export type RoomRecord = {
  number: string;
  type: "double-standard" | "double-vue-mer" | "suite-kitchenette";
  status: RoomStatus;
  guestName?: string;
  checkoutDate?: string;
  lastCleaned?: string;
};

export type Order = {
  id: number;
  room: string;
  guest: string;
  items: { id: string; name: string; qty: number; price: number }[];
  total: number;
  instructions?: string;
  status: "Nouveau" | "En préparation" | "En livraison" | "Livré";
  createdAt: string;
};

export type Reservation = {
  id: number;
  room: string;
  client: string;
  arrival: string;
  departure: string;
  type: string;
  status: "Confirmé" | "En attente" | "Annulé" | "Check-in";
};

export type Housekeeping = {
  id: number;
  room: string;
  guest: string;
  items: string[];
  preferredTime: string;
  status: "En attente" | "En cours" | "Terminé";
  assignedTo?: string;
  createdAt: string;
};

export type MaintenanceReq = {
  id: number;
  room: string;
  guest: string;
  category: string;
  description?: string;
  urgent: boolean;
  status: "Nouveau" | "En intervention" | "Résolu";
  notes?: string;
  createdAt: string;
};

export type Feedback = {
  id: number;
  room: string;
  guest: string;
  ratings: { overall: number; cleanliness: number; food: number; staff: number; value: number };
  comment?: string;
  callback?: string;
  createdAt: string;
};

export type GalleryItem = { id: string; src: string; caption?: string; category: string };

export type Settings = {
  hotelName: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  pin: string; // btoa
  receptionPin: string;
  autoLockMin: number;
  notifSound: boolean;
  tarifs: {
    breakfastAdult: number;
    breakfastChild: number;
    extraBed: number;
    shuttle: number;
  };
};

const defaultMenu: MenuItem[] = [
  { id: "pd-1", name: "Plateau continental", description: "Croissant, jus, café", price: 7, category: "Petit-Déjeuner", available: true },
  { id: "pd-2", name: "Omelette nature", price: 4, category: "Petit-Déjeuner", available: true },
  { id: "pd-3", name: "Assiette de fruits tropicaux", price: 5, category: "Petit-Déjeuner", available: true },
  { id: "pl-1", name: "Grillades poisson du jour", price: 12, category: "Plats", available: true, tags: ["Populaire"] },
  { id: "pl-2", name: "Riz sauce tomate", price: 6, category: "Plats", available: true },
  { id: "pl-3", name: "Poulet yassa", price: 10, category: "Plats", available: true, tags: ["Populaire"] },
  { id: "pl-4", name: "Brochettes de bœuf", price: 11, category: "Plats", available: true },
  { id: "bo-1", name: "Eau minérale 50cl", price: 1.5, category: "Boissons", available: true },
  { id: "bo-2", name: "Jus de bissap", price: 2, category: "Boissons", available: true },
  { id: "bo-3", name: "Cocktail sans alcool", price: 4, category: "Boissons", available: true },
  { id: "bo-4", name: "Bière locale", price: 3, category: "Boissons", available: true },
  { id: "sn-1", name: "Sandwich club", price: 6, category: "Snacks", available: true },
  { id: "sn-2", name: "Accras de crevettes", price: 5, category: "Snacks", available: true },
  { id: "de-1", name: "Salade de fruits", price: 4, category: "Desserts", available: true },
  { id: "de-2", name: "Gâteau du jour", price: 5, category: "Desserts", available: true },
];

const defaultRooms: RoomRecord[] = Array.from({ length: 15 }, (_, i) => {
  const n = String(101 + i);
  const type: RoomRecord["type"] =
    i < 8 ? "double-standard" : i < 13 ? "double-vue-mer" : "suite-kitchenette";
  return { number: n, type, status: "Libre" as RoomStatus };
});

const defaultCategories = ["Petit-Déjeuner", "Plats", "Boissons", "Snacks", "Desserts", "Menu Bar"];

type State = {
  settings: Settings;
  categories: string[];
  menu: MenuItem[];
  rooms: RoomRecord[];
  orders: Order[];
  reservations: Reservation[];
  housekeeping: Housekeeping[];
  maintenance: MaintenanceReq[];
  feedback: Feedback[];
  gallery: GalleryItem[];

  // actions
  updateSettings: (s: Partial<Settings>) => void;
  setRoomStatus: (number: string, status: RoomStatus, extra?: Partial<RoomRecord>) => void;
  addOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => void;
  updateOrderStatus: (id: number, status: Order["status"]) => void;
  addReservation: (r: Omit<Reservation, "id">) => void;
  updateReservation: (id: number, patch: Partial<Reservation>) => void;
  removeReservation: (id: number) => void;
  addHousekeeping: (h: Omit<Housekeeping, "id" | "createdAt" | "status">) => void;
  updateHousekeeping: (id: number, patch: Partial<Housekeeping>) => void;
  addMaintenance: (m: Omit<MaintenanceReq, "id" | "createdAt" | "status">) => void;
  updateMaintenance: (id: number, patch: Partial<MaintenanceReq>) => void;
  addFeedback: (f: Omit<Feedback, "id" | "createdAt">) => void;
  addCategory: (c: string) => void;
  removeCategory: (c: string) => void;
  addMenuItem: (m: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  removeMenuItem: (id: string) => void;
  addGalleryItem: (g: Omit<GalleryItem, "id">) => void;
  removeGalleryItem: (id: string) => void;
  resetAll: () => void;
};

const defaultSettings: Settings = {
  hotelName: "Hotel Riviera Ramatou Plage",
  address: "Zone du Port Autonome, Baguida Beach, Lomé, Togo",
  phone: "+228 90 00 00 00",
  email: "contact@ramatouplage.tg",
  whatsapp: "22890000000",
  instagram: "ramatouplage",
  pin: typeof btoa !== "undefined" ? btoa("9999") : "MTIzNA==",
  receptionPin: typeof btoa !== "undefined" ? btoa("0000") : "MDAwMA==",
  autoLockMin: 15,
  notifSound: true,
  tarifs: { breakfastAdult: 7, breakfastChild: 7, extraBed: 10, shuttle: 20 },
};

const initial = {
  settings: defaultSettings,
  categories: defaultCategories,
  menu: defaultMenu,
  rooms: defaultRooms,
  orders: [] as Order[],
  reservations: [] as Reservation[],
  housekeeping: [] as Housekeeping[],
  maintenance: [] as MaintenanceReq[],
  feedback: [] as Feedback[],
  gallery: [] as GalleryItem[],
};

export const useRiviera = create<State>()(
  persist(
    (set) => ({
      ...initial,
      updateSettings: (s) => set((st) => ({ settings: { ...st.settings, ...s } })),
      setRoomStatus: (number, status, extra) =>
        set((st) => ({
          rooms: st.rooms.map((r) => (r.number === number ? { ...r, status, ...extra } : r)),
        })),
      addOrder: (o) =>
        set((st) => ({
          orders: [
            { ...o, id: Date.now(), createdAt: new Date().toISOString(), status: "Nouveau" as const },
            ...st.orders,
          ].slice(0, 500),
        })),
      updateOrderStatus: (id, status) =>
        set((st) => ({ orders: st.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
      addReservation: (r) => set((st) => ({ reservations: [{ ...r, id: Date.now() }, ...st.reservations] })),
      updateReservation: (id, patch) =>
        set((st) => ({ reservations: st.reservations.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
      removeReservation: (id) => set((st) => ({ reservations: st.reservations.filter((r) => r.id !== id) })),
      addHousekeeping: (h) =>
        set((st) => ({
          housekeeping: [
            { ...h, id: Date.now(), createdAt: new Date().toISOString(), status: "En attente" },
            ...st.housekeeping,
          ],
        })),
      updateHousekeeping: (id, patch) =>
        set((st) => ({ housekeeping: st.housekeeping.map((h) => (h.id === id ? { ...h, ...patch } : h)) })),
      addMaintenance: (m) =>
        set((st) => ({
          maintenance: [
            { ...m, id: Date.now(), createdAt: new Date().toISOString(), status: "Nouveau" },
            ...st.maintenance,
          ],
        })),
      updateMaintenance: (id, patch) =>
        set((st) => ({ maintenance: st.maintenance.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
      addFeedback: (f) =>
        set((st) => ({
          feedback: [{ ...f, id: Date.now(), createdAt: new Date().toISOString() }, ...st.feedback],
        })),
      addCategory: (c) =>
        set((st) => (st.categories.includes(c) ? st : { categories: [...st.categories, c] })),
      removeCategory: (c) =>
        set((st) =>
          st.menu.some((m) => m.category === c) ? st : { categories: st.categories.filter((x) => x !== c) }
        ),
      addMenuItem: (m) => set((st) => ({ menu: [...st.menu, { ...m, id: `m-${Date.now()}` }] })),
      updateMenuItem: (id, patch) =>
        set((st) => ({ menu: st.menu.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
      removeMenuItem: (id) => set((st) => ({ menu: st.menu.filter((m) => m.id !== id) })),
      addGalleryItem: (g) => set((st) => ({ gallery: [...st.gallery, { ...g, id: `g-${Date.now()}` }] })),
      removeGalleryItem: (id) => set((st) => ({ gallery: st.gallery.filter((g) => g.id !== id) })),
      resetAll: () => set(() => initial),
    }),
    {
      name: "riviera_store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : ({
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
            length: 0,
            clear: () => { },
            key: () => null,
          } as Storage)
      ),
    }
  )
);

export function waLinkFromStore(message: string, whatsapp: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
